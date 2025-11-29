# Research Use Cases for ChatGPT Apps

> **Source:** [OpenAI Apps SDK - Research Use Cases](https://developers.openai.com/apps-sdk/plan/use-case)  
> Identify and prioritize Apps SDK use cases

## Why Start with Use Cases

Every successful Apps SDK app starts with a **crisp understanding of what the user is trying to accomplish**.

### Discovery is Model-Driven

ChatGPT chooses your app when:
- 🏷️ Your tool metadata aligns with the user's prompt
- 📝 Tool descriptions match user intent
- 📊 Past usage confirms relevance
- 🧠 Memories and context support the selection

**This only works if you've already mapped:**
- The tasks the model should recognize
- The outcomes you can deliver

### Start Here, Not with Code

Use this planning phase to:
1. Capture your hypotheses
2. Pressure-test them with prompts
3. Align your team on scope
4. THEN define tools and build components

---

## Step 1: Gather Inputs

Begin with **qualitative and quantitative research**.

### User Interviews and Support Requests

Capture:
- **Jobs-to-be-done** - What are users trying to accomplish?
- **Terminology** - What words do they use?
- **Data sources** - What information do they rely on today?
- **Pain points** - Where do current tools fail them?

**Questions to Ask:**
```
"Walk me through the last time you needed to [task]"
"What would make [task] easier?"
"What information do you need to make this decision?"
"When you say [term], what exactly do you mean?"
```

### Prompt Sampling

List both direct and indirect user intents:

**Direct asks** (explicit tool/product mention):
```
"Show my Jira board"
"What flights are available to NYC this Friday?"
"Search my Salesforce contacts for tech companies"
```

**Indirect intents** (goal-oriented, no tool mention):
```
"What am I blocked on for the launch?"
"Help me find a hotel in Chicago next week"
"Who should I contact about this deal?"
```

### System Constraints

Note any limitations that will influence design:

**Compliance Requirements:**
- HIPAA, GDPR, SOC2
- Data residency rules
- Audit logging needs

**Technical Constraints:**
- Offline data availability
- API rate limits
- Authentication requirements
- Real-time vs batch updates

### Document the Scenario

For each use case, create a one-page summary:

```markdown
## Use Case: [Name]

**User Persona:** [Who is this for?]
- Role: Product Manager
- Context: Planning sprint, needs to prioritize
- Technical skill: Non-technical

**Context:** [When/where does this happen?]
- During sprint planning meetings
- On mobile while commuting
- When blocked waiting for answers

**Success Criteria:** [What does success look like?]
User can identify top 3 blockers and assign owners in under 2 minutes,
without leaving ChatGPT or opening Jira.

**Frequency:** Weekly (during sprint planning)

**Impact if solved:** High - saves 30 minutes per sprint planning session
```

---

## Step 2: Define Evaluation Prompts

**Decision boundary tuning** is easier when you have a golden set to iterate against.

### For Each Use Case, Create:

#### 1. Direct Prompts (5+ examples)

Explicitly reference your data, product name, or expected verbs:

```
✓ "Show my Jira board"
✓ "What Jira tickets are assigned to me?"
✓ "List my open tasks in Jira"
✓ "Search Jira for bugs tagged 'urgent'"
✓ "Create a new Jira ticket for the login bug"
```

#### 2. Indirect Prompts (5+ examples)

User states a goal but not the tool:

```
✓ "What am I blocked on for the launch?"
✓ "I need to keep our launch tasks organized"
✓ "Show me what I'm supposed to work on this week"
✓ "What bugs are holding up the release?"
✓ "Help me prioritize my work today"
```

#### 3. Negative Prompts

Prompts that should **NOT** trigger your app (measure precision):

```
✗ "What's the weather like?"
✗ "Write a Python function to sort a list"
✗ "Explain how Jira works" (documentation, not your app)
✗ "Show me GitHub issues" (different product)
✗ "What are Jira's pricing plans?" (marketing info, not your app)
```

### Golden Prompt Set Template

```markdown
## Golden Prompt Set: [Use Case Name]

### Direct Prompts (Should Trigger)
1. [Explicit product mention]
2. [Specific action verb + product]
3. [Domain-specific term]
4. [Alternative phrasing]
5. [Mobile/conversational variant]

### Indirect Prompts (Should Trigger)
1. [Goal-oriented, vague]
2. [Problem statement]
3. [Context-heavy]
4. [Alternative domain term]
5. [Question format]

### Negative Prompts (Should NOT Trigger)
1. [Different domain]
2. [Documentation request]
3. [Marketing/pricing inquiry]
4. [Competing product]
5. [General knowledge]

### Edge Cases
1. [Ambiguous case that could go either way]
2. [Requires clarification]
3. [Multi-intent query]
```

### Use These Prompts Later

Reference this golden set when:
- Writing tool descriptions
- Testing metadata changes
- Measuring recall and precision
- Onboarding new team members

---

## Step 3: Scope the Minimum Lovable Feature

For each use case, decide:

### What Information Must Be Visible Inline?

**Questions to Answer:**
- What does the user need to see to answer their question?
- What enables them to take action without leaving ChatGPT?
- What's the minimum viable data set?

**Example: Jira Board View**
```
Minimum inline:
✓ Task title
✓ Assignee
✓ Status
✓ Priority

Nice to have (can defer):
○ Full description
○ Comment history
○ Attachment previews
○ Related issues
```

### Which Actions Require Write Access?

**Categories:**

**Read-only (safe, no confirmation needed):**
- Search/list items
- View details
- Filter/sort
- Export data

**Write (require confirmation in developer mode):**
- Create new items
- Update existing items
- Delete items
- Change permissions
- Send notifications

**Example Decision Matrix:**
```
Action                  | Write Access? | Confirmation? | Priority
------------------------|---------------|---------------|----------
List my tickets         | No            | No            | P0
Search by keyword       | No            | No            | P0
View ticket details     | No            | No            | P0
Create new ticket       | Yes           | Yes           | P1
Update ticket status    | Yes           | Yes           | P1
Delete ticket           | Yes           | Yes           | P2
Assign to user          | Yes           | Yes           | P2
```

### What State Needs to Persist Between Turns?

**Types of State:**

**Session state** (current conversation only):
- Current search filters
- Selected items
- Scroll position
- Expanded/collapsed sections

**Persistent state** (across conversations):
- User preferences
- Saved searches
- Recent items
- Draft content

**Example State Plan:**
```javascript
// Session state (cleared on new conversation)
{
  currentFilters: { status: "open", assignee: "me" },
  selectedTicketId: "PROJ-123",
  scrollPosition: 45
}

// Persistent state (saved to storage)
{
  defaultFilters: { status: "open" },
  savedSearches: ["My urgent bugs", "Sprint items"],
  recentTickets: ["PROJ-123", "PROJ-456"],
  preferredView: "list"
}
```

---

## Step 4: Rank and Prioritize

### Ranking Framework

**Impact vs. Effort Matrix:**

```
High Impact, Low Effort → P0 (Ship first)
High Impact, High Effort → P1 (Plan carefully)
Low Impact, Low Effort → P2 (Quick wins)
Low Impact, High Effort → Defer (Don't build)
```

### Scoring Criteria

**User Impact (1-5):**
- 5: Critical to daily workflow
- 4: Significantly improves efficiency
- 3: Nice to have, solves pain point
- 2: Marginal improvement
- 1: Minimal impact

**Implementation Effort (1-5):**
- 5: Months of work, high complexity
- 4: Weeks of work, multiple systems
- 3: Week of work, standard integration
- 2: Days of work, straightforward API
- 1: Hours of work, simple logic

**Confidence (High/Medium/Low):**
- How sure are you about the impact estimate?
- Do you have user research to back it up?
- Have you tested the prompts?

### Example Prioritization

```markdown
| Use Case              | Impact | Effort | Confidence | Priority |
|-----------------------|--------|--------|------------|----------|
| List my open tickets  | 5      | 2      | High       | P0       |
| Search by keyword     | 4      | 2      | High       | P0       |
| View ticket details   | 4      | 2      | High       | P0       |
| Create new ticket     | 4      | 3      | Medium     | P1       |
| Update ticket status  | 3      | 2      | Medium     | P1       |
| Bulk operations       | 3      | 5      | Low        | P2       |
| Custom workflows      | 2      | 5      | Low        | Defer    |
```

### Common Pattern

**Ship one P0 scenario** with a high-confidence component:
- Validates your approach
- Generates usage data
- Proves value quickly

**Then expand to P1 scenarios** once discovery data confirms engagement:
- Iterate based on real usage
- Add features users actually request
- Optimize for actual pain points

---

## Step 5: Translate Use Cases into Tooling

Once a scenario is in scope, **draft the tool contract**.

### Tool Contract Template

```markdown
## Tool: [tool_name]

### Purpose
[One sentence: what job does this tool do?]

### Inputs (Parameters)
| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| query     | string | No       | ""      | Search term |
| status    | enum   | No       | "open"  | open, closed, all |
| assignee  | string | No       | "me"    | User ID or "me" |
| limit     | number | No       | 10      | Max results (1-50) |

**Enums:**
- status: ["open", "closed", "in_progress", "blocked", "all"]

**Validation:**
- limit must be between 1 and 50
- assignee must be valid user ID or "me"

### Outputs (Structured Content)
```json
{
  "summary": "Found 5 open tickets assigned to you",
  "results": [
    {
      "id": "PROJ-123",
      "title": "Fix login bug",
      "status": "in_progress",
      "priority": "high",
      "assignee": {
        "id": "user_123",
        "name": "Jane Doe"
      },
      "created": "2025-11-15T10:30:00Z",
      "url": "https://jira.example.com/PROJ-123"
    }
  ],
  "total": 5,
  "hasMore": false
}
```

**Fields the model can reason about:**
- ✅ IDs for follow-up actions
- ✅ Timestamps for sorting/filtering
- ✅ Status for understanding context
- ✅ URLs for deep linking

### Component Intent

**Rendering:**
- Returns component: Yes
- Component type: List view
- Display mode: Inline (can expand to fullscreen)

**Interactions:**
- Read-only: No
- Actions: View details, Change status, Add comment
- Multi-turn: Yes (update then refresh)

### Authentication & Permissions

**Auth Required:** Yes (OAuth)
**Scopes Needed:** `read:issues`, `write:issues`
**Rate Limits:** 100 requests/minute per user
```

### Review with Stakeholders

**Before implementation, review with:**

**Legal/Compliance:**
- PII handling
- Data retention
- Audit logging
- Data processing agreements

**Security:**
- Authentication method
- Permission scopes
- Rate limiting
- Input validation

**Product:**
- Feature scope alignment
- Priority confirmation
- Success metrics

**Engineering:**
- Technical feasibility
- API availability
- Performance considerations

---

## Step 6: Prepare for Iteration

Even with solid planning, **expect to revise** after your first dogfood.

### Build In Time For:

**Weekly Prompt Testing:**
- Rotate through golden prompt set
- Log tool selection accuracy
- Measure precision and recall
- Identify edge cases

**Early Tester Feedback:**
- Collect qualitative feedback in ChatGPT developer mode
- Watch session recordings
- Run user interviews
- Track confusion points

**Analytics Collection:**
- Tool call frequency
- Component interaction rates
- Error rates
- Time-to-success metrics
- Drop-off points

### Iteration Checklist

```markdown
## Weekly Review

### Prompt Performance
- [ ] Tested all golden prompts
- [ ] Measured selection accuracy: ___%
- [ ] Found edge cases: [list]
- [ ] Updated metadata based on findings

### User Feedback
- [ ] Collected feedback from __ users
- [ ] Top 3 pain points: [list]
- [ ] Top 3 requests: [list]
- [ ] Action items: [list]

### Analytics
- [ ] Tool calls this week: ___
- [ ] Success rate: ___%
- [ ] Average time-to-completion: ___
- [ ] Most common error: ___

### Next Steps
- [ ] Metadata changes to make
- [ ] Features to add
- [ ] Bugs to fix
- [ ] Tests to write
```

---

## Research Artifacts Become Your Roadmap

These planning artifacts become the backbone for:

### Roadmap Planning
- Prioritized feature list
- User impact estimates
- Technical complexity assessment

### Changelog Updates
- Feature descriptions based on use cases
- Examples based on golden prompts
- Success metrics from analytics

### Success Metrics
- Baseline from initial research
- Goals from impact estimates
- KPIs from analytics plan

### Documentation
- User guides from use case descriptions
- API docs from tool contracts
- Examples from prompt sets

---

## Use Case Planning Checklist

Before moving to implementation:

- [ ] **Research Complete**
  - [ ] User interviews conducted
  - [ ] Support requests analyzed
  - [ ] System constraints documented
  - [ ] Personas defined

- [ ] **Prompts Defined**
  - [ ] 5+ direct prompts per use case
  - [ ] 5+ indirect prompts per use case
  - [ ] Negative prompts identified
  - [ ] Golden prompt set documented

- [ ] **Scope Decided**
  - [ ] Inline information requirements clear
  - [ ] Write access decisions made
  - [ ] State persistence plan documented
  - [ ] Use cases ranked by priority

- [ ] **Tool Contracts Drafted**
  - [ ] Input schemas defined
  - [ ] Output schemas specified
  - [ ] Component intents documented
  - [ ] Auth requirements confirmed

- [ ] **Stakeholder Approval**
  - [ ] Legal/compliance reviewed
  - [ ] Security approved
  - [ ] Product aligned
  - [ ] Engineering feasibility confirmed

- [ ] **Iteration Plan**
  - [ ] Testing schedule set
  - [ ] Feedback mechanism established
  - [ ] Analytics instrumented
  - [ ] Review cadence agreed

---

## Templates

### Use Case One-Pager Template

```markdown
# Use Case: [Name]

## Overview
**User Persona:** [Role, context, technical skill]
**Job-to-be-Done:** [What they're trying to accomplish]
**Success Criteria:** [What success looks like in one sentence]
**Frequency:** [How often this happens]
**Impact:** [High/Medium/Low + why]

## Current State
**Current Solution:** [How they do it today]
**Pain Points:** [What's broken/frustrating]
**Workarounds:** [How they cope currently]

## Proposed Solution
**In ChatGPT:** [How they'll accomplish it]
**Key Features:** [Essential capabilities]
**Not Included:** [Out of scope]

## Prompts
**Direct:** [5 examples]
**Indirect:** [5 examples]
**Negative:** [5 examples]

## Success Metrics
**Adoption:** [How many users]
**Efficiency:** [Time saved]
**Quality:** [Error reduction]
```

---

## Next Steps

Once your use cases are well-researched and documented:

1. **Move to** [Define Tools](./planning-tools.md) to create tool specifications
2. **Then** [Design Components](./planning-components.md) to plan your UI
3. **Finally** start implementation with [Apps SDK Quickstart](./apps-sdk-quickstart.md)

---

## Additional Resources

- [What Makes a Great ChatGPT App](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)
- [UX Principles](./ux-principles.md)
- [Designing Capabilities](./designing-capabilities.md)
- [Conversation Design](./conversation-design.md)

---

**Remember:** Time spent on use case research saves 10x the time in implementation. Don't skip this step!

