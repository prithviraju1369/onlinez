# ChatGPT Apps UX Principles

> **Source:** [OpenAI Apps SDK - UX Principles](https://developers.openai.com/apps-sdk/concepts/ux-principles)  
> Principles for building great ChatGPT apps

## Overview

Creating a great ChatGPT app is about delivering a **focused, conversational experience** that feels native to ChatGPT.

The goal is to design experiences that feel:
- ✅ **Consistent** with ChatGPT's interface
- ✅ **Useful** for accomplishing real tasks
- ✅ **Trustworthy** and reliable

Your app should extend ChatGPT in ways that add real value.

---

## Good vs. Bad Examples

### ✅ Good Examples

Tasks that are **conversational, time-bound, and easy to summarize visually** with a clear call to action:

- **Booking a ride** - "Book me an Uber to the airport"
- **Ordering food** - "Order pizza from my favorite place"
- **Checking availability** - "Is the conference room free tomorrow at 2pm?"
- **Tracking a delivery** - "Where is my package?"

### ❌ Poor Examples

Tasks that don't fit the conversational model:

- **Replicating long-form content** from a website
- **Requiring complex multi-step workflows** that break conversation flow
- **Using the space for ads** or irrelevant messaging
- **Showing static content** better suited for a webpage

---

## Three Core Requirements

An app should do at least one thing **better** because it lives in ChatGPT:

### 1. Conversational Leverage
Natural language, thread context, and multi-turn guidance unlock workflows that traditional UI cannot.

**Example:**
- ❌ Traditional: Fill out 10 form fields to book a flight
- ✅ In ChatGPT: "Book me a flight to NYC next Friday under $300"

### 2. Native Fit
The app feels embedded in ChatGPT, with seamless hand-offs between the model and your tools.

**Example:**
- The model understands context: "Book that hotel" (referring to one mentioned earlier)
- Smooth transitions between conversation and your app's UI

### 3. Composability
Actions are small, reusable building blocks that the model can mix with other apps to complete richer tasks.

**Example:**
- Search for restaurants → Book a table → Add to calendar
- Multiple apps working together in one conversation

---

## The Litmus Test

**Question:** Can you describe the clear benefit of running inside ChatGPT?

- ✅ **Yes** → Proceed with development
- ❌ **No** → Keep iterating before publishing

Your app should also **improve ChatGPT** by providing:
- 🧠 Something new to **know**
- 🎯 Something new to **do**
- 👁️ A better way to **show** information

---

## Five Essential UX Principles

### 1. Extract, Don't Port

**Don't:** Mirror your full website or native app inside ChatGPT

**Do:** Focus on the core jobs users hire your product for

#### How to Extract

1. Identify a few **atomic actions** that can be extracted as tools
2. Each tool should expose the **minimum inputs and outputs** needed
3. The model should be able to take the next step confidently

#### Example: Restaurant App

**Bad (Porting):**
```
Tools:
- view_homepage
- browse_menu
- read_about_us
- view_locations
- show_reviews
- display_promotions
```

**Good (Extracting):**
```
Tools:
- search_restaurants (location, cuisine, price)
- get_availability (restaurant_id, date, time, party_size)
- make_reservation (restaurant_id, date, time, party_size)
```

---

### 2. Design for Conversational Entry

Expect users to arrive:
- 🌫️ **Mid-conversation** with context from earlier messages
- 🎯 **With a specific task** in mind
- 🤔 **With fuzzy intent** that needs refinement

#### Your App Should Support

**A) Open-ended prompts**
```
User: "Help me plan a team offsite"
App: Offers suggestions, asks clarifying questions, shows options
```

**B) Direct commands**
```
User: "Book the conference room Thursday at 3pm"
App: Executes immediately with confirmation
```

**C) First-run onboarding**
```
User: "What can you do?"
App: Teaches new users how to engage through ChatGPT
```

#### Key Insight

Don't force users through a linear onboarding flow. Let them:
- Start where they are
- Add context progressively
- Jump directly to their goal if they know what they want

---

### 3. Treat ChatGPT as "Home"

**ChatGPT owns the overall experience.** Your app is a guest.

#### Your UI Should

✅ **Clarify actions**
- Confirm what's about to happen
- Show key details before proceeding

✅ **Capture inputs**
- Collect necessary information
- Use structured forms only when conversation can't suffice

✅ **Present structured results**
- Tables, lists, comparison views
- Visual summaries of data

#### Your UI Should NOT

❌ **Include ornamental components** that don't advance the task
❌ **Replicate navigation** (menus, tabs, breadcrumbs)
❌ **Manage history** (ChatGPT does this through conversation)
❌ **Handle confirmations** through custom modals (use conversation)

#### Example

**Bad:**
```html
<!-- Unnecessary navigation -->
<header>
  <nav>Home | Products | About | Contact</nav>
</header>
<main>
  <sidebar><!-- Category filters --></sidebar>
  <content><!-- Product list --></content>
</main>
<footer><!-- Links, social media --></footer>
```

**Good:**
```html
<!-- Just the essential information -->
<div class="product-results">
  <h2>Found 5 laptops under $1000</h2>
  <ul>
    <!-- Product cards with key info + actions -->
  </ul>
</div>
```

---

### 4. Optimize for Conversation, Not Navigation

The model handles **state management** and **routing**. Your app supplies the building blocks.

#### What Your App Provides

**Clear, declarative actions**
```javascript
{
  name: "book_appointment",
  description: "Books a medical appointment",
  parameters: {
    specialty: { type: "string" },
    date: { type: "string" },
    time: { type: "string" }
  }
}
```

**Concise responses**
- Tables, lists, or short paragraphs
- NOT dashboards or long pages
- Keep the chat moving

**Helpful follow-up suggestions**
```javascript
return {
  content: [{ type: "text", text: "Booked for Thursday at 2pm" }],
  suggestions: [
    "Add to calendar",
    "Send reminder email",
    "Find directions to office"
  ]
};
```

#### Anti-Pattern: Navigation-Heavy UI

❌ **Don't create:**
- Tabbed interfaces requiring clicking through sections
- Multi-page workflows with "Next/Back" buttons
- Dashboards with multiple unrelated widgets

✅ **Instead provide:**
- Single-purpose views
- Clear actions the model can invoke
- Suggestions for what to do next

---

### 5. Embrace the Ecosystem Moment

Highlight what is **unique** about your app inside ChatGPT.

#### Accept Rich Natural Language

**Traditional Form:**
```
Location: [________]
Radius: [_] miles
Min Price: $[____]
Max Price: $[____]
Bedrooms: [_]
Bathrooms: [_]
Property Type: [Dropdown]
```

**In ChatGPT:**
```
"Find me a 3-bedroom house in Seattle 
under $1.2M near good schools"
```

#### Personalize with Context

The model remembers conversation history:

```
User: "I'm planning a trip to Paris"
Model: [discusses Paris]
User: "Book me a hotel there"
App: Automatically knows "there" = Paris
```

#### Compose with Other Apps (Optional)

When it saves time or cognitive load:

```
User: "Plan my day tomorrow"
→ Weather app: "Rain in the morning"
→ Calendar app: "Meeting at 10am, lunch at 12pm"
→ Transit app: "Leave by 9:30am to arrive on time"
→ Model: Synthesizes into a plan
```

---

## Pre-Publishing Checklist

Answer these yes/no questions before publishing. A **"no"** signals an opportunity to improve.

> **Note:** Answering "yes" to all questions doesn't guarantee distribution, but establishes a baseline for a great ChatGPT app.

### Core Value Questions

- [ ] **Conversational value** - Does at least one primary capability rely on ChatGPT's strengths (natural language, conversation context, multi-turn dialog)?

- [ ] **Beyond base ChatGPT** - Does the app provide new knowledge, actions, or presentation that users cannot achieve with a plain conversation?

### Technical Questions

- [ ] **Atomic, model-friendly actions** - Are tools indivisible, self-contained, and defined with explicit inputs and outputs so the model can invoke them without clarifying questions?

- [ ] **Helpful UI only** - Would replacing every custom widget with plain text meaningfully degrade the user experience?

- [ ] **End-to-end in-chat completion** - Can users finish at least one meaningful task without leaving ChatGPT or juggling external tabs?

### Performance & Discoverability

- [ ] **Performance & responsiveness** - Does the app respond quickly enough to maintain the rhythm of a chat?

- [ ] **Discoverability** - Is it easy to imagine prompts where the model would select this app confidently?

- [ ] **Platform fit** - Does the app take advantage of core platform behaviors (rich prompts, prior context, multi-tool composition, multimodality, or memory)?

### What to Avoid

Ensure you **DON'T**:

- ❌ Display **long-form or static content** better suited for a website or app
- ❌ Require **complex multi-step workflows** that exceed the inline or fullscreen display modes
- ❌ Use the space for **ads, upsells, or irrelevant messaging**
- ❌ Surface **sensitive or private information** directly in a card where others might see it
- ❌ **Duplicate ChatGPT's system functions** (e.g., recreating the input composer)

---

## Detailed Scoring Guide

### Score Each Criterion (1-5)

**1 = Poor** | **3 = Acceptable** | **5 = Excellent**

#### 1. Conversational Value (1-5)

- **5:** Capabilities are fundamentally conversational; wouldn't work well in traditional UI
- **3:** Uses natural language but could work in a traditional app
- **1:** Conversation adds no value; feels forced

#### 2. Beyond Base ChatGPT (1-5)

- **5:** Provides proprietary data, specialized UI, or unique capabilities
- **3:** Adds some value but could be replicated
- **1:** Could be done with base ChatGPT prompting

#### 3. Atomic Actions (1-5)

- **5:** Every tool is single-purpose, well-defined, composable
- **3:** Most tools are atomic but some are complex
- **1:** Tools require multi-step clarification

#### 4. UI Quality (1-5)

- **5:** UI is essential; removing it would significantly harm UX
- **3:** UI is helpful but not critical
- **1:** UI is decorative; plain text would work as well

#### 5. In-Chat Completion (1-5)

- **5:** Complete end-to-end workflows without leaving ChatGPT
- **3:** Most tasks completable in-chat with occasional external links
- **1:** Requires frequent context switching

#### 6. Performance (1-5)

- **5:** Instant or near-instant responses
- **3:** Acceptable latency (1-3 seconds)
- **1:** Slow responses break conversation flow

#### 7. Discoverability (1-5)

- **5:** Clear, intuitive use cases; model selects app confidently
- **3:** Works when explicitly requested
- **1:** Hard to know when/how to use

#### 8. Platform Fit (1-5)

- **5:** Leverages multiple platform features (context, composition, multimodal)
- **3:** Uses basic platform features
- **1:** Minimal platform integration

### Interpretation

- **32-40 points:** Excellent candidate for distribution
- **24-31 points:** Good foundation; room for improvement
- **16-23 points:** Needs significant work
- **Below 16:** Reconsider if ChatGPT is the right platform

---

## Examples by Score

### High-Scoring App: Restaurant Reservations

✅ **Conversational value:** Natural language date/time interpretation  
✅ **Beyond base:** Real-time availability data  
✅ **Atomic actions:** search, check_availability, book  
✅ **Helpful UI:** Visual comparison of restaurant options  
✅ **In-chat:** Complete booking without leaving  
✅ **Performance:** Fast API responses  
✅ **Discoverable:** Clear use cases ("book a restaurant")  
✅ **Platform fit:** Uses context, composes with calendar apps  

**Score: 38/40**

### Low-Scoring App: Company Website Mirror

❌ **Conversational value:** Just displays web content  
❌ **Beyond base:** No new data or capabilities  
❌ **Atomic actions:** Vague "show_page" tools  
❌ **Helpful UI:** Long text blocks  
❌ **In-chat:** Sends users to website for actions  
❌ **Performance:** Slow page loads  
❌ **Discoverable:** Unclear when to use  
❌ **Platform fit:** Doesn't leverage platform features  

**Score: 8/40**

---

## Common UX Mistakes

### Mistake 1: Feature Bloat
**Problem:** Trying to include every feature from main product  
**Fix:** Extract 3-5 core capabilities

### Mistake 2: Complex Workflows
**Problem:** Multi-step wizards that break conversation flow  
**Fix:** Design single-purpose actions with optional refinement

### Mistake 3: Poor Entry Points
**Problem:** Users don't know how to start  
**Fix:** Support vague, specific, and zero-knowledge prompts

### Mistake 4: Decorative UI
**Problem:** UI that looks nice but adds no value  
**Fix:** Only include UI that advances the task

### Mistake 5: Ignoring Context
**Problem:** Always asking for information already in conversation  
**Fix:** Use thread context to personalize and simplify

### Mistake 6: Breaking the Chat Rhythm
**Problem:** Slow responses or complex interactions  
**Fix:** Optimize for speed; keep responses concise

### Mistake 7: Unclear Purpose
**Problem:** Users (and the model) don't know when to use your app  
**Fix:** Clear descriptions, obvious use cases, great tool metadata

---

## Iteration Framework

### Phase 1: Core Validation
1. Can you articulate the clear benefit of running in ChatGPT?
2. Does your app do something better than traditional UI?
3. Does it improve ChatGPT's capabilities?

### Phase 2: UX Refinement
1. Extract core capabilities (don't port entire product)
2. Support all entry patterns (open, direct, first-run)
3. Optimize for conversation, not navigation
4. Remove decorative UI

### Phase 3: Polish
1. Improve performance and responsiveness
2. Enhance discoverability through better metadata
3. Test with real users across different prompts
4. Measure against the checklist

### Phase 4: Validation
1. Score against the 8 criteria
2. Address any scores below 3
3. Test end-to-end workflows
4. Get feedback from beta users

---

## Next Steps

1. **Review** this guide and the [best practices checklist](./best-practices-checklist.md)
2. **Design** your UI following the [UI guidelines](./ui-guidelines.md)
3. **Implement** using the [MCP server guide](./mcp-server-guide.md)
4. **Validate** using the pre-publishing checklist
5. **Iterate** based on real user feedback

---

## Additional Resources

- [What Makes a Great ChatGPT App](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)
- [UI Guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)
- [App Developer Guidelines](https://developers.openai.com/docs/chatgpt-apps/developer-guidelines)
- [Apps SDK Examples](https://github.com/openai/chatgpt-apps)

---

Remember: The best ChatGPT apps feel like a natural extension of the conversation, not a detour from it. Focus on what makes your app uniquely valuable in this environment, and let ChatGPT handle the rest.

