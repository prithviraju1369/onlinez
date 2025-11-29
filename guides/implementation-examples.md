# Implementation Examples for ChatGPT Apps

> Practical code examples and patterns for building ChatGPT apps

## MCP Server Action Definitions

### Good Example: Clear, Well-Scoped Actions

```typescript
// Real estate search app
{
  name: "search_properties",
  description: "Search for residential properties to buy or rent. Use when user wants to find homes, apartments, or condos based on location, price, size, or amenities.",
  parameters: {
    location: {
      type: "string",
      description: "City, neighborhood, ZIP code, or address (e.g., 'Seattle', '98101', 'Capitol Hill')",
      required: true
    },
    property_type: {
      type: "string",
      enum: ["house", "apartment", "condo", "townhouse", "any"],
      description: "Type of property",
      required: false,
      default: "any"
    },
    max_price: {
      type: "number",
      description: "Maximum price in USD",
      required: false
    },
    min_bedrooms: {
      type: "number",
      description: "Minimum number of bedrooms",
      required: false
    },
    near_schools: {
      type: "boolean",
      description: "Filter for properties near highly-rated schools",
      required: false,
      default: false
    }
  }
}
```

```typescript
// Ticket creation app
{
  name: "create_support_ticket",
  description: "Create a support ticket in the company's ticketing system. Use when user reports a problem, asks for help, or needs technical support.",
  parameters: {
    title: {
      type: "string",
      description: "Brief summary of the issue (max 100 chars)",
      required: true
    },
    description: {
      type: "string", 
      description: "Detailed description of the problem",
      required: true
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high", "urgent"],
      description: "Priority level based on impact",
      required: false,
      default: "medium"
    },
    category: {
      type: "string",
      enum: ["bug", "feature_request", "question", "access_issue"],
      description: "Type of ticket",
      required: false
    }
  }
}
```

### Bad Example: Vague, Ambiguous Actions

```typescript
// ❌ Too vague
{
  name: "search",
  description: "Search for stuff",
  parameters: {
    query: { type: "string", required: true }
  }
}

// ❌ Too many responsibilities
{
  name: "handle_real_estate",
  description: "Does everything related to real estate",
  parameters: {
    action: { type: "string" },
    data: { type: "object" }  // Blob of unstructured data
  }
}

// ❌ Unclear when to use
{
  name: "get_data",
  description: "Gets data from our system",
  parameters: {
    id: { type: "string" }  // What kind of ID?
  }
}
```

---

## Response Structures

### Good Example: Structured + Human-Readable

```typescript
// Property search response
{
  "summary": "Found 8 homes in Seattle under $1.2M with 3+ bedrooms near top-rated schools",
  "count": 8,
  "results": [
    {
      "id": "prop_12345",
      "address": "123 Maple Street",
      "city": "Seattle",
      "neighborhood": "Capitol Hill",
      "price": 1150000,
      "bedrooms": 3,
      "bathrooms": 2.5,
      "sqft": 2100,
      "school_rating": 9,
      "commute_to_downtown_mins": 15,
      "listing_url": "https://example.com/prop_12345",
      "image_url": "https://example.com/images/prop_12345.jpg"
    }
    // ... more results
  ],
  "next_actions": [
    "Ask me to filter by neighborhood or commute time",
    "Request more details about a specific property",
    "Schedule a showing"
  ]
}
```

```typescript
// Ticket creation response
{
  "summary": "Created support ticket #T-8472 with high priority",
  "ticket": {
    "id": "T-8472",
    "title": "Cannot access dashboard after login",
    "status": "open",
    "priority": "high",
    "created_at": "2025-11-29T10:30:00Z",
    "assigned_to": "Support Team",
    "url": "https://support.example.com/tickets/T-8472"
  },
  "next_steps": [
    "You'll receive updates via email",
    "Expected response time: 2 hours",
    "Track status at the link above"
  ]
}
```

### Bad Example: Unstructured or Incomplete

```typescript
// ❌ Only text, no structure
{
  "message": "I found some properties in Seattle that might work for you. There's one on Maple Street for $1.15M with 3 bedrooms..."
}

// ❌ Structure without context
{
  "data": [
    {"id": "123", "p": 1150000, "b": 3},
    {"id": "456", "p": 980000, "b": 4}
  ]
}

// ❌ Missing next steps or URLs
{
  "ticket_id": "T-8472",
  "status": "created"
  // No URL to view it, no next steps
}
```

---

## Conversation Flow Patterns

### Pattern 1: Vague Intent → Progressive Disclosure

```typescript
// Turn 1: Vague request
User: "Help me find a place to live"

App Response:
{
  summary: "I can help you search for homes and apartments. I'll need to know a bit more.",
  questions: [
    "Which city or area are you interested in?",
    "What's your approximate budget?"
  ],
  example: "Or just tell me something like 'I want a 2-bedroom apartment in Brooklyn under $3000/month'"
}

// Turn 2: User provides partial info
User: "Seattle, maybe $1M"

App Response:
{
  summary: "Showing 15 properties in Seattle under $1M",
  results: [/* top 5 results */],
  refinements: [
    "How many bedrooms do you need?",
    "Any specific neighborhoods?",
    "Prefer house or apartment?"
  ]
}

// Turn 3: User refines
User: "3 bedrooms, near good schools"

App Response:
{
  summary: "Found 8 homes with 3+ bedrooms near top-rated schools",
  results: [/* filtered results */]
}
```

### Pattern 2: Specific Intent → Immediate Results

```typescript
// Turn 1: Specific request
User: "Find 3-bedroom houses in Seattle under $1.2M near elementary schools with ratings above 8"

App Response:
{
  summary: "Found 8 homes matching all your criteria",
  results: [/* structured results */],
  optional_refinements: [
    "Want to filter by commute time to downtown?",
    "Interested in seeing newer construction only?",
    "Prefer specific neighborhoods like Capitol Hill or Ballard?"
  ]
}
```

### Pattern 3: Zero Brand Awareness → Introduction + Value

```typescript
// Turn 1: User doesn't know the app exists
User: "I need to find a hotel in Chicago next month"

App Response:
{
  introduction: "I'm Acme Hotels - I search real-time availability and pricing across major hotel chains.",
  summary: "Found 12 hotels in Chicago with availability next month",
  results: [/* top 5 results */],
  next_steps: [
    "Tell me your dates and I'll check exact availability",
    "Filter by neighborhood, price, or amenities",
    "See reviews and photos for any hotel"
  ]
}
```

### Pattern 4: Graceful Degradation

```typescript
// User request that can't be fulfilled exactly
User: "5-bedroom houses under $500k in Manhattan"

App Response:
{
  summary: "I didn't find any 5-bedroom homes under $500k in Manhattan, but here are close alternatives:",
  alternatives: [
    {
      type: "nearby_location",
      summary: "3 homes in Brooklyn at that price point",
      results: [/* results */]
    },
    {
      type: "adjusted_criteria", 
      summary: "2 homes in Manhattan with 4 bedrooms under $600k",
      results: [/* results */]
    }
  ],
  question: "Would either of these work, or would you like to adjust your search?"
}
```

---

## Error Handling

### Good Error Responses

```typescript
// Invalid parameter
{
  error: "invalid_parameter",
  message: "I need a specific location to search. Could you tell me which city or neighborhood?",
  suggestions: [
    "Try: 'Search in Seattle'",
    "Or: 'Find homes in ZIP code 98101'"
  ]
}

// Service unavailable
{
  error: "service_unavailable",
  message: "I'm having trouble connecting to the property database right now.",
  fallback: "I can still help you with general questions about neighborhoods or the buying process. What would be helpful?",
  retry_after: "This usually resolves in a few minutes. You can try searching again shortly."
}

// No results found
{
  error: "no_results",
  message: "I didn't find any properties matching all your criteria.",
  suggestions: [
    "Try expanding your budget to $1.5M",
    "Consider nearby neighborhoods like Fremont or Wallingford",
    "Look at 2-bedroom options instead"
  ],
  alternative_search: "Would you like me to try any of these?"
}
```

### Bad Error Responses

```typescript
// ❌ Technical jargon
{
  error: "ERR_DB_CONNECTION_TIMEOUT",
  message: "Database connection timeout on query execution"
}

// ❌ No guidance
{
  error: "Failed",
  message: "Something went wrong"
}

// ❌ Blame the user
{
  error: "Invalid input",
  message: "You didn't provide the required fields"
}
```

---

## Widget/UI Components

### Property Listing Widget

```typescript
{
  type: "list",
  items: [
    {
      id: "prop_123",
      image: "https://example.com/images/prop_123.jpg",
      title: "123 Maple Street",
      subtitle: "Capitol Hill, Seattle",
      primary_info: "$1,150,000",
      secondary_info: "3 bed • 2.5 bath • 2,100 sqft",
      badges: [
        { text: "Near schools", variant: "success" },
        { text: "New listing", variant: "info" }
      ],
      actions: [
        {
          label: "View Details",
          action: "view_property_details",
          params: { property_id: "prop_123" }
        },
        {
          label: "Schedule Showing",
          action: "schedule_showing",
          params: { property_id: "prop_123" }
        }
      ]
    }
  ]
}
```

### Comparison Table Widget

```typescript
{
  type: "comparison_table",
  title: "Top 3 Properties Comparison",
  headers: ["Property", "Price", "Bedrooms", "School Rating", "Commute"],
  rows: [
    {
      id: "prop_123",
      cells: [
        { value: "123 Maple St", type: "text" },
        { value: "$1,150,000", type: "currency", highlight: true },
        { value: "3", type: "number" },
        { value: "9/10", type: "rating" },
        { value: "15 min", type: "text" }
      ]
    },
    // ... more rows
  ]
}
```

---

## Data Minimization Examples

### Good: Minimal Collection

```typescript
// Only collect what's needed
{
  name: "search_properties",
  parameters: {
    location: { type: "string", required: true },
    max_price: { type: "number", required: false },
    min_bedrooms: { type: "number", required: false }
  }
}

// Clear about why sensitive data is needed
{
  name: "schedule_showing",
  parameters: {
    property_id: { type: "string", required: true },
    phone: { 
      type: "string",
      required: true,
      description: "Phone number for the realtor to confirm your showing"
    },
    preferred_time: { type: "string", required: false }
  }
}
```

### Bad: Over-Collection

```typescript
// ❌ Asking for unnecessary data
{
  name: "search_properties",
  parameters: {
    location: { type: "string", required: true },
    user_full_profile: {  // Don't need this
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        ssn: { type: "string" }  // Definitely don't need this!
      }
    },
    conversation_history: { type: "string" }  // Blob of data
  }
}
```

---

## Testing Examples

### Test Suite Structure

```typescript
const testCases = [
  // Positive cases
  {
    name: "Specific search with all parameters",
    input: {
      location: "Seattle",
      max_price: 1200000,
      min_bedrooms: 3,
      near_schools: true
    },
    expectedBehavior: "Should return filtered results with school ratings"
  },
  
  // Negative cases
  {
    name: "Search with impossible criteria",
    input: {
      location: "Manhattan",
      max_price: 100000,
      min_bedrooms: 5
    },
    expectedBehavior: "Should gracefully suggest alternatives"
  },
  
  // Edge cases
  {
    name: "Search with only location",
    input: {
      location: "Seattle"
    },
    expectedBehavior: "Should return diverse results and suggest refinements"
  },
  
  {
    name: "Invalid location",
    input: {
      location: "Narnia"
    },
    expectedBehavior: "Should ask for clarification or suggest valid locations"
  },
  
  // Vague intent
  {
    name: "User says 'help me find a home'",
    input: {},
    expectedBehavior: "Should ask 1-2 clarifying questions and show examples"
  }
];
```

---

## Complete Example: Job Search App

```typescript
// actions.ts
export const actions = [
  {
    name: "search_jobs",
    description: "Search for job openings by title, company, location, or keywords. Use when user wants to find job opportunities.",
    parameters: {
      query: {
        type: "string",
        description: "Job title, keywords, or company name",
        required: false
      },
      location: {
        type: "string",
        description: "City, state, or 'remote'",
        required: false
      },
      experience_level: {
        type: "string",
        enum: ["entry", "mid", "senior", "lead"],
        required: false
      },
      employment_type: {
        type: "string",
        enum: ["full_time", "part_time", "contract", "internship"],
        required: false,
        default: "full_time"
      }
    }
  },
  
  {
    name: "get_job_details",
    description: "Get detailed information about a specific job posting including full description, requirements, and benefits.",
    parameters: {
      job_id: {
        type: "string",
        description: "Unique job posting ID from search results",
        required: true
      }
    }
  },
  
  {
    name: "save_job",
    description: "Save a job to the user's saved jobs list for later review.",
    parameters: {
      job_id: {
        type: "string",
        required: true
      }
    }
  }
];

// Response handler
function handleSearchJobs(params) {
  const results = performSearch(params);
  
  return {
    summary: `Found ${results.length} ${params.experience_level || ''} jobs${params.location ? ` in ${params.location}` : ''}`,
    count: results.length,
    results: results.slice(0, 10).map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      employment_type: job.type,
      salary_range: job.salary,
      posted_date: job.posted,
      match_score: job.matchScore,
      url: `https://jobs.example.com/${job.id}`
    })),
    next_actions: results.length > 0 ? [
      "Ask me for details about any specific job",
      "Save interesting jobs to review later",
      "Refine by experience level, company size, or salary"
    ] : [
      "Try broadening your search criteria",
      "Remove location filter to see remote options",
      "Search for related job titles"
    ]
  };
}
```

---

## Key Implementation Principles

### 1. Action Design
- ✅ Clear, specific names (`search_jobs` not `search`)
- ✅ Detailed descriptions including when to use
- ✅ Well-documented parameters with types and examples
- ✅ Sensible defaults for optional parameters

### 2. Response Structure
- ✅ Human-readable summary at top
- ✅ Structured, consistent data format
- ✅ Stable IDs for all entities
- ✅ Clear next actions/suggestions

### 3. Error Handling
- ✅ Helpful error messages in plain language
- ✅ Actionable suggestions for recovery
- ✅ Graceful degradation with alternatives

### 4. Privacy
- ✅ Collect only necessary data
- ✅ Explain why sensitive data is needed
- ✅ Never expose internal IDs, tokens, or secrets

### 5. Composability
- ✅ Small, focused actions
- ✅ Outputs that other apps can use
- ✅ Stable schemas over time

---

## Resources

- [MCP Server Documentation](https://modelcontextprotocol.io)
- [Apps SDK Examples](https://developers.openai.com/docs/chatgpt-apps/examples)
- [Apps SDK UI Library](https://developers.openai.com/docs/chatgpt-apps/ui-library)

---

These implementation examples demonstrate the patterns and principles from the other guides. Use them as templates when building your own ChatGPT app capabilities.

