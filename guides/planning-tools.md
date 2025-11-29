# Define Tools for ChatGPT Apps

> **Source:** [OpenAI Apps SDK - Define Tools](https://developers.openai.com/apps-sdk/plan/tools)  
> Plan and define tools for your assistant

## Tool-First Thinking

In Apps SDK, **tools are the contract** between your MCP server and the model.

### What Tools Define

Tools describe:
- ✅ **What** the connector can do
- ✅ **How** to call it (inputs/parameters)
- ✅ **What** data comes back (outputs)

### Why Good Tool Design Matters

**Good tool design makes:**
- 🎯 **Discovery accurate** - Model knows when to use your app
- 🔒 **Invocation reliable** - Calls work first time
- 🎨 **UX predictable** - Consistent user experience

Use this checklist to turn your use cases into well-scoped tools **before you touch the SDK**.

---

## Step 1: Draft the Tool Surface Area

Start from the user journey defined in your [use case research](./planning-use-cases.md).

### One Job Per Tool

Keep each tool focused on a **single read or write action**.

**Good (Focused):**
```
✓ fetch_board      - Get board overview
✓ list_tickets     - List filtered tickets  
✓ get_ticket       - Get single ticket details
✓ create_ticket    - Create new ticket
✓ update_ticket    - Update existing ticket
```

**Bad (Kitchen-sink):**
```
✗ manage_jira      - Do anything with Jira
✗ ticket_operations - CRUD operations for tickets
✗ handle_request   - Generic handler
```

### Why This Matters

**One job per tool helps the model:**
- Choose between alternatives clearly
- Understand exactly what each tool does
- Compose tools together for complex tasks
- Handle errors more gracefully

### Example: Project Management App

**Bad Approach (3 tools, too broad):**
```javascript
// ❌ Too broad, hard for model to choose
manage_project({ action: "list" | "create" | "update" | "delete", ... })
view_data({ type: "tasks" | "users" | "reports", ... })
modify_data({ target: "task" | "user" | "project", operation: "add" | "remove" | "change", ... })
```

**Good Approach (8 tools, focused):**
```javascript
// ✅ Clear, single-purpose tools
list_projects({ filter, sort, limit })
get_project({ project_id })
create_project({ name, description })
update_project({ project_id, changes })

list_tasks({ project_id, assignee, status })
get_task({ task_id })
create_task({ project_id, title, assignee })
update_task({ task_id, changes })
```

---

## Step 2: Define Explicit Inputs

Define the shape of `inputSchema` with clear structure.

### Input Schema Structure

For each parameter, specify:
- **Name** - Clear, descriptive
- **Type** - string, number, boolean, enum, object, array
- **Required** - true/false
- **Default** - If optional, what's the default?
- **Description** - What is this parameter for?
- **Validation** - Constraints, ranges, formats

### Example: Well-Defined Input Schema

```typescript
{
  name: "search_tickets",
  description: "Search for tickets by keyword, status, assignee, or priority",
  inputSchema: {
    // Required parameter
    query: {
      type: "string",
      description: "Search term to match in title or description",
      required: true,
      minLength: 1,
      maxLength: 200
    },
    
    // Optional enum
    status: {
      type: "string",
      enum: ["open", "in_progress", "blocked", "closed", "all"],
      description: "Filter by ticket status",
      required: false,
      default: "open"
    },
    
    // Optional with validation
    assignee: {
      type: "string",
      description: "User ID or 'me' for current user, 'unassigned' for unassigned tickets",
      required: false,
      default: "me",
      pattern: "^(me|unassigned|user_[a-z0-9]+)$"
    },
    
    // Number with range
    limit: {
      type: "number",
      description: "Maximum number of results to return",
      required: false,
      default: 10,
      minimum: 1,
      maximum: 50
    },
    
    // Array of enums
    priority: {
      type: "array",
      items: {
        type: "string",
        enum: ["low", "medium", "high", "urgent"]
      },
      description: "Filter by one or more priority levels",
      required: false
    },
    
    // Nested object
    dateRange: {
      type: "object",
      properties: {
        start: {
          type: "string",
          format: "date",
          description: "Start date (YYYY-MM-DD)"
        },
        end: {
          type: "string",
          format: "date",
          description: "End date (YYYY-MM-DD)"
        }
      },
      description: "Filter by creation date range",
      required: false
    }
  }
}
```

### Use Enums for Constrained Sets

**When the set of valid values is known**, use enums:

```typescript
// Good - Enum for constrained values
status: {
  type: "string",
  enum: ["draft", "submitted", "approved", "rejected"],
  description: "Application status"
}

// Bad - Free-form string
status: {
  type: "string",
  description: "Status (use draft, submitted, approved, or rejected)"
}
```

### Document Defaults and Nullables

Make it clear what happens if a parameter is omitted:

```typescript
// Clear defaults
{
  sortBy: {
    type: "string",
    enum: ["date", "priority", "name"],
    default: "date",
    description: "Sort field (defaults to date if not specified)"
  },
  
  sortOrder: {
    type: "string",
    enum: ["asc", "desc"],
    default: "desc",
    description: "Sort order (defaults to descending)"
  },
  
  includeArchived: {
    type: "boolean",
    default: false,
    description: "Include archived items (defaults to false)"
  }
}
```

---

## Step 3: Define Predictable Outputs

Enumerate the **structured fields** you will return.

### Output Schema Best Practices

**Include machine-readable identifiers:**
- IDs the model can reuse in follow-up calls
- Timestamps for temporal reasoning
- Status fields for understanding state
- URLs for deep linking

### Example: Well-Structured Output

```typescript
// Tool output structure
{
  // Human-readable summary
  content: [{
    type: "text",
    text: "Found 5 tickets matching 'login bug'"
  }],
  
  // Structured data for widget and model
  structuredContent: {
    // Summary stats
    summary: {
      total: 5,
      hasMore: false,
      query: "login bug",
      filters: {
        status: "open",
        assignee: "me"
      }
    },
    
    // Result array with consistent structure
    results: [
      {
        // Stable identifier
        id: "PROJ-123",
        
        // Display info
        title: "Fix login redirect bug",
        description: "Users getting 404 after OAuth",
        
        // Temporal data
        created: "2025-11-15T10:30:00Z",
        updated: "2025-11-28T14:22:00Z",
        dueDate: "2025-12-01T00:00:00Z",
        
        // Status and categorization
        status: "in_progress",
        priority: "high",
        type: "bug",
        labels: ["authentication", "urgent"],
        
        // Relationships
        assignee: {
          id: "user_456",
          name: "Jane Doe",
          avatar: "https://..."
        },
        reporter: {
          id: "user_789",
          name: "John Smith"
        },
        project: {
          id: "proj_123",
          name: "Core Platform"
        },
        
        // Metrics
        estimatedHours: 8,
        timeSpent: 4.5,
        commentCount: 12,
        
        // Actions
        url: "https://jira.example.com/PROJ-123",
        canEdit: true,
        canDelete: false
      }
    ],
    
    // Available next actions
    availableActions: [
      "update_status",
      "assign_to_user",
      "add_comment",
      "change_priority"
    ]
  }
}
```

### Fields the Model Can Reason About

**Good (Machine-Readable):**
```json
{
  "priority": "high",           // ✓ Enum value
  "status": "in_progress",      // ✓ Enum value
  "dueDate": "2025-12-01",      // ✓ ISO date
  "timeSpent": 4.5,             // ✓ Number
  "canEdit": true               // ✓ Boolean
}
```

**Bad (Human-Readable Only):**
```json
{
  "priority": "⚠️ High",        // ✗ Emoji, hard to parse
  "status": "Work in progress", // ✗ Natural language
  "dueDate": "Dec 1st",         // ✗ Ambiguous format
  "timeSpent": "4.5 hours",     // ✗ String with units
  "permissions": "Can edit"     // ✗ Natural language
}
```

---

## Step 4: Separate Read and Write

If you need both read and write behavior, **create separate tools**.

### Why Separate Tools?

- ✅ ChatGPT can respect confirmation flows for write actions
- ✅ Clearer permissions model
- ✅ Better error handling
- ✅ Easier to optimize each independently

### Example: Read vs Write Tools

```typescript
// READ TOOL - No confirmation needed
{
  name: "get_ticket",
  description: "Retrieve details for a specific ticket by ID",
  inputSchema: {
    ticket_id: {
      type: "string",
      required: true
    }
  },
  _meta: {
    "openai/readOnlyHint": true  // No confirmation needed
  }
}

// WRITE TOOL - Requires confirmation
{
  name: "update_ticket",
  description: "Update an existing ticket's status, assignee, or other fields",
  inputSchema: {
    ticket_id: {
      type: "string",
      required: true
    },
    changes: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["open", "in_progress", "closed"] },
        assignee: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high"] }
      },
      required: true
    }
  },
  _meta: {
    "openai/readOnlyHint": false  // Confirmation required
  }
}
```

---

## Step 5: Capture Metadata for Discovery

**Discovery is driven almost entirely by metadata.**

### Tool Metadata Checklist

For each tool, define:

#### 1. Name
**Action-oriented and unique** inside your connector

**Good:**
```
✓ kanban.move_task
✓ search_flights
✓ create_reservation
✓ get_weather_forecast
```

**Bad:**
```
✗ doThing
✗ handler
✗ api_call
✗ process
```

#### 2. Description

**Start with "Use this when…"** so the model knows exactly when to pick the tool.

**Good:**
```
✓ "Use this when the user wants to search for flights between two cities on specific dates. Returns available flights with prices, times, and airline information."

✓ "Use this when the user needs to see all open tickets assigned to them or a specific team member. Supports filtering by status, priority, and project."

✓ "Use this when the user wants to create a new calendar event. Requires title, start time, and optionally end time, attendees, and location."
```

**Bad:**
```
✗ "Searches flights"
✗ "Gets tickets"
✗ "Creates events"
```

#### 3. Parameter Annotations

Describe each argument and call out safe ranges or enumerations.

```typescript
{
  city: {
    type: "string",
    description: "City name or airport code (e.g., 'Seattle', 'SEA'). Use 3-letter IATA codes when available for more accurate results.",
    required: true
  },
  
  maxPrice: {
    type: "number",
    description: "Maximum price in USD. Must be positive. Typical range is $100-$2000 for domestic flights.",
    minimum: 0,
    maximum: 10000
  }
}
```

#### 4. Global Metadata

Confirm you have app-level metadata ready:

```typescript
{
  name: "MyApp",
  version: "1.0.0",
  description: "Brief description of what your app does",
  icon: "https://example.com/icon.png",  // 512x512px PNG
  author: {
    name: "Company Name",
    url: "https://example.com"
  },
  categories: ["productivity", "collaboration"],
  keywords: ["project management", "tasks", "collaboration"]
}
```

---

## Step 6: Model-Side Guardrails

Think through how the model should behave once a tool is linked.

### Prelinked vs. Link-Required

**Prelinked (No auth required):**
```typescript
{
  name: "get_weather",
  description: "Get current weather for a city",
  // No auth required, works for anyone
}
```

**Link-Required (Auth required):**
```typescript
{
  name: "list_my_tickets",
  description: "List tickets assigned to the authenticated user",
  // Requires OAuth, user must link account
  authRequired: true
}
```

### Read-Only Hints

Set the `readOnlyHint` annotation for tools that **cannot mutate state**:

```typescript
{
  name: "search_products",
  _meta: {
    "openai/readOnlyHint": true  // Skip confirmation prompts
  }
}

{
  name: "create_order",
  _meta: {
    "openai/readOnlyHint": false  // Require confirmation
  }
}
```

### Result Components

Decide whether each tool should **render a component, return JSON only, or both**:

```typescript
// Render inline component
{
  name: "search_hotels",
  _meta: {
    "openai/outputTemplate": "ui://widget/hotel-results.html"
  }
}

// JSON only (no component)
{
  name: "check_availability",
  // No outputTemplate - model uses JSON directly
}

// Both (component + JSON for model to reason about)
{
  name: "get_flight_options",
  _meta: {
    "openai/outputTemplate": "ui://widget/flights.html"
  }
  // Also returns structured JSON
}
```

---

## Step 7: Golden Prompt Rehearsal

**Before you implement**, sanity-check your tool set against the prompt list you captured in [use case research](./planning-use-cases.md).

### Validation Checklist

#### 1. Direct Prompts (Should Work)

For every direct prompt, confirm you have **exactly one tool** that clearly addresses the request.

**Example:**
```
Prompt: "Show my Jira board"
Expected tool: list_tickets
Why: Clear, specific request for ticket list

Prompt: "Create a new bug ticket for the login issue"
Expected tool: create_ticket  
Why: Explicit create action
```

#### 2. Indirect Prompts (Should Discover)

For indirect prompts, ensure tool descriptions give the model **enough context** to select your connector.

**Example:**
```
Prompt: "What am I blocked on?"
Expected tool: list_tickets (with status=blocked filter)
Why: Tool description mentions "blocked" and "status filtering"

Prompt: "Help me prioritize my work today"
Expected tool: list_tickets (with sort=priority)
Why: Tool description mentions "priority" sorting
```

#### 3. Negative Prompts (Should NOT Trigger)

For negative prompts, verify your metadata will **keep the tool hidden** unless explicitly requested.

**Example:**
```
Prompt: "What's the weather?"
Expected: NOT your tool
Why: Different domain, clear mismatch

Prompt: "Explain how Jira works"
Expected: NOT your tool
Why: Documentation request, not your app's job
```

### Document Gaps and Ambiguities

**If you find issues:**

```markdown
## Gap Analysis

### Missing Tools
- [ ] Need "bulk_update_tickets" for "update all my high-priority tickets"
- [ ] Need "archive_project" for "archive completed projects"

### Ambiguous Descriptions
- [ ] "list_tickets" description doesn't mention "blocked" status
- [ ] "create_ticket" description doesn't mention templates

### Negative Prompt Failures
- [ ] "get_ticket_pricing" might trigger on "Jira pricing" (marketing query)
- [ ] Need to exclude documentation/help queries
```

**Fix these before implementation** - changing metadata before launch is much cheaper than refactoring code later.

---

## Step 8: Handoff to Implementation

When you're ready to implement, compile a **handoff document**.

### Handoff Document Template

```markdown
# Tool Implementation Spec: [tool_name]

## Overview
**Purpose:** [One sentence job description]
**Priority:** P0 / P1 / P2
**Owner:** [Engineer name]
**Reviewer:** [Tech lead name]

## Tool Definition

### Metadata
- **Name:** `tool_name`
- **Description:** [Full description starting with "Use this when..."]
- **Read-Only:** Yes / No
- **Auth Required:** Yes / No

### Input Schema
```typescript
{
  param1: {
    type: "string",
    required: true,
    description: "..."
  },
  // ...
}
```

### Output Schema
```typescript
{
  content: [...],
  structuredContent: {
    // Full expected structure
  }
}
```

### Component
- **Renders Component:** Yes / No
- **Component File:** `ui://widget/name.html`
- **Display Mode:** Inline / Fullscreen / Both

## Implementation Details

### API Endpoints
- `GET /api/tickets` - Fetch tickets
- `POST /api/tickets` - Create ticket

### Authentication
- **Method:** OAuth 2.0
- **Scopes:** `read:tickets`, `write:tickets`
- **Token Storage:** Server-side session

### Rate Limits
- 100 requests/minute per user
- 1000 requests/hour per user
- Exponential backoff on 429

### Error Handling
| Error Code | Scenario | User Message |
|------------|----------|--------------|
| 400 | Invalid params | "Please provide a valid ticket ID" |
| 401 | Not authenticated | "Please link your account first" |
| 403 | No permission | "You don't have permission to view this ticket" |
| 404 | Not found | "Ticket not found" |
| 429 | Rate limited | "Too many requests. Please try again in a minute" |
| 500 | Server error | "Something went wrong. Please try again" |

## Test Cases

### Positive Test Cases (Should Succeed)
1. "Show my open tickets" → list_tickets(status="open", assignee="me")
2. "Find bugs assigned to Jane" → list_tickets(type="bug", assignee="jane")
3. "Create ticket for login issue" → create_ticket(title="login issue")

### Negative Test Cases (Should Fail Gracefully)
1. Invalid ticket ID → 404 with helpful message
2. No auth token → 401 with link to connect account
3. Missing required param → 400 with parameter name

### Edge Cases
1. Empty result set → Return empty array with helpful message
2. Very large result set → Paginate, return first page
3. Special characters in query → Properly escape/sanitize

## Success Criteria
- [ ] All positive test cases pass
- [ ] All error cases handled gracefully  
- [ ] Golden prompts route correctly
- [ ] Component renders properly
- [ ] Performance under 2 seconds
- [ ] Code reviewed and approved
```

---

## Tool Planning Checklist

Before moving to implementation:

- [ ] **Tool Surface Area**
  - [ ] Each tool has one clear job
  - [ ] Read and write operations separated
  - [ ] Tool names are action-oriented

- [ ] **Input Schemas**
  - [ ] All parameters typed
  - [ ] Required vs optional marked
  - [ ] Defaults documented
  - [ ] Enums used for constrained sets
  - [ ] Validation rules specified

- [ ] **Output Schemas**
  - [ ] Structured content defined
  - [ ] Machine-readable IDs included
  - [ ] Timestamps in ISO format
  - [ ] Model can reason about fields

- [ ] **Metadata**
  - [ ] Tool names unique and clear
  - [ ] Descriptions start with "Use this when..."
  - [ ] Parameters annotated
  - [ ] Global metadata ready

- [ ] **Model Guardrails**
  - [ ] Auth requirements defined
  - [ ] Read-only hints set
  - [ ] Component rendering decided

- [ ] **Validation**
  - [ ] Golden prompts tested
  - [ ] Gaps documented
  - [ ] Negative cases handled

- [ ] **Handoff**
  - [ ] Implementation specs written
  - [ ] Test cases defined
  - [ ] Success criteria clear
  - [ ] Stakeholder approval obtained

---

## Next Steps

Once your tools are well-defined:

1. **Move to** [Design Components](./planning-components.md) to plan your UI
2. **Then** start implementation with [MCP Server Guide](./mcp-server-guide.md)
3. **Reference** [Implementation Examples](./implementation-examples.md) for code patterns

---

## Additional Resources

- [MCP Server Guide](./mcp-server-guide.md) - Technical implementation
- [Implementation Examples](./implementation-examples.md) - Code examples
- [Apps SDK Reference](https://developers.openai.com/docs/chatgpt-apps/reference)

---

**Remember:** Well-defined tools are the foundation of great ChatGPT apps. Invest time here to save 10x later.

