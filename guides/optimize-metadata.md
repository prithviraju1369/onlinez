# Optimize Metadata

> **Source:** [OpenAI Apps SDK - Optimize Metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata)  
> Improve discovery and behavior with rich metadata

## Why Metadata Matters

ChatGPT decides when to call your connector based on the **metadata you provide**.

### The Discovery Challenge

**Well-crafted metadata:**
- ✅ Increases recall on relevant prompts
- ✅ Reduces accidental activations
- ✅ Improves user experience
- ✅ Makes your app discoverable

**Poor metadata:**
- ❌ App never gets called when it should
- ❌ App gets called when it shouldn't
- ❌ User frustration
- ❌ Low adoption

### Treat Metadata Like Product Copy

Metadata needs:
- 📝 **Iteration** - Continuous refinement
- 🧪 **Testing** - Validation with real prompts
- 📊 **Analytics** - Measurement of effectiveness

---

## Step 1: Gather a Golden Prompt Set

Before you tune metadata, assemble a **labelled dataset**.

### Three Categories of Prompts

#### 1. Direct Prompts

Users explicitly name your product or data source.

**Examples:**
```
✓ "Show my Jira board"
✓ "Search Salesforce for tech companies"
✓ "What's in my GitHub notifications?"
✓ "Book a table on OpenTable"
```

**Expected behavior:** Call your tool

#### 2. Indirect Prompts

Users describe the outcome without naming your tool.

**Examples:**
```
✓ "What am I blocked on for the launch?"
✓ "Find me potential customers in the Bay Area"
✓ "What do I need to review today?"
✓ "Reserve a table for dinner tonight"
```

**Expected behavior:** Call your tool (if context suggests it)

#### 3. Negative Prompts

Cases where built-in tools or other connectors should handle the request.

**Examples:**
```
✗ "What's the weather?" (not Jira)
✗ "Explain how Salesforce works" (documentation, not your app)
✗ "Show my GitHub repos" (different product)
✗ "What restaurants are nearby?" (discovery, not booking)
```

**Expected behavior:** Do NOT call your tool

### Document Expected Behavior

```markdown
## Golden Prompt Set: Jira App

### Direct Prompts
| Prompt | Expected Tool | Expected Args |
|--------|---------------|---------------|
| "Show my Jira board" | list_tickets | { assignee: "me", status: "all" } |
| "What Jira tickets are urgent?" | list_tickets | { priority: "urgent" } |
| "Create a Jira bug for login" | create_ticket | { type: "bug", title: "login..." } |

### Indirect Prompts
| Prompt | Expected Tool | Expected Args |
|--------|---------------|---------------|
| "What am I blocked on?" | list_tickets | { status: "blocked", assignee: "me" } |
| "Help me prioritize" | list_tickets | { sort: "priority" } |
| "I found a bug" | create_ticket | { type: "bug" } |

### Negative Prompts
| Prompt | Expected Behavior |
|--------|-------------------|
| "What's the weather?" | Do NOT call tool |
| "Explain Jira" | Do NOT call tool |
| "GitHub issues" | Do NOT call tool |
```

**Reuse this set during regression testing.**

---

## Step 2: Draft Metadata That Guides the Model

For each tool, optimize these elements:

### Tool Name

**Format:** `domain.action` or `action_subject`

**Good:**
```typescript
✓ calendar.create_event
✓ search_flights
✓ book_hotel
✓ kanban.move_task
```

**Bad:**
```typescript
✗ doThing
✗ handler
✗ process
✗ tool1
```

**Guidelines:**
- Action-oriented
- Clear and unambiguous
- Unique within your connector
- Use snake_case or dot.notation

### Tool Description

**Start with "Use this when..."** and call out disallowed cases.

**Good:**
```typescript
description: "Use this when the user wants to search for Jira tickets by keyword, status, assignee, or priority. Returns a list of matching tickets with details. Do not use for creating or updating tickets."
```

**Better:**
```typescript
description: `Use this when the user wants to:
- Search for Jira tickets by keyword, status, or assignee
- List tickets assigned to them or a team member
- Filter tickets by priority, project, or date

Returns up to 50 matching tickets with ID, title, status, and assignee.

Do NOT use for:
- Creating new tickets (use create_ticket instead)
- Updating ticket status (use update_ticket instead)
- Jira documentation or help`
```

**Bad:**
```typescript
description: "Searches tickets"
```

### Structure Your Descriptions

**Template:**
```
Use this when [scenarios]:
- [Specific use case 1]
- [Specific use case 2]
- [Specific use case 3]

[What it returns/does]

[Optional: When to use alternatives]

Do NOT use for:
- [Disallowed case 1]
- [Disallowed case 2]
```

### Parameter Documentation

Describe each argument with examples and constraints.

**Good:**
```typescript
{
  query: {
    type: "string",
    description: "Search term to match in ticket title or description. Examples: 'login bug', 'performance', 'urgent items'",
    required: false
  },
  
  status: {
    type: "string",
    enum: ["open", "in_progress", "blocked", "closed", "all"],
    description: "Filter by ticket status. Use 'all' to see tickets regardless of status. Defaults to 'open'.",
    default: "open"
  },
  
  assignee: {
    type: "string",
    description: "User ID or 'me' for current user, 'unassigned' for unassigned tickets. Examples: 'me', 'user_123', 'unassigned'",
    pattern: "^(me|unassigned|user_[a-z0-9]+)$"
  }
}
```

**Bad:**
```typescript
{
  query: {
    type: "string",
    description: "Query"
  },
  
  status: {
    type: "string",
    description: "Status"
  }
}
```

### Use Enums for Constrained Values

**Always use enums when the set of valid values is known.**

**Good:**
```typescript
priority: {
  type: "string",
  enum: ["low", "medium", "high", "urgent"],
  description: "Priority level for filtering"
}
```

**Bad:**
```typescript
priority: {
  type: "string",
  description: "Priority (use low, medium, high, or urgent)"
}
```

### Read-Only Hint

Annotate tools that never mutate state:

```typescript
{
  name: "search_tickets",
  _meta: {
    "openai/readOnlyHint": true  // No confirmation needed
  }
}

{
  name: "delete_ticket",
  _meta: {
    "openai/readOnlyHint": false  // Requires confirmation
  }
}
```

**Benefits:**
- ChatGPT streamlines confirmation for read-only tools
- Faster user experience
- Clearer intent

---

## Step 3: Evaluate in Developer Mode

Test your metadata against the golden prompt set.

### Setup

1. Link connector in ChatGPT developer mode
2. Open new conversation
3. Add your connector
4. Run through golden prompts

### Evaluation Process

#### For Each Prompt, Record:

**1. Tool Selection**
```markdown
Prompt: "Show my Jira board"
- Tool called: list_tickets ✅
- Expected: list_tickets ✅
- Result: CORRECT
```

**2. Arguments Passed**
```markdown
Prompt: "What am I blocked on?"
- Tool called: list_tickets ✅
- Args: { status: "blocked", assignee: "me" } ✅
- Expected: { status: "blocked", assignee: "me" } ✅
- Result: CORRECT
```

**3. Component Rendering**
```markdown
- Widget rendered: ✅
- Data displayed correctly: ✅
- No console errors: ✅
```

### Track Metrics

#### Precision

**Definition:** Of the times your app was selected, how many were correct?

```
Precision = Correct Selections / Total Selections
```

**Example:**
- App selected 20 times
- Correct 18 times
- Precision = 18/20 = **90%**

**Goal:** >95% precision on negative prompts

#### Recall

**Definition:** Of the relevant prompts, how many triggered your app?

```
Recall = Prompts That Triggered / Relevant Prompts
```

**Example:**
- 25 relevant prompts
- App triggered 20 times
- Recall = 20/25 = **80%**

**Goal:** >90% recall on direct prompts

### Evaluation Template

```markdown
## Metadata Evaluation: v1.2.0

### Test Date: 2025-11-29
### Tester: [Name]

### Results

#### Direct Prompts (10 total)
| Prompt | Tool Called | Args Correct | Result |
|--------|-------------|--------------|--------|
| "Show my board" | list_tickets | ✅ | ✅ |
| "Create bug" | create_ticket | ✅ | ✅ |
| ... | ... | ... | ... |

**Precision:** 10/10 = 100%  
**Recall:** 10/10 = 100%

#### Indirect Prompts (8 total)
| Prompt | Tool Called | Args Correct | Result |
|--------|-------------|--------------|--------|
| "What am I blocked on?" | list_tickets | ✅ | ✅ |
| "Help me prioritize" | list_tickets | ⚠️ (missing sort) | ⚠️ |
| ... | ... | ... | ... |

**Precision:** 7/8 = 87.5%  
**Recall:** 7/8 = 87.5%

#### Negative Prompts (5 total)
| Prompt | Tool Called | Result |
|--------|-------------|--------|
| "Weather?" | (none) | ✅ |
| "Explain Jira" | (none) | ✅ |
| ... | ... | ... |

**Precision:** 5/5 = 100%

### Issues Found
1. "Help me prioritize" doesn't pass sort parameter
   - Fix: Update description to mention sorting
   
2. "Blocked items" sometimes misses
   - Fix: Add "blocked" to examples

### Next Steps
- [ ] Update list_tickets description
- [ ] Add more examples for sorting
- [ ] Retest indirect prompts
```

---

## Step 4: Iterate Methodically

### One Change at a Time

**Why:** So you can attribute improvements

**Bad approach:**
```
Changed tool names, descriptions, and parameter docs all at once
→ Can't tell what fixed the issue
```

**Good approach:**
```
1. Updated list_tickets description to mention sorting
2. Retested indirect prompts
3. Precision improved from 87.5% to 95%
4. Commit: "Improve sorting discovery in list_tickets"
```

### Keep a Change Log

```markdown
# Metadata Change Log

## 2025-11-29 - v1.2.1
### Changed
- Updated `list_tickets` description to mention sorting
- Added "blocked" to examples

### Results
- Precision (indirect): 87.5% → 95%
- Recall (indirect): 87.5% → 92%

## 2025-11-25 - v1.2.0
### Changed
- Split `manage_tickets` into separate read/write tools
- Added `readOnlyHint: true` to search tools

### Results
- Precision (direct): 85% → 98%
- Faster confirmations for read operations

## 2025-11-20 - v1.1.0
### Changed
- Added enum for status parameter
- Improved parameter descriptions with examples

### Results
- Precision (direct): 78% → 85%
- Fewer invalid argument errors
```

### Share Diffs with Reviewers

```markdown
## Metadata Review Request

### Changes
```diff
- description: "Searches tickets"
+ description: "Use this when the user wants to search for Jira tickets by keyword, status, assignee, or priority. Returns matching tickets with details. Do not use for creating or updating tickets."
```

### Reason
Improve discovery for indirect prompts like "What am I working on?"

### Test Results Before
- Recall: 75%

### Test Results After  
- Recall: 92%

### Reviewer: @teammate
```

### Prioritize Fixes

**First:** High precision on negative prompts
- Don't trigger when you shouldn't
- Prevents user frustration

**Second:** High recall on direct prompts
- Trigger when explicitly requested
- Meets user expectations

**Third:** Improve recall on indirect prompts
- Trigger on intent-based requests
- Enhances discoverability

---

## Step 5: Production Monitoring

Once your connector is live, continue monitoring metadata effectiveness.

### Weekly Review

**Tool-call analytics:**
```markdown
## Weekly Review: 2025-11-29

### Tool Call Stats
| Tool | Calls | Confirmations | Rejections |
|------|-------|---------------|------------|
| list_tickets | 1,250 | 12 | 3 |
| create_ticket | 85 | 85 | 8 |
| update_ticket | 45 | 45 | 2 |

### Issues
- create_ticket: 8 rejections (9.4% rejection rate)
  - Investigate: What prompts are triggering incorrectly?
  
- list_tickets: 12 confirmations for read-only tool
  - Check: Is readOnlyHint working?
```

**Spike detection:**
- Sudden increase in "wrong tool" confirmations
- Usually indicates metadata drift
- Could be due to new ChatGPT features or model updates

### Capture User Feedback

```javascript
// Track user actions after tool calls
{
  toolCall: "search_tickets",
  userAction: "clicked_result",  // Positive signal
  timestamp: "2025-11-29T10:30:00Z"
}

{
  toolCall: "create_ticket",
  userAction: "rejected_confirmation",  // Negative signal
  timestamp: "2025-11-29T10:35:00Z",
  prompt: "I found a bug in login"
}
```

**Update descriptions** to cover common misconceptions:

```diff
- description: "Use this when user wants to create a ticket"
+ description: "Use this when user wants to create a NEW ticket. Do not use if they're asking about EXISTING tickets or bugs (use search_tickets instead)."
```

### Schedule Periodic Prompt Replays

**Monthly regression testing:**

```bash
# Run golden prompt set against production
npm run test:prompts -- --env=production

# Compare to baseline
npm run test:prompts -- --compare=baseline

# Output:
# Precision: 95% (baseline: 92%) ✅
# Recall: 88% (baseline: 90%) ⚠️
# 
# Regressions:
# - "Help me prioritize" no longer triggers (was working in baseline)
```

### After Adding New Tools

**Re-validate entire prompt set:**

New tools can interfere with existing tools if descriptions overlap.

```markdown
## New Tool Impact Analysis

### Added: archive_project

### Concerns
- Might interfere with list_tickets?
- Similar keywords: "project", "tasks"

### Test Results
- No impact on list_tickets precision
- New tool correctly triggers on "archive" prompts
- ✅ Safe to deploy
```

### After Changing Structured Fields

**Retest when you modify:**
- Tool names
- Parameter names
- Enum values
- Return value structures

**Example:**
```diff
- status: { enum: ["open", "closed"] }
+ status: { enum: ["open", "in_progress", "closed"] }
```

**Impact:**
- Existing prompts using "open" still work ✅
- New prompts can use "in progress" ✅
- Need to update golden prompts ⚠️

---

## Metadata Best Practices

### Do's ✅

**1. Start with "Use this when..."**
```typescript
description: "Use this when the user wants to search for hotels by location, dates, or amenities."
```

**2. Include examples**
```typescript
query: {
  description: "Search term. Examples: 'budget hotels', 'near airport', 'with pool'"
}
```

**3. Use enums for constrained values**
```typescript
status: {
  enum: ["open", "closed", "in_progress"]
}
```

**4. Document what NOT to use tool for**
```typescript
description: "Use this when... Do NOT use for creating tickets (use create_ticket instead)."
```

**5. Keep descriptions concise but complete**
- 2-4 sentences for simple tools
- 1 paragraph for complex tools
- Bullet points for clarity

### Don'ts ❌

**1. Vague descriptions**
```typescript
❌ description: "Searches stuff"
✅ description: "Use this when user wants to search for Jira tickets by keyword, status, or assignee."
```

**2. Missing examples**
```typescript
❌ query: { description: "Query string" }
✅ query: { description: "Search term to match in title or description. Examples: 'login bug', 'urgent'" }
```

**3. Ambiguous tool names**
```typescript
❌ name: "doThing"
✅ name: "search_tickets"
```

**4. Overlapping tool responsibilities**
```typescript
❌ search_tickets - "Search or create tickets"
✅ search_tickets - "Search for tickets"
✅ create_ticket - "Create a new ticket"
```

**5. Treating metadata as "set and forget"**
- ❌ Never updating after initial deployment
- ✅ Continuous monitoring and improvement

---

## Advanced Optimization Techniques

### A/B Testing Metadata

```typescript
// Version A
description: "Use this when user wants to search tickets"

// Version B  
description: "Use this when user wants to find, list, or search for Jira tickets by any criteria"

// Measure:
// - Which has better recall?
// - Which has better precision?
// - Which users prefer?
```

### Seasonal Metadata Updates

```typescript
// During holiday season
description: "Use this when user wants to book hotels. Especially useful for holiday travel planning, family reunions, or vacation stays."

// Rest of year
description: "Use this when user wants to book hotels for business or leisure travel."
```

### Context-Aware Descriptions

```typescript
// If user mentioned "Jira" in conversation
description: "Use this when user wants to interact with Jira tickets they mentioned."

// Generic
description: "Use this when user wants to search for project management tasks or tickets."
```

---

## Troubleshooting Metadata Issues

### Tool Never Triggers

**Symptoms:**
- Relevant prompts don't activate tool
- Low recall

**Solutions:**
1. Add more examples to description
2. Include synonyms for key terms
3. Expand "Use this when..." scenarios
4. Check if another tool is interfering

### Wrong Tool Triggers

**Symptoms:**
- Irrelevant prompts activate tool
- Low precision
- Many user rejections

**Solutions:**
1. Add "Do NOT use for..." section
2. Narrow the scope in description
3. Remove ambiguous keywords
4. Split into multiple focused tools

### Arguments Always Wrong

**Symptoms:**
- Tool triggers correctly
- But parameters are invalid

**Solutions:**
1. Add examples to parameter descriptions
2. Use enums instead of free-form strings
3. Specify format (dates, IDs, etc.)
4. Add validation hints

---

## Metadata Checklist

Before deploying metadata changes:

- [ ] **Descriptions**
  - [ ] Start with "Use this when..."
  - [ ] Include 2-3 specific scenarios
  - [ ] Call out disallowed cases
  - [ ] 2-4 sentences, concise

- [ ] **Parameters**
  - [ ] Each has clear description
  - [ ] Examples provided
  - [ ] Enums used where applicable
  - [ ] Defaults documented

- [ ] **Tool Names**
  - [ ] Action-oriented
  - [ ] Unique and clear
  - [ ] Follow naming convention

- [ ] **Hints**
  - [ ] readOnlyHint set correctly
  - [ ] visibility set (public/private)
  - [ ] widgetAccessible if needed

- [ ] **Testing**
  - [ ] All golden prompts pass
  - [ ] Precision >95% on negatives
  - [ ] Recall >90% on directs
  - [ ] No regressions

- [ ] **Documentation**
  - [ ] Change log updated
  - [ ] Test results recorded
  - [ ] Reviewer approved

---

## Next Steps

1. **Create** your golden prompt set - [Planning Use Cases](./planning-use-cases.md)
2. **Draft** initial metadata - [Planning Tools](./planning-tools.md)
3. **Test** with MCP Inspector - [Testing Guide](./deploy-testing.md)
4. **Deploy** and monitor - [Deploy Guide](./deploy-your-app.md)

---

## Additional Resources

- [Define Tools Guide](./planning-tools.md)
- [Testing Guide](./deploy-testing.md)
- [Conversation Design](./conversation-design.md)
- [Apps SDK Reference](https://developers.openai.com/apps-sdk/reference)

---

**Remember:** Metadata is a living asset. The more intentional you are with wording and evaluation, the easier discovery and invocation become. Treat it like product copy that needs continuous iteration!

