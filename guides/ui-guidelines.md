# ChatGPT Apps UI Guidelines

> **Source:** [OpenAI Apps SDK - UI Guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)  
> Guidelines for designing beautiful ChatGPT apps

## Overview

Apps are developer-built experiences that live inside ChatGPT. They extend what users can do **without breaking the flow of conversation**, appearing through lightweight cards, carousels, fullscreen views, and other display modes that integrate seamlessly into ChatGPT's interface.

### Design Goals

Apps should maintain ChatGPT's:
- 🎨 **Clarity** - Clean, focused interfaces
- 🔒 **Trust** - Consistent, reliable patterns  
- 💬 **Voice** - Conversational, helpful tone

---

## Apps SDK UI Design System

To help you design high-quality apps that feel native to ChatGPT, use the **Apps SDK UI design system**.

### What It Provides

- 🎨 **Styling foundations** with Tailwind
- 🎯 **CSS variable design tokens**
- 🧩 **Library of accessible components**

### Is It Required?

**No**, but using it will:
- ✅ Make building faster and easier
- ✅ Ensure consistency with ChatGPT design system
- ✅ Provide accessible components out of the box

### Getting Started

**Design:** Use the [Figma component library](https://www.figma.com/community/file/1234567890/ChatGPT-Apps-SDK-UI) to prototype before coding

**Build:** Install the Apps SDK UI package (see implementation guides)

---

## Display Modes

Display modes are the surfaces developers use to create experiences inside ChatGPT. Each mode is designed for a **specific type of interaction**.

### Overview of Display Modes

| Mode | Use Case | Example |
|------|----------|---------|
| **Inline** | Quick results embedded in conversation | Weather card, search results |
| **Carousel** | Browsing multiple options | Product listings, restaurant choices |
| **Fullscreen** | Complex workflows or detailed content | Forms, detailed views, multi-step flows |
| **Picture-in-Picture** | Ongoing parallel activities | Games, live collaboration, videos |

---

## 1. Inline Display Mode

The inline display mode appears **directly in the flow of the conversation**. Inline surfaces always appear before the generated model response.

**Every app initially appears inline.**

### Layout Structure

```
┌─────────────────────────────────────┐
│ [Icon] App Name - Tool Call Label  │ ← App identifier
├─────────────────────────────────────┤
│                                     │
│    Your Inline Widget Content      │ ← Your UI
│                                     │
├─────────────────────────────────────┤
│ Model-generated follow-up text     │ ← ChatGPT's response
└─────────────────────────────────────┘
```

### A) Inline Card

**Purpose:** Lightweight, single-purpose widgets embedded directly in conversation.

**Use for:**
- Quick confirmations
- Simple actions
- Visual aids

**Best Practices:**
- Keep it simple and focused
- One primary action
- Minimal text
- Clear call-to-action

**Example Use Cases:**
```
✓ Weather forecast
✓ Quick fact lookup
✓ Confirmation message
✓ Status update
✓ Single item detail
```

### B) Carousel

**Purpose:** Multiple inline cards displayed horizontally for browsing and comparison.

**Use for:**
- Product listings
- Restaurant options
- Search results
- Multiple alternatives

**Best Practices:**
- 3-7 cards optimal (not too few, not overwhelming)
- Consistent card structure
- Clear differentiation between items
- Easy horizontal scrolling

**Example Use Cases:**
```
✓ Hotel search results
✓ Product recommendations
✓ Restaurant options
✓ Flight choices
✓ Movie listings
```

### Inline Design Tips

**Do:**
- ✅ Keep content scannable
- ✅ Show key information upfront
- ✅ Use consistent visual hierarchy
- ✅ Make actions obvious

**Don't:**
- ❌ Cram too much information
- ❌ Use tiny text or icons
- ❌ Include irrelevant details
- ❌ Create deeply nested interactions

---

## 2. Fullscreen Display Mode

**Purpose:** A dedicated, immersive view for workflows requiring more space or focus.

**Use for:**
- Multi-step forms
- Detailed content
- Complex interactions
- Rich media experiences

### Triggering Fullscreen

Users can expand to fullscreen via:
- Explicit button in inline card
- Automatic expansion for certain actions
- User gesture (tap to expand)

### Layout Considerations

**Structure:**
```
┌─────────────────────────────────────┐
│ [←] Header with back button         │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         Full Content Area           │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [Cancel]              [Confirm]    │ ← Sticky footer (optional)
└─────────────────────────────────────┘
```

### Best Practices

**Navigation:**
- ✅ Always provide a way to go back
- ✅ Show clear header with context
- ✅ Use sticky footers for primary actions

**Content:**
- ✅ Use vertical scrolling (not horizontal)
- ✅ Group related information
- ✅ Progressive disclosure for complex forms
- ✅ Clear visual hierarchy

**Actions:**
- ✅ Primary action in prominent position
- ✅ Secondary actions less prominent
- ✅ Destructive actions require confirmation
- ✅ Disable buttons during processing

### When to Use Fullscreen

**Good reasons:**
```
✓ Multi-field form requiring focus
✓ Image gallery or media viewer
✓ Detailed product configuration
✓ Complex comparison view
✓ Multi-step checkout process
```

**Bad reasons:**
```
✗ Just showing more text (use inline)
✗ Single simple action (use inline card)
✗ Navigation menu (optimize for conversation)
✗ Static content (consider external link)
```

---

## 3. Picture-in-Picture (PiP)

**Purpose:** A persistent floating window optimized for ongoing or live sessions.

**Use for:**
- Games
- Videos
- Live collaboration
- Real-time activities

### Behavior

**Activation:**
- On scroll, PiP window stays fixed to top of viewport
- Remains visible while conversation continues

**Session:**
- Updates dynamically in response to user prompts
- Can react to chat input (e.g., game moves)

**Ending:**
- PiP returns to inline position
- Scrolls away naturally with conversation

### Interaction Patterns

```
┌─────────────────────────────────────┐
│  Conversation flowing...            │
│                                     │
│  ┌──────────────────┐              │
│  │  PiP Window      │ ← Fixed       │
│  │  [Game/Video]    │   position    │
│  └──────────────────┘              │
│                                     │
│  User continues chatting...         │
│  "Make my next move: Knight to E4"  │
│                                     │
│  ┌──────────────────┐              │
│  │  PiP updates     │ ← Reacts to   │
│  │  [Board moves]   │   chat input  │
│  └──────────────────┘              │
└─────────────────────────────────────┘
```

### Best Practices

**Do:**
- ✅ Ensure PiP state can update based on chat input
- ✅ Close PiP automatically when session ends
- ✅ Keep controls minimal and obvious
- ✅ Make it easy to dismiss

**Don't:**
- ❌ Overload PiP with controls
- ❌ Use for static content
- ❌ Block important conversation content
- ❌ Keep PiP active after session ends

### Example Use Cases

```
✓ Chess or board game
✓ Live video call
✓ Collaborative whiteboard
✓ Real-time quiz
✓ Music player
✓ Workout timer
```

---

## Visual Design Guidelines

A consistent look and feel makes partner-built tools feel like a **natural part of ChatGPT**.

### Why Consistency Matters

- 🔒 **Trust** - Users trust familiar patterns
- ⚡ **Efficiency** - Less cognitive load
- 🎨 **Quality** - Professional, polished experience
- 🧩 **Integration** - Feels like one system, not many apps

---

## Color Guidelines

### System-Defined Palettes

Use ChatGPT's color system for core UI elements:

**Text Colors:**
```css
--text-primary: #0D0D0D;      /* Main text */
--text-secondary: #666666;     /* Supporting text */
--text-tertiary: #999999;      /* Subtle text */
--text-inverse: #FFFFFF;       /* Text on dark backgrounds */
```

**Background Colors:**
```css
--bg-primary: #FFFFFF;         /* Main background */
--bg-secondary: #F7F7F8;       /* Card backgrounds */
--bg-tertiary: #ECECF1;        /* Subtle backgrounds */
```

**Action Colors:**
```css
--action-primary: #10A37F;     /* Primary actions */
--action-hover: #0E8B6C;       /* Hover states */
--action-disabled: #D1D5DB;    /* Disabled states */
```

**Semantic Colors:**
```css
--success: #10A37F;            /* Success states */
--error: #EF4444;              /* Error states */
--warning: #F59E0B;            /* Warning states */
--info: #3B82F6;               /* Info states */
```

### Brand Accent Usage

**Where you CAN use brand colors:**
- ✅ Logo and app icon
- ✅ Primary buttons in your display mode
- ✅ Accent elements (badges, highlights)
- ✅ Custom illustrations or icons

**Where you CANNOT use brand colors:**
- ❌ System text colors
- ❌ Background colors for text areas
- ❌ Core UI element colors (dividers, borders)
- ❌ Override system interactive states

### Color Examples

**Good Usage:**
```html
<!-- Brand color on primary button -->
<button style="background-color: #FF6B35; color: white;">
  Book Now
</button>

<!-- Brand badge -->
<span style="background-color: #FFE5DD; color: #FF6B35;">
  Premium
</span>
```

**Bad Usage:**
```html
<!-- Don't override text colors -->
<p style="color: #FF6B35;">  ❌
  Regular paragraph text
</p>

<!-- Don't use brand colors for backgrounds -->
<div style="background: linear-gradient(#FF6B35, #FFE5DD);">  ❌
  Content area
</div>
```

---

## Typography Guidelines

### System Fonts

ChatGPT uses **platform-native system fonts** for optimal readability:

- **iOS:** SF Pro
- **Android:** Roboto
- **Web:** System font stack

### Font Sizes

```css
--text-xs: 12px;      /* Captions, labels */
--text-sm: 14px;      /* Body small, secondary text */
--text-base: 16px;    /* Body text (default) */
--text-lg: 18px;      /* Subheadings */
--text-xl: 20px;      /* Headings */
--text-2xl: 24px;     /* Large headings */
```

### Font Weights

```css
--font-normal: 400;   /* Body text */
--font-medium: 500;   /* Emphasis */
--font-semibold: 600; /* Headings */
--font-bold: 700;     /* Strong emphasis */
```

### Best Practices

**Do:**
- ✅ Inherit system font stack
- ✅ Respect system sizing rules
- ✅ Use bold, italic for emphasis within content
- ✅ Limit font size variation

**Don't:**
- ❌ Use custom fonts (even in fullscreen)
- ❌ Use many different font sizes
- ❌ Override structural UI typography
- ❌ Use font styling for navigation elements

### Typography Examples

**Good:**
```html
<h2 style="font-size: 20px; font-weight: 600;">Flight Options</h2>
<p style="font-size: 16px; font-weight: 400;">
  We found <strong>3 flights</strong> matching your criteria.
</p>
<p style="font-size: 14px; color: var(--text-secondary);">
  Prices include taxes and fees
</p>
```

**Bad:**
```html
<!-- Don't use custom fonts -->
<p style="font-family: 'Comic Sans MS';">  ❌
  Text content
</p>

<!-- Don't use excessive size variation -->
<h1 style="font-size: 48px;">  ❌
  Too large
</h1>
```

---

## Spacing & Layout Guidelines

### Spacing Scale

Use a consistent spacing system based on 4px increments:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Common Spacing Patterns

**Card Padding:**
```css
padding: var(--space-4); /* 16px */
```

**Section Spacing:**
```css
margin-bottom: var(--space-6); /* 24px */
```

**Element Gaps:**
```css
gap: var(--space-3); /* 12px between items */
```

### Border Radius

```css
--radius-sm: 6px;    /* Small elements */
--radius-md: 8px;    /* Cards, buttons */
--radius-lg: 12px;   /* Large cards */
--radius-xl: 16px;   /* Containers */
--radius-full: 9999px; /* Pills, avatars */
```

### Best Practices

**Do:**
- ✅ Use system grid spacing
- ✅ Keep padding consistent
- ✅ Maintain visual hierarchy
- ✅ Give content room to breathe

**Don't:**
- ❌ Cram content edge-to-edge
- ❌ Use random spacing values
- ❌ Mix different spacing systems
- ❌ Ignore visual hierarchy

### Layout Examples

**Good Card Layout:**
```html
<div style="
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-secondary);
">
  <h3 style="margin-bottom: 12px;">Card Title</h3>
  <p style="margin-bottom: 16px;">Description text</p>
  <button style="margin-top: 8px;">Action</button>
</div>
```

---

## Icons & Imagery Guidelines

### Icon Style

Use **monochromatic, outlined icons** that fit ChatGPT's visual language.

**System Icons:**
- Line-based design
- 24px standard size
- Consistent stroke width (1.5-2px)
- Monochromatic

### Custom Iconography

If using custom icons:
- ✅ Match the outlined, minimal style
- ✅ Keep consistent stroke weights
- ✅ Use monochromatic colors
- ✅ Maintain 24px standard size

### Logo Usage

**Don't include your logo in the response** - ChatGPT automatically appends your logo and app name before the widget is rendered.

### Image Aspect Ratios

All imagery must follow enforced aspect ratios to avoid distortion:

**Common Ratios:**
- `16:9` - Landscape images, videos
- `4:3` - Product photos
- `1:1` - Square images, avatars
- `3:4` - Portrait images

### Best Practices

**Do:**
- ✅ Provide alt text for all images
- ✅ Use appropriate aspect ratios
- ✅ Optimize images for web
- ✅ Use system icons when possible

**Don't:**
- ❌ Use colorful, filled icons (use outlined)
- ❌ Include redundant logos
- ❌ Distort images
- ❌ Use low-quality images

---

## Accessibility Guidelines

Every partner experience should be **usable by the widest possible audience**.

### Accessibility is Required, Not Optional

### Color Contrast

**Minimum Requirements (WCAG AA):**
- Normal text: **4.5:1** contrast ratio
- Large text (18px+): **3:1** contrast ratio
- UI components: **3:1** contrast ratio

**Test Your Contrast:**
```css
/* Good: Sufficient contrast */
color: #0D0D0D;
background: #FFFFFF;
/* Contrast ratio: 19.56:1 ✓ */

/* Bad: Insufficient contrast */
color: #CCCCCC;
background: #FFFFFF;
/* Contrast ratio: 1.61:1 ✗ */
```

### Alt Text

Provide **descriptive alt text** for all images:

**Good:**
```html
<img src="product.jpg" alt="Blue running shoes, size 10, Nike brand">
```

**Bad:**
```html
<img src="product.jpg" alt="Image">
<img src="product.jpg" alt="">
```

### Text Resizing

**Support text resizing** without breaking layouts:

```css
/* Use relative units */
font-size: 1rem;  /* ✓ Scales with user preferences */
padding: 1em;     /* ✓ Scales with font size */

/* Avoid fixed units for text */
font-size: 14px;  /* ✗ Doesn't scale */
```

### Keyboard Navigation

Ensure all interactive elements are:
- ✅ Focusable via keyboard
- ✅ Have visible focus indicators
- ✅ Follow logical tab order
- ✅ Activatable with Enter/Space

### Screen Reader Support

```html
<!-- Use semantic HTML -->
<button>Submit</button>  ✓

<!-- Provide labels for form inputs -->
<label for="email">Email</label>
<input id="email" type="email">  ✓

<!-- Use ARIA when needed -->
<div role="button" tabindex="0" aria-label="Close">×</div>  ✓
```

### Accessibility Checklist

- [ ] All text meets contrast requirements
- [ ] All images have descriptive alt text
- [ ] Layout supports text resizing up to 200%
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Form inputs have associated labels
- [ ] Color is not the only way to convey information
- [ ] Screen readers can navigate the content

---

## Component Examples

### Card Component

```html
<div class="card" style="
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
">
  <h3 style="
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-2);
  ">
    Card Title
  </h3>
  <p style="
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin-bottom: var(--space-4);
  ">
    Supporting description text
  </p>
  <button style="
    background: var(--action-primary);
    color: white;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    font-weight: var(--font-medium);
  ">
    Primary Action
  </button>
</div>
```

### List Component

```html
<ul style="
  list-style: none;
  padding: 0;
  gap: var(--space-2);
  display: flex;
  flex-direction: column;
">
  <li style="
    padding: var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
  ">
    List item 1
  </li>
  <li style="
    padding: var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
  ">
    List item 2
  </li>
</ul>
```

---

## Design Checklist

Before shipping your UI:

### Visual Consistency
- [ ] Uses system colors for core UI
- [ ] Brand colors only on accents/buttons
- [ ] System fonts throughout
- [ ] Consistent spacing scale
- [ ] Proper border radius

### Layout
- [ ] Clean visual hierarchy
- [ ] Appropriate padding/margins
- [ ] No cramped content
- [ ] Responsive to different screen sizes

### Iconography
- [ ] Monochromatic, outlined style
- [ ] Consistent sizing (24px standard)
- [ ] No redundant logos
- [ ] All images have alt text

### Accessibility
- [ ] WCAG AA contrast ratios
- [ ] All images have alt text
- [ ] Supports text resizing
- [ ] Keyboard navigable
- [ ] Screen reader friendly

### Display Mode
- [ ] Appropriate mode for use case
- [ ] Inline cards are concise
- [ ] Fullscreen only when necessary
- [ ] PiP for ongoing activities only

---

## Resources

### Official Tools
- [Figma Component Library](https://www.figma.com/community) - Design before you code
- [Apps SDK UI Package](https://www.npmjs.com/package/@openai/apps-sdk-ui) - React components
- [Design Tokens](https://developers.openai.com/docs/chatgpt-apps/design-tokens) - CSS variables

### Documentation
- [UX Principles](https://developers.openai.com/apps-sdk/concepts/ux-principles)
- [App Developer Guidelines](https://developers.openai.com/docs/chatgpt-apps/developer-guidelines)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

By following these UI guidelines, your app will feel like a natural, trustworthy extension of ChatGPT while maintaining your brand identity where it matters most.

