# Design Components for ChatGPT Apps

> **Source:** [OpenAI Apps SDK - Design Components](https://developers.openai.com/apps-sdk/plan/components)  
> Plan your UI components before building

## Component Planning Overview

Before writing any component code, **plan the structure, state, and interactions** your UI will need.

### Why Plan Components Early?

- 🎯 **Align on UX** before implementation
- 🔄 **Define state flow** between chat and component
- 📏 **Set layout constraints** for responsive design
- 🐛 **Plan debugging** and telemetry upfront

This planning phase prevents costly refactors later.

---

## Step 1: Map Tools to Components

Not every tool needs a custom component. Decide the **right rendering strategy** for each tool.

### Rendering Strategies

#### 1. Component (Visual UI)

**Use when:**
- ✅ Data is best shown visually (charts, cards, tables)
- ✅ User needs to take actions (buttons, forms)
- ✅ Comparison or selection is involved
- ✅ Rich media needs to display (images, videos)

**Examples:**
```
✓ Hotel search results → Card carousel
✓ Flight options → Comparison table
✓ Calendar → Visual grid
✓ Product gallery → Image grid
```

#### 2. JSON Only (No UI)

**Use when:**
- ✅ Data is simple and conversational text suffices
- ✅ No user interaction needed
- ✅ Model will use data for reasoning
- ✅ Next step is another tool call

**Examples:**
```
✓ Check availability → Boolean + text
✓ Get user ID → String
✓ Validate input → Success/failure message
```

#### 3. Hybrid (Both)

**Use when:**
- ✅ Component enhances UX but model also needs structured data
- ✅ User might want to see visual + have model reason about it
- ✅ Follow-up actions depend on the data

**Examples:**
```
✓ Search results → Component for user + JSON for model to filter
✓ Form → Visual for editing + JSON for validation
✓ Report → Visual summary + JSON for detailed analysis
```

### Decision Matrix

| Tool Type | Component? | Why |
|-----------|------------|-----|
| `search_hotels` | Yes | Visual comparison critical |
| `get_hotel_details` | Yes | Images, amenities, map |
| `check_availability` | No | Simple yes/no answer |
| `book_hotel` | Yes | Confirmation needed |
| `get_booking_id` | No | Just return ID for follow-up |
| `list_amenities` | Maybe | Depends on count |

---

## Step 2: Choose the Right Display Mode

Components can render in different modes. **Choose based on the interaction pattern**.

### Display Mode Options

#### Inline (Default)

**Purpose:** Quick results embedded in conversation

**Use for:**
- Single item details
- Small lists (3-7 items)
- Status updates
- Confirmations

**Layout:**
- Width: 100% of chat width
- Height: Auto, but keep under 500px
- Scrolling: Vertical only, minimal

**Examples:**
```
✓ Weather card
✓ Quick fact lookup
✓ Single product card
✓ Booking confirmation
```

#### Carousel (Inline Variant)

**Purpose:** Multiple items for browsing/comparison

**Use for:**
- Search results
- Product listings
- Options/alternatives
- Image galleries

**Layout:**
- Cards: 250-350px wide each
- Scrolling: Horizontal
- Count: 3-10 cards optimal

**Examples:**
```
✓ Hotel search results
✓ Flight options
✓ Restaurant recommendations
✓ Product variants
```

#### Fullscreen

**Purpose:** Complex workflows or detailed content

**Use for:**
- Multi-step forms
- Detailed views with lots of data
- Rich media experiences
- Complex configurations

**Layout:**
- Width: Full viewport
- Height: Full viewport
- Scrolling: Vertical
- Navigation: Back button required

**Examples:**
```
✓ Booking form
✓ Image editor
✓ Detailed report
✓ Configuration wizard
```

#### Picture-in-Picture (PiP)

**Purpose:** Ongoing parallel activities

**Use for:**
- Games
- Videos
- Live collaboration
- Real-time activities

**Behavior:**
- Floats on scroll
- Updates reactively
- Dismissible
- Session-scoped

**Examples:**
```
✓ Chess game
✓ Video call
✓ Live whiteboard
✓ Music player
```

### Display Mode Decision Tree

```
Is this an ongoing activity (game, video, collaboration)?
├─ Yes → Picture-in-Picture
└─ No
    ├─ Does it need > 500px height or multi-step workflow?
    │   ├─ Yes → Fullscreen
    │   └─ No
    │       ├─ Is it multiple items for comparison?
    │       │   ├─ Yes → Carousel
    │       │   └─ No → Inline
```

---

## Step 3: Inventory Data Dependencies

For each component, document **what data it needs** and **where it comes from**.

### Data Source Checklist

#### From Tool Response

**Structured content** returned by the tool:

```javascript
// Tool returns this
{
  structuredContent: {
    items: [...],
    filters: {...},
    pagination: {...}
  }
}

// Component receives via window.openai.toolOutput
const data = window.openai?.toolOutput;
```

#### From Conversation Context

**Information** from earlier in the conversation:

```javascript
// Model provides context
{
  userPreferences: { budget: 1000, location: "Seattle" },
  previousSelection: { hotel_id: "h123" }
}
```

#### From Linked Account

**User-specific data** requiring authentication:

```javascript
// Account info after OAuth
{
  user: {
    id: "user_456",
    name: "Jane Doe",
    email: "jane@example.com",
    preferences: {...}
  }
}
```

#### From Follow-up Tool Calls

**Additional data** fetched by component calling tools:

```javascript
// Component triggers tool
await window.openai.callTool("get_hotel_details", {
  hotel_id: selectedId
});
```

### Data Dependency Template

```markdown
## Component: Hotel Search Results

### Data Sources

**From Tool Response (search_hotels):**
- `results[]` - Array of hotel objects
  - id, name, price, rating, image, location
- `filters` - Active filter state
- `pagination` - Current page, total, hasMore

**From Conversation Context:**
- `userLocation` - For "near me" searches
- `travelDates` - For availability checking
- `partySize` - For room requirements

**From Linked Account:**
- `rewardsStatus` - Show member benefits
- `savedHotels` - Mark favorites
- `bookingHistory` - "Book again" suggestions

**From Follow-up Tools:**
- `get_hotel_details()` - On card click
- `check_availability()` - On date change
- `get_reviews()` - On "See reviews" click

### Authentication Required
- No - for basic search
- Yes - for booking, saved hotels, rewards
```

---

## Step 4: Define the State Contract

Because components and chat share conversation state, **be explicit about what is stored where**.

### State Types

#### Component State (Ephemeral)

**Stored:** In component memory only  
**Lifetime:** Current component instance  
**Use for:** Temporary UI state

```javascript
// Component-only state
{
  selectedItemId: "hotel_123",
  scrollPosition: 245,
  expandedSections: ["amenities", "reviews"],
  formValidationErrors: {...}
}
```

#### Widget State (Persistent During Conversation)

**Stored:** Via `window.openai.setWidgetState()`  
**Lifetime:** Current conversation  
**Use for:** State that should survive tool calls

```javascript
// Persist via setWidgetState
window.openai.setWidgetState({
  currentFilters: { price: 200, rating: 4 },
  selectedHotelId: "hotel_123",
  comparisonList: ["hotel_123", "hotel_456"]
});
```

#### Server State (Authoritative)

**Stored:** In your backend or built-in storage  
**Lifetime:** Across conversations  
**Use for:** User data, preferences, history

```javascript
// Stored in backend
{
  userId: "user_456",
  savedSearches: [...],
  bookingHistory: [...],
  preferences: {
    defaultFilters: {...},
    preferredView: "list"
  }
}
```

#### Model Messages (Conversational)

**Stored:** In chat transcript  
**Lifetime:** Conversation history  
**Use for:** Human-readable updates

```javascript
// Send follow-up message
window.openai.sendFollowUpMessage(
  "Selected Hotel California. Would you like to see room options?"
);
```

### State Flow Diagram

```
┌─────────────────┐
│  Tool Called    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tool Response  │ ──► structuredContent
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Component      │
│  Receives Data  │ ──► window.openai.toolOutput
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User           │
│  Interacts      │ ──► Click, select, type
└────────┬────────┘
         │
         ├──► Local state update (immediate)
         │
         ├──► Widget state update (persist)
         │    window.openai.setWidgetState(...)
         │
         ├──► Call tool (fetch data)
         │    window.openai.callTool(...)
         │
         └──► Send message (update transcript)
              window.openai.sendFollowUpMessage(...)
```

### State Contract Template

```markdown
## State Contract: Hotel Search Component

### Component State (Ephemeral)
```javascript
{
  hoveredCardId: string | null,
  tooltipOpen: boolean,
  imageCarouselIndex: number,
  sortDirection: "asc" | "desc"
}
```

### Widget State (Persisted)
```javascript
{
  selectedFilters: {
    priceRange: [number, number],
    rating: number,
    amenities: string[]
  },
  selectedHotelId: string | null,
  comparisonList: string[],
  viewMode: "grid" | "list"
}
```

### Server State
```javascript
{
  user: {
    id: string,
    savedHotels: string[],
    searchHistory: SearchQuery[],
    preferences: UserPreferences
  }
}
```

### Model Messages
- "Selected [Hotel Name]"
- "Added [Hotel Name] to comparison"
- "Filtered to show only 4+ star hotels"
```

---

## Step 5: Design for Responsive Layouts

Components run in an iframe on **both desktop and mobile**.

### Layout Constraints

#### Width
- **Desktop:** Max 800px (within chat width)
- **Mobile:** 100vw (full width)
- **Breakpoint:** 640px

#### Height
- **Inline:** Auto, typically 200-500px
- **Carousel:** Auto, typically 300-400px
- **Fullscreen:** 100vh
- **PiP:** 250-350px

### Responsive Strategies

#### Adaptive Breakpoints

```css
/* Mobile first */
.card {
  padding: 12px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 640px) {
  .card {
    padding: 16px;
    font-size: 16px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    padding: 20px;
    font-size: 16px;
  }
}
```

#### Collapse Gracefully

```css
/* Stack on mobile */
.hotel-card {
  display: flex;
  flex-direction: column;
}

/* Side-by-side on desktop */
@media (min-width: 640px) {
  .hotel-card {
    flex-direction: row;
  }
}
```

### Accessible Design

#### Color and Contrast

```css
/* Respect system dark mode */
:root {
  color-scheme: light dark;
}

/* Light mode */
@media (prefers-color-scheme: light) {
  :root {
    --bg: #ffffff;
    --text: #000000;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #ffffff;
  }
}
```

#### Focus States

```css
/* Keyboard navigation */
button:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

/* Touch targets (minimum 44x44px) */
button, a {
  min-height: 44px;
  min-width: 44px;
}
```

### Responsive Design Checklist

- [ ] **Breakpoints defined** for mobile, tablet, desktop
- [ ] **Touch targets** minimum 44x44px
- [ ] **Text remains readable** on all screen sizes
- [ ] **Images scale** appropriately
- [ ] **Navigation accessible** on mobile
- [ ] **Dark mode** supported via color-scheme
- [ ] **Focus indicators** visible
- [ ] **Keyboard navigation** works

---

## Step 6: Plan Component Interactions

Define **how users interact** with your component.

### Interaction Types

#### 1. Selection

**Pattern:** User selects an item

```javascript
// On click/tap
function handleSelect(itemId) {
  // Update component state
  setSelectedId(itemId);
  
  // Persist selection
  window.openai.setWidgetState({ selectedItemId: itemId });
  
  // Optional: Fetch details
  await window.openai.callTool("get_details", { id: itemId });
  
  // Optional: Update conversation
  window.openai.sendFollowUpMessage(`Selected: ${itemName}`);
}
```

#### 2. Filtering

**Pattern:** User refines results

```javascript
function handleFilterChange(filters) {
  // Update component state
  setFilters(filters);
  
  // Persist filters
  window.openai.setWidgetState({ filters });
  
  // Re-fetch with new filters
  await window.openai.callTool("search", { ...filters });
}
```

#### 3. Form Submission

**Pattern:** User completes a form

```javascript
async function handleSubmit(formData) {
  // Validate
  const errors = validateForm(formData);
  if (errors) {
    setErrors(errors);
    return;
  }
  
  // Submit
  setLoading(true);
  await window.openai.callTool("create_booking", formData);
  setLoading(false);
  
  // Confirm
  window.openai.sendFollowUpMessage("Booking created!");
}
```

#### 4. Pagination

**Pattern:** User loads more results

```javascript
async function handleLoadMore() {
  const currentPage = widgetState.page || 1;
  
  // Update state
  window.openai.setWidgetState({ page: currentPage + 1 });
  
  // Fetch next page
  await window.openai.callTool("search", {
    ...currentFilters,
    page: currentPage + 1
  });
}
```

#### 5. Expansion

**Pattern:** User opens fullscreen

```javascript
function handleExpand() {
  // Component can request fullscreen
  window.openai.requestFullscreen();
}
```

### Interaction Flow Template

```markdown
## Component Interactions: Hotel Search

### 1. Select Hotel
**Trigger:** Click hotel card  
**Component State:** `selectedHotelId = clicked_id`  
**Widget State:** `{ selectedHotelId }`  
**Tool Call:** `get_hotel_details(id)`  
**Message:** "Selected [Hotel Name]"

### 2. Filter Results
**Trigger:** Change filter dropdown/slider  
**Component State:** `filters = new_filters`  
**Widget State:** `{ filters }`  
**Tool Call:** `search_hotels({ ...filters })`  
**Message:** None (results update inline)

### 3. Compare Hotels
**Trigger:** Click "Compare" button  
**Component State:** `comparisonList.push(hotel_id)`  
**Widget State:** `{ comparisonList }`  
**Tool Call:** None  
**Message:** "Added to comparison ([count] hotels)"

### 4. Book Hotel
**Trigger:** Click "Book Now" button  
**Component State:** None  
**Widget State:** `{ bookingFlow: "started", hotelId }`  
**Tool Call:** `start_booking({ hotel_id })`  
**Message:** "Starting booking for [Hotel Name]..."
**Display:** Expand to fullscreen booking form
```

---

## Step 7: Plan Telemetry and Debugging

**Inline experiences are hardest to debug** without instrumentation.

### Telemetry Plan

#### Analytics Events

```javascript
// Component load
trackEvent("component_loaded", {
  component: "hotel_search",
  tool: "search_hotels",
  resultCount: results.length,
  loadTime: performance.now() - startTime
});

// User interaction
trackEvent("hotel_selected", {
  hotelId: id,
  position: index,
  source: "card_click"
});

// Error
trackEvent("component_error", {
  component: "hotel_search",
  error: error.message,
  toolCallId: toolId
});
```

#### Debug Logging

```javascript
// Development only
if (process.env.NODE_ENV === "development") {
  console.log("[HotelSearch] Received data:", data);
  console.log("[HotelSearch] Current state:", state);
  console.log("[HotelSearch] Calling tool:", toolName, params);
}
```

#### Tool Call Tracing

```javascript
// Log tool call ID alongside telemetry
const response = await window.openai.callTool("search", params);
console.log("[Trace] Tool call ID:", response.id);
trackEvent("tool_called", {
  tool: "search",
  params,
  callId: response.id
});
```

### Fallback Handling

```javascript
// Graceful degradation
try {
  renderComponent(data);
} catch (error) {
  console.error("Component failed to render:", error);
  
  // Show fallback
  showFallback({
    message: "Unable to display results",
    data: JSON.stringify(data, null, 2),
    action: "Retry"
  });
  
  // Track error
  trackEvent("render_error", { error: error.message });
}
```

### Telemetry Checklist

- [ ] **Component load time** tracked
- [ ] **User interactions** logged
- [ ] **Tool calls** traced with IDs
- [ ] **Errors** captured and reported
- [ ] **Performance metrics** collected
- [ ] **Fallback UI** implemented
- [ ] **Debug mode** available
- [ ] **Privacy-compliant** (no PII in logs)

---

## Step 8: Document Component Spec

Create a **comprehensive spec** before implementation.

### Component Spec Template

```markdown
# Component Spec: Hotel Search Results

## Overview
**Component:** Hotel Search Results Carousel  
**Tool:** search_hotels  
**Display Mode:** Inline (Carousel)  
**Priority:** P0  
**Owner:** [Name]

## Data Dependencies

### From Tool Response
- results[] - Hotel objects
- filters - Active filters
- pagination - Page info

### From Conversation
- userLocation - For distance calc
- travelDates - For availability

### From Account
- rewardsStatus - Show benefits
- savedHotels - Mark favorites

## Display Mode
**Primary:** Inline Carousel  
**Secondary:** Can expand individual card to fullscreen

## State Management

### Component State (Ephemeral)
```javascript
{
  hoveredCardId: string | null,
  tooltipOpen: boolean
}
```

### Widget State (Persisted)
```javascript
{
  selectedFilters: FilterObject,
  selectedHotelId: string | null,
  comparisonList: string[]
}
```

## Interactions

### 1. Select Hotel
- Trigger: Click card
- Action: Fetch details, show in conversation
- State: Update selectedHotelId

### 2. Filter
- Trigger: Change filter
- Action: Re-search with new filters
- State: Update filters

### 3. Compare
- Trigger: Click compare button
- Action: Add to comparison list
- State: Update comparisonList

## Responsive Layout
- Mobile (<640px): Stack cards vertically, scroll horizontal
- Tablet (640-1024px): 2 cards visible
- Desktop (>1024px): 3 cards visible

## Accessibility
- Keyboard navigation supported
- Focus indicators visible
- Alt text for all images
- ARIA labels for buttons
- Color contrast WCAG AA

## Telemetry
- Track: Load time, interactions, tool calls, errors
- Debug: Development logs with state snapshots

## Success Criteria
- [ ] Renders in <1 second
- [ ] Keyboard navigable
- [ ] Works on mobile and desktop
- [ ] Handles empty state
- [ ] Handles error state
- [ ] Analytics instrumented
```

---

## Component Planning Checklist

Before moving to implementation:

- [ ] **Tool Mapping**
  - [ ] Rendering strategy chosen for each tool
  - [ ] Display modes selected
  - [ ] Component vs JSON decisions made

- [ ] **Data Dependencies**
  - [ ] Tool response structure defined
  - [ ] Conversation context identified
  - [ ] Account data requirements clear
  - [ ] Follow-up tools documented

- [ ] **State Contract**
  - [ ] Component state defined
  - [ ] Widget state defined
  - [ ] Server state defined
  - [ ] Model messages planned
  - [ ] State flow diagram created

- [ ] **Responsive Design**
  - [ ] Breakpoints defined
  - [ ] Layout strategies chosen
  - [ ] Dark mode support planned
  - [ ] Accessibility requirements met

- [ ] **Interactions**
  - [ ] All interaction patterns documented
  - [ ] State updates mapped
  - [ ] Tool calls planned
  - [ ] Messages defined

- [ ] **Telemetry**
  - [ ] Analytics events defined
  - [ ] Debug logging planned
  - [ ] Tool call tracing implemented
  - [ ] Fallback handling designed

- [ ] **Documentation**
  - [ ] Component specs written
  - [ ] Design reviewed
  - [ ] Engineering feasibility confirmed

---

## Next Steps

Once components are well-planned:

1. **Start implementation** with [Build ChatGPT UI](https://developers.openai.com/apps-sdk/build/ui)
2. **Reference** [UI Guidelines](./ui-guidelines.md) for visual design
3. **Follow** [Apps SDK Quickstart](./apps-sdk-quickstart.md) for code patterns

---

## Additional Resources

- [UI Guidelines](./ui-guidelines.md) - Visual design system
- [UX Principles](./ux-principles.md) - UX best practices
- [Apps SDK UI Library](https://www.npmjs.com/package/@openai/apps-sdk-ui) - React components

---

**Remember:** Planning components upfront prevents painful refactors later. Spend time here to save 10x in implementation!

