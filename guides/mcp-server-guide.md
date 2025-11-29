# Model Context Protocol (MCP) Server Guide

> Deep dive into building MCP servers for ChatGPT apps

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to data sources and tools. For ChatGPT apps, MCP is the bridge between your application and ChatGPT.

### Key Concepts

**MCP Server**
- Exposes your app's capabilities (tools) to ChatGPT
- Provides UI components (resources) for rendering
- Handles authentication and state management
- Processes tool calls and returns responses

**Transport Layer**
- HTTP/HTTPS for ChatGPT apps
- Stateless or stateful sessions
- CORS support for browser access

**Resources**
- UI widgets rendered in ChatGPT
- HTML components with interactive capabilities
- Access to `window.openai` API

**Tools**
- Capabilities your app provides
- Called by ChatGPT on user's behalf
- Input validation via schemas
- Structured output for widgets

---

## MCP Server Architecture

```
┌─────────────────────────────────────────┐
│           ChatGPT                       │
│  ┌───────────────────────────────────┐  │
│  │  Model decides when to use tools  │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
└──────────────────┼───────────────────────┘
                   │ MCP Protocol (HTTPS)
                   │
┌──────────────────▼───────────────────────┐
│         Your MCP Server                  │
│  ┌─────────────────────────────────────┐ │
│  │  HTTP Server (Node.js, etc.)        │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │   MCP SDK                     │  │ │
│  │  │  - Tool Registry              │  │ │
│  │  │  - Resource Registry          │  │ │
│  │  │  - Request Handler            │  │ │
│  │  └───────────┬───────────────────┘  │ │
│  └──────────────┼──────────────────────┘ │
│                 │                         │
│  ┌──────────────▼──────────────────────┐ │
│  │  Your Business Logic                │ │
│  │  - Database queries                 │ │
│  │  - API calls                        │ │
│  │  - Data processing                  │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Setting Up an MCP Server

### 1. Install Dependencies

```bash
npm install @modelcontextprotocol/sdk zod
```

### 2. Create Basic Server

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";

// Create MCP server instance
const mcpServer = new McpServer({
  name: "my-app",
  version: "1.0.0"
});

// Set up HTTP transport
const port = process.env.PORT ?? 8787;
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id"
    });
    res.end();
    return;
  }
  
  // Handle MCP requests
  if (url.pathname === MCP_PATH) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,  // Stateless
      enableJsonResponse: true
    });
    
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }
  
  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`MCP server running on http://localhost:${port}${MCP_PATH}`);
});
```

---

## Registering Resources (UI Widgets)

Resources are UI components rendered in ChatGPT.

### Basic Widget Registration

```javascript
import { readFileSync } from "node:fs";

const widgetHtml = readFileSync("./widgets/my-widget.html", "utf8");

mcpServer.registerResource(
  "my-widget",           // Resource name
  "ui://widget/my.html", // Resource URI
  {},                    // Options
  async () => ({
    contents: [{
      uri: "ui://widget/my.html",
      mimeType: "text/html+skybridge",  // Required for widgets
      text: widgetHtml,
      _meta: {
        "openai/widgetPrefersBorder": true  // Optional border
      }
    }]
  })
);
```

### Widget Metadata Options

```javascript
_meta: {
  // Request a border around the widget
  "openai/widgetPrefersBorder": true,
  
  // Suggested width (if applicable)
  "openai/widgetWidth": "medium",  // small, medium, large
  
  // Custom properties
  "myapp/customData": { /* ... */ }
}
```

---

## Registering Tools (Capabilities)

Tools are the capabilities your app exposes to ChatGPT.

### Basic Tool Registration

```javascript
import { z } from "zod";

mcpServer.registerTool(
  "search_items",  // Tool name (use snake_case)
  {
    title: "Search Items",
    description: "Search for items by keyword, category, or price range. Use when user wants to find products or browse inventory.",
    inputSchema: {
      query: z.string().optional(),
      category: z.string().optional(),
      max_price: z.number().positive().optional(),
      limit: z.number().int().positive().max(50).default(10)
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/results.html",
      "openai/toolInvocation/invoking": "Searching items...",
      "openai/toolInvocation/invoked": "Found items"
    }
  },
  async (args) => {
    // Tool implementation
    const results = await performSearch(args);
    
    return {
      content: [{
        type: "text",
        text: `Found ${results.length} items matching your criteria.`
      }],
      structuredContent: {
        results: results
      }
    };
  }
);
```

### Input Schema with Zod

```javascript
// Simple types
const schema = {
  name: z.string().min(1),
  age: z.number().int().positive(),
  email: z.string().email(),
  isActive: z.boolean()
};

// Optional with defaults
const schema = {
  limit: z.number().int().default(10),
  offset: z.number().int().optional(),
  sortBy: z.enum(["name", "date", "price"]).default("name")
};

// Complex objects
const schema = {
  user: z.object({
    id: z.string(),
    preferences: z.object({
      theme: z.enum(["light", "dark"]),
      notifications: z.boolean()
    })
  })
};

// Arrays
const schema = {
  tags: z.array(z.string()).min(1).max(10),
  ids: z.array(z.string().uuid())
};

// Unions
const schema = {
  identifier: z.union([
    z.string().email(),
    z.string().uuid()
  ])
};
```

### Tool Metadata

```javascript
_meta: {
  // Which widget to render with the response
  "openai/outputTemplate": "ui://widget/my-widget.html",
  
  // Loading message while tool is executing
  "openai/toolInvocation/invoking": "Processing your request...",
  
  // Success message after tool completes
  "openai/toolInvocation/invoked": "Request completed",
  
  // Error message (optional)
  "openai/toolInvocation/error": "Request failed",
  
  // Additional context for the model
  "openai/toolDescription/context": "Use this when user wants to...",
  
  // Custom metadata
  "myapp/category": "search",
  "myapp/requiresAuth": true
}
```

---

## Tool Response Formats

### Text-Only Response

```javascript
return {
  content: [{
    type: "text",
    text: "Task completed successfully!"
  }]
};
```

### Response with Structured Data

```javascript
return {
  content: [{
    type: "text",
    text: `Found ${results.length} items.`
  }],
  structuredContent: {
    items: results.map(r => ({
      id: r.id,
      name: r.name,
      price: r.price
    }))
  }
};
```

### Multiple Content Blocks

```javascript
return {
  content: [
    {
      type: "text",
      text: "Here's a summary:"
    },
    {
      type: "text",
      text: "- Item 1: $10\n- Item 2: $20"
    }
  ],
  structuredContent: { /* ... */ }
};
```

### Error Response

```javascript
return {
  content: [{
    type: "text",
    text: "Sorry, I couldn't complete that request. The item was not found."
  }],
  isError: true
};
```

---

## Widget API (`window.openai`)

Widgets have access to the `window.openai` API for interacting with ChatGPT.

### Accessing Initial Data

```javascript
// Get data passed from tool response
const initialData = window.openai?.toolOutput;

// Example:
const tasks = window.openai?.toolOutput?.tasks ?? [];
const user = window.openai?.toolOutput?.user;
```

### Listening for Updates

```javascript
window.addEventListener("openai:set_globals", (event) => {
  const globals = event.detail?.globals;
  
  // Update your UI with new data
  if (globals?.toolOutput) {
    updateUI(globals.toolOutput);
  }
}, { passive: true });
```

### Calling Tools from Widget

```javascript
async function handleAction() {
  try {
    const response = await window.openai.callTool("my_tool", {
      param1: "value1",
      param2: 123
    });
    
    // Response contains:
    // - content: text content
    // - structuredContent: data for UI
    if (response?.structuredContent) {
      updateUI(response.structuredContent);
    }
  } catch (error) {
    console.error("Tool call failed:", error);
  }
}
```

### Complete Widget Example

```javascript
<script type="module">
  // State management
  let currentData = window.openai?.toolOutput?.data ?? [];
  
  // Render function
  function render() {
    const container = document.getElementById("container");
    container.innerHTML = currentData.map(item => `
      <div class="item" data-id="${item.id}">
        <h3>${item.name}</h3>
        <button onclick="handleDelete('${item.id}')">Delete</button>
      </div>
    `).join("");
  }
  
  // Listen for updates
  window.addEventListener("openai:set_globals", (event) => {
    const globals = event.detail?.globals;
    if (globals?.toolOutput?.data) {
      currentData = globals.toolOutput.data;
      render();
    }
  });
  
  // Call tools
  window.handleDelete = async (id) => {
    try {
      const response = await window.openai.callTool("delete_item", { id });
      if (response?.structuredContent?.data) {
        currentData = response.structuredContent.data;
        render();
      }
    } catch (err) {
      alert("Failed to delete item");
    }
  };
  
  // Initial render
  render();
</script>
```

---

## Session Management

### Stateless Mode (Recommended for Most Apps)

```javascript
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,  // Stateless
  enableJsonResponse: true
});
```

**Pros:**
- Simple to deploy
- Scales horizontally
- No server-side state to manage

**Cons:**
- Can't persist data between tool calls
- Widget state must be managed client-side

### Stateful Mode

```javascript
const sessions = new Map();

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID(),
  enableJsonResponse: true
});

// Store session data
mcpServer.registerTool("create_session", {/* ... */}, async (args, context) => {
  const sessionId = context.sessionId;
  sessions.set(sessionId, { userId: args.userId, data: {} });
  return { content: [{ type: "text", text: "Session created" }] };
});

// Access session data
mcpServer.registerTool("update_data", {/* ... */}, async (args, context) => {
  const session = sessions.get(context.sessionId);
  if (!session) {
    return { content: [{ type: "text", text: "Session not found" }], isError: true };
  }
  session.data = args.data;
  return { content: [{ type: "text", text: "Data updated" }] };
});
```

---

## Authentication

### OAuth Flow (Coming Soon)

```javascript
// Server responds to OAuth discovery
if (url.pathname === "/.well-known/oauth-authorization-server") {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    authorization_endpoint: "https://your-app.com/oauth/authorize",
    token_endpoint: "https://your-app.com/oauth/token"
  }));
  return;
}
```

### API Key Authentication (Current Alternative)

```javascript
mcpServer.registerTool("protected_action", {/* ... */}, async (args) => {
  // Validate API key from args
  if (!isValidApiKey(args.apiKey)) {
    return {
      content: [{ type: "text", text: "Invalid API key" }],
      isError: true
    };
  }
  
  // Proceed with authenticated action
  const result = await performProtectedAction(args.apiKey);
  return { content: [{ type: "text", text: "Success" }] };
});
```

---

## Error Handling

### Validation Errors

```javascript
mcpServer.registerTool("create_item", {/* ... */}, async (args) => {
  // Validate inputs
  if (!args.name || args.name.trim().length === 0) {
    return {
      content: [{
        type: "text",
        text: "Item name is required and cannot be empty."
      }],
      isError: true
    };
  }
  
  if (args.price < 0) {
    return {
      content: [{
        type: "text",
        text: "Price must be a positive number."
      }],
      isError: true
    };
  }
  
  // Proceed with creation
  const item = await createItem(args);
  return {
    content: [{ type: "text", text: `Created item: ${item.name}` }],
    structuredContent: { item }
  };
});
```

### External API Errors

```javascript
mcpServer.registerTool("fetch_data", {/* ... */}, async (args) => {
  try {
    const data = await externalAPI.fetchData(args.query);
    return {
      content: [{ type: "text", text: `Found ${data.length} results` }],
      structuredContent: { results: data }
    };
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return {
        content: [{
          type: "text",
          text: "No results found. Try different search terms."
        }]
      };
    }
    
    if (error.code === "RATE_LIMIT") {
      return {
        content: [{
          type: "text",
          text: "Too many requests. Please try again in a few minutes."
        }],
        isError: true
      };
    }
    
    // Generic error
    console.error("External API error:", error);
    return {
      content: [{
        type: "text",
        text: "Sorry, something went wrong. Please try again later."
      }],
      isError: true
    };
  }
});
```

---

## Testing Your MCP Server

### 1. MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

Benefits:
- Test all tools interactively
- See request/response payloads
- Debug schema validation
- Preview widgets

### 2. Unit Tests

```javascript
import { describe, it, expect } from "vitest";

describe("search_items tool", () => {
  it("should return results for valid query", async () => {
    const response = await searchItemsTool({ query: "laptop" });
    
    expect(response.content).toBeDefined();
    expect(response.structuredContent.results).toBeInstanceOf(Array);
    expect(response.structuredContent.results.length).toBeGreaterThan(0);
  });
  
  it("should handle empty query gracefully", async () => {
    const response = await searchItemsTool({ query: "" });
    
    expect(response.content[0].text).toContain("no results");
  });
  
  it("should validate price range", async () => {
    const response = await searchItemsTool({ max_price: -10 });
    
    expect(response.isError).toBe(true);
  });
});
```

### 3. Integration Tests

```javascript
import { describe, it, expect } from "vitest";
import fetch from "node-fetch";

describe("MCP Server Integration", () => {
  const MCP_URL = "http://localhost:8787/mcp";
  
  it("should list available tools", async () => {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/list",
        id: 1
      })
    });
    
    const data = await response.json();
    expect(data.result.tools).toBeInstanceOf(Array);
    expect(data.result.tools.length).toBeGreaterThan(0);
  });
});
```

---

## Best Practices

### 1. Tool Design
- ✅ Keep tools focused and single-purpose
- ✅ Use clear, descriptive names (`search_items` not `search`)
- ✅ Write detailed descriptions that explain when to use the tool
- ✅ Validate all inputs thoroughly
- ✅ Return helpful error messages

### 2. Widget Design
- ✅ Keep widgets lightweight and fast
- ✅ Use optimistic updates for better UX
- ✅ Handle loading and error states
- ✅ Make interactive elements obvious
- ✅ Test across different screen sizes

### 3. Performance
- ✅ Cache expensive operations
- ✅ Use streaming for large responses
- ✅ Implement timeouts for external APIs
- ✅ Monitor server performance
- ✅ Optimize widget rendering

### 4. Security
- ✅ Validate all inputs (never trust client data)
- ✅ Sanitize HTML in widgets
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Log security-relevant events

### 5. Error Handling
- ✅ Provide user-friendly error messages
- ✅ Log errors for debugging
- ✅ Gracefully degrade when services are unavailable
- ✅ Never expose sensitive data in error messages
- ✅ Offer recovery actions when possible

---

## Deployment

### Environment Variables

```javascript
const config = {
  port: process.env.PORT ?? 8787,
  mcpPath: process.env.MCP_PATH ?? "/mcp",
  apiKey: process.env.API_KEY,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV ?? "development"
};
```

### Production Checklist

- [ ] Use HTTPS (required for ChatGPT)
- [ ] Set proper CORS headers
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Monitor error rates
- [ ] Set up health checks
- [ ] Configure timeouts
- [ ] Use environment variables for secrets
- [ ] Enable compression
- [ ] Implement graceful shutdown

---

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Apps SDK Examples](https://github.com/openai/chatgpt-apps)
- [OpenAI Developer Docs](https://developers.openai.com/docs/chatgpt-apps)

---

This guide provides the technical foundation for building MCP servers. Combine it with the UX and design guides to create exceptional ChatGPT apps.

