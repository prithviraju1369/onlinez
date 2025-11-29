# Designing for Conversation and Discovery

> How to handle different types of user intent and discovery patterns

## The Discovery Challenge

Users can't assume the user knows:
- What your app does
- When it's relevant
- How to use it

Your app must handle discovery gracefully across different intent levels.

## Three Levels of User Intent

### Level 1: Vague Intent

**Example:**
> "Help me figure out where to live."

#### How to Respond Well

✅ **Do:**
- Use any context already in the thread
- Ask 1-2 clarifying questions at most, if needed
- Produce something concrete quickly
- Show example results with short explanations

❌ **Don't:**
- Drop users into a multi-step onboarding flow
- Require 5+ questions before showing anything
- Make users repeat their requirements

#### Goal
**The user should feel like progress has started**, not like they've entered a setup wizard.

#### Real Example: Canva

When intent is vague, Canva asks follow-up questions to synthesize what the user wants to build, but keeps it conversational and minimal.

---

### Level 2: Specific Intent

**Example:**
> "Find 3-bedroom homes in Seattle under $1.2M near well-rated elementary schools."

#### How to Respond Well

✅ **Do:**
- Parse the query immediately
- Call the right capabilities
- Return a focused set of results with useful structure
- Offer optional tuning ("Do you care more about commute or school rating?")

❌ **Don't:**
- Ask the user to repeat themselves
- Require additional setup
- Force them through required steps

#### Goal
**Refinements should feel like optional tuning**, not required setup.

#### Real Example: Canva

When the user's intent becomes clear and they ask to generate a presentation, the model knows exactly when to call Canva and what capability to invoke. It offers a few options and probes deeper only if the user wants additional refinements.

---

### Level 3: No Brand Awareness

**Example:**
> "I need to book a hotel in Chicago next month."

The user doesn't know your app exists or what it does.

#### Your First Response Should:

1. **Explain your role in one line**
   - "I pull live listings and school ratings so you can compare options."
   - "I can search real-time hotel availability and pricing."

2. **Deliver useful output right away**
   - Don't just introduce yourself - show value

3. **Offer a clear next step**
   - "Ask me to narrow by commute, neighborhood, or budget."
   - "I can also check availability at specific properties."

#### Think of It As a Cold Start Problem

You're introducing:
- **What** you are
- **Why** you're helpful  
- **How** to use you

All inside one or two messages.

---

## Designing Your MCP Server

### Action Descriptions Matter

In your MCP server, define descriptions that help the model understand:
- **When** to invoke your tool
- **Which** tool calls to use
- **How** to map user intent to actions

### Example: Good Action Descriptions

```typescript
{
  name: "search_properties",
  description: "Search for residential properties based on location, price, beds, and other criteria. Use when user wants to find homes or apartments to buy or rent.",
  parameters: {
    location: {
      type: "string",
      description: "City, neighborhood, or ZIP code",
      required: true
    },
    max_price: {
      type: "number",
      description: "Maximum price in dollars",
      required: false
    },
    bedrooms: {
      type: "number",
      description: "Minimum number of bedrooms",
      required: false
    }
  }
}
```

### Example: Bad Action Descriptions

```typescript
{
  name: "search",  // Too vague
  description: "Search for stuff",  // Not helpful
  parameters: {
    query: {
      type: "string",  // No guidance on format
      required: true
    }
  }
}
```

---

## Conversational Patterns

### Pattern 1: Progressive Disclosure

Start simple, add complexity only when needed.

**Turn 1:**
```
User: "Help me find a hotel"
App: "I can search hotels in any city. Where are you traveling?"
```

**Turn 2:**
```
User: "Chicago"
App: [Shows 3-5 top options with key details]
    "Want to filter by neighborhood, price, or amenities?"
```

**Turn 3+:**
```
User: "Near downtown under $200"
App: [Shows refined results]
```

### Pattern 2: Parallel Options

When you don't know what matters most, offer parallel paths.

**Example:**
```
App: "I found 8 hotels. Would you like me to:
     • Show the cheapest options
     • Show the highest-rated
     • Filter by specific neighborhoods"
```

### Pattern 3: Graceful Degradation

When you can't fulfill a request exactly, offer the closest alternative.

**Example:**
```
User: "5-bedroom houses under $500k in Manhattan"
App: "I didn't find any 5-bedroom homes under $500k in Manhattan, 
     but I found:
     • 3 options in nearby Brooklyn at that price point
     • 2 options in Manhattan with 4 bedrooms under $600k
     
     Would either of these work?"
```

---

## First Interaction Checklist

Your first meaningful response should accomplish all of these:

- [ ] Explain what you do (1 sentence max)
- [ ] Show concrete value (actual results, not just text)
- [ ] Make the next step obvious
- [ ] Respect any context already in the conversation
- [ ] Avoid asking for information the user already provided

## Anti-Patterns to Avoid

### ❌ The Multi-Step Wizard
```
App: "Welcome! To get started, tell me your budget."
User: [provides budget]
App: "Great! Now tell me your location."
User: [provides location]
App: "Perfect! How many bedrooms?"
...
```

**Why it's bad:** Feels like a form, not a conversation.

### ❌ The Information Dump
```
App: "I'm the XYZ App! I can do A, B, C, D, E, F, and G! 
     I integrate with systems 1, 2, 3, and 4!
     Our company was founded in..."
```

**Why it's bad:** Too much introduction, not enough value.

### ❌ The Unclear Capability
```
App: "I can help with that!"
User: "How?"
App: "Just ask me anything!"
```

**Why it's bad:** User doesn't know what to ask for.

---

## Testing Your Conversational Design

### Test Scenarios to Try

1. **Vague request with no context**
   - "Help me with X" (where X is your domain)

2. **Specific request with full details**
   - Include all parameters the user might provide

3. **First-time user with no brand awareness**
   - Test with someone who's never heard of your product

4. **Request that's close but not quite possible**
   - See if you gracefully suggest alternatives

5. **Multi-turn refinement**
   - Start vague, gradually add constraints

### Success Criteria

For each scenario:
- ✅ User sees value within 1-2 turns
- ✅ Next steps are obvious
- ✅ Feels like a conversation, not a form
- ✅ User understands what you can do
- ✅ Refinements feel natural, not forced

---

## Model-Friendly Design

Remember: You're designing for two audiences:
1. The human in the chat
2. The model runtime that decides when/how to call your app

### For the Model

- Use clear, descriptive action names
- Spell out required vs. optional parameters
- Document expected input formats
- Keep schemas stable over time
- Return predictable, structured outputs

### For the Human

- Pair summaries with structured data
- Use natural language in responses
- Show, don't just tell
- Make next steps obvious
- Respect their time and context

### For Both

- Be consistent in naming and structure
- Avoid ambiguity in everything
- Design actions that compose well with others
- Think about the whole conversation flow

---

## Key Takeaways

1. **Handle all intent levels**: vague, specific, and zero awareness
2. **First response matters**: explain + deliver + guide
3. **Progressive disclosure**: start simple, add complexity only when needed
4. **Design for the model**: clear actions and parameters
5. **Test with real scenarios**: vague, specific, impossible, multi-turn
6. **Avoid wizards**: make it conversational, not a form

Your app should feel like a knowledgeable colleague who:
- Understands what you're trying to do
- Offers relevant help immediately  
- Explains just enough to be useful
- Makes the next step obvious

