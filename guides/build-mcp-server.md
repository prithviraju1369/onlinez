# Build Your MCP Server

> **Source:** [OpenAI Apps SDK - Build Your MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server)  
> Wire tools, templates, and the widget runtime that powers ChatGPT Apps

## Overview

By the end of this guide, you'll know how to:
- Connect your backend MCP server to ChatGPT
- Define tools with proper schemas and metadata
- Register UI templates
- Return structured data and metadata
- Use the widget runtime effectively

### What an MCP Server Does for Your App

ChatGPT Apps have **three components**:

1. **Your MCP server** - Defines tools, enforces auth, returns data, points each tool to a UI bundle
2. **The widget/UI bundle** - Renders inside ChatGPT's iframe, reads data via `window.openai`
3. **The model** - Decides when to call tools, narrates the experience

**Key Principle:** You build the MCP server and define the tools, but ChatGPT's model chooses when to call them based on the metadata you provide.

---

## Before You Begin

### Prerequisites

- ✅ Comfortable with TypeScript or Python
- ✅ Web bundler experience (Vite, esbuild, etc.)
- ✅ MCP server reachable over HTTP (local is fine to start)
- ✅ Built UI bundle that exports a root script

### Example Project Layout

```
your-chatgpt-app/
├─ server/
│  └─ src/index.ts          # MCP server + tool handlers
├─ web/
│  ├─ src/component.tsx     # React widget
│  └─ dist/app.{js,css}     # Bundled assets
└─ package.json
```

---

## Architecture Flow

Understanding the flow helps you design better tools and widgets.

### The Complete Flow

```
1. User prompt
   ↓
2. ChatGPT model decides to call your tool
   ↓
3. MCP tool call → Your server
   ↓
4. Your server:
   - Runs handler
   - Fetches authoritative data
   - Returns structuredContent, _meta, content
   ↓
5. ChatGPT loads HTML template (text/html+skybridge)
   ↓
6. Widget renders from window.openai.toolOutput
   ↓
7. Widget can:
   - Persist UI state with setWidgetState
   - Call tools again via callTool
   ↓
8. Model reads structuredContent to narrate
```

### Flow Diagram

```
User prompt
   ↓
ChatGPT model ──► MCP tool call ──► Your server ──► Tool response
   │                                                   │
   │                                                   ├─ structuredContent (model sees)
   │                                                   ├─ _meta (widget only)
   │                                                   └─ content (narration)
   │                                                   │
   └───── renders narration ◄──── widget iframe ◄──────┘
                              (HTML template + window.openai)
```

### Important Design Principles

**Idempotency:** The model may retry tool calls, so design handlers to be idempotent.

**Clean Boundaries:** Keep model data, widget data, and narration separate so you can iterate independently.

---

## Understanding `window.openai` Widget Runtime

The sandboxed iframe exposes a single global object with these capabilities:

### State & Data

| Property | Type | Purpose |
|----------|------|---------|
| `toolInput` | Object | Arguments supplied when the tool was invoked |
| `toolOutput` | Object | Your `structuredContent` - keep fields concise |
| `toolResponseMetadata` | Object | The `_meta` payload - only widget sees it |
| `widgetState` | Object | Snapshot of UI state persisted between renders |
| `setWidgetState(state)` | Function | Stores new snapshot synchronously |

### Widget Runtime APIs

| Method | Purpose |
|--------|---------|
| `callTool(name, args)` | Invoke another MCP tool from the widget |
| `sendFollowUpMessage({ prompt })` | Ask ChatGPT to post a message |
| `requestDisplayMode(mode)` | Request PiP/fullscreen modes |
| `requestModal(config)` | Spawn a modal owned by ChatGPT |
| `notifyIntrinsicHeight(height)` | Report dynamic widget heights |
| `openExternal({ href })` | Open vetted external link in browser |

### Context Signals

| Property | Type | Purpose |
|----------|------|---------|
| `theme` | string | "light" or "dark" |
| `displayMode` | string | "inline", "fullscreen", "pip" |
| `maxHeight` | number | Maximum height available |
| `safeArea` | Object | Safe area insets |
| `view` | string | Current view mode |
| `userAgent` | string | User agent string |
| `locale` | string | User's locale (e.g., "en-US") |

### Example: Reading Data

```javascript
// Access tool output
const data = window.openai?.toolOutput;
const metadata = window.openai?.toolResponseMetadata;

// Read context
const theme = window.openai?.theme; // "light" or "dark"
const locale = window.openai?.locale; // "en-US"
```

### Example: Persisting State

```javascript
// Read current state
const currentState = window.openai?.widgetState;

// Update state
window.openai?.setWidgetState({
  selectedItemId: "item_123",
  filters: { status: "open" },
  viewMode: "grid"
});
```

### Example: Calling Tools

```javascript
// Call another tool
const response = await window.openai.callTool("get_details", {
  id: selectedId
});

// Response contains structuredContent
if (response?.structuredContent) {
  updateUI(response.structuredContent);
}
```

### Example: Requesting Modal

```javascript
// Use requestModal for overlays
window.openai.requestModal({
  title: "Checkout",
  component: CheckoutForm,
  onClose: () => console.log("Modal closed")
});
```

**When to use modals:** When you need a host-controlled overlay (e.g., checkout, detail view) anchored to a button, so users can review options without forcing the inline widget to resize.

---

## Step-by-Step Implementation

### Step 1: Set Up the MCP Server

#### TypeScript Example

```typescript
import { createServer } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({ 
  name: "my-app", 
  version: "1.0.0" 
});

const port = process.env.PORT ?? 8787;
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // CORS preflight
  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id"
    });
    res.end();
    return;
  }
  
  // MCP requests
  if (url.pathname === MCP_PATH) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,  // Stateless
      enableJsonResponse: true
    });
    
    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }
  
  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`MCP server running on http://localhost:${port}${MCP_PATH}`);
});
```

#### Python Example

```python
from mcp.server import MCPServer
from mcp.server.transports import StreamableHTTPServerTransport

server = MCPServer(name="my-app", version="1.0.0")

# See MCP Python SDK docs for full setup
```

---

### Step 2: Register UI Templates (Resources)

Templates are HTML files that get loaded in the ChatGPT iframe.

```typescript
import { readFileSync } from "node:fs";

// Read your built widget HTML
const widgetHtml = readFileSync("./dist/widget.html", "utf8");

server.registerResource(
  "my-widget",                    // Resource name
  "ui://widget/my-widget.html",   // Resource URI
  {},                             // Options
  async () => ({
    contents: [{
      uri: "ui://widget/my-widget.html",
      mimeType: "text/html+skybridge",  // REQUIRED for widgets
      text: widgetHtml,
      _meta: {
        "openai/widgetPrefersBorder": true,
        "openai/widgetCSP": {
          connect_domains: ["https://api.example.com"],
          resource_domains: ["https://cdn.example.com"]
        }
      }
    }]
  })
);
```

#### Widget Template Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>My Widget</title>
  <style>
    /* Your styles */
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="module">
    // Access data from window.openai
    const data = window.openai?.toolOutput;
    const root = document.getElementById("root");
    
    // Render
    root.innerHTML = `<h2>${data.title}</h2>`;
  </script>
</body>
</html>
```

---

### Step 3: Register Tools

Tools are the capabilities your app exposes to ChatGPT.

```typescript
import { z } from "zod";

server.registerTool(
  "search_items",  // Tool name
  {
    title: "Search Items",
    description: "Search for items by keyword. Use when user wants to find items in the catalog.",
    
    // Input schema (Zod)
    inputSchema: {
      query: z.string().min(1),
      limit: z.number().int().positive().max(50).default(10)
    },
    
    // Metadata
    _meta: {
      // Which widget to render
      "openai/outputTemplate": "ui://widget/my-widget.html",
      
      // Loading/success messages
      "openai/toolInvocation/invoking": "Searching...",
      "openai/toolInvocation/invoked": "Search complete",
      
      // Widget can call this tool
      "openai/widgetAccessible": true,
      
      // Visibility: "public" (default) or "private"
      "openai/visibility": "public"
    }
  },
  
  // Tool handler
  async (args) => {
    const results = await performSearch(args.query, args.limit);
    
    return {
      // For the model AND widget
      structuredContent: {
        results: results.map(r => ({
          id: r.id,
          title: r.title,
          price: r.price
        })),
        total: results.length
      },
      
      // Optional narration for the model
      content: [{
        type: "text",
        text: `Found ${results.length} items matching "${args.query}"`
      }],
      
      // Extra data ONLY for widget
      _meta: {
        fullResults: results,  // Includes images, descriptions, etc.
        timestamp: new Date().toISOString()
      }
    };
  }
);
```

---

### Step 4: Return Structured Data and Metadata

Every tool response can include **three sibling payloads**:

#### 1. `structuredContent` (Model + Widget)

**Purpose:** Concise JSON the model reads AND the widget uses

**Include:**
- Essential data only
- Machine-readable IDs
- Timestamps
- Status/state
- Counts/totals

**Example:**
```typescript
structuredContent: {
  tasks: [
    {
      id: "task_123",
      title: "Fix bug",
      status: "in_progress",
      priority: "high",
      created: "2025-11-29T10:00:00Z"
    }
  ],
  total: 1,
  filters: { status: "in_progress" }
}
```

#### 2. `content` (Model Only)

**Purpose:** Optional narration for the model's response

**Include:**
- Human-readable text
- Markdown formatting
- Explanations
- Follow-up suggestions

**Example:**
```typescript
content: [{
  type: "text",
  text: "Here's the latest snapshot. Drag cards in the widget to update status."
}]
```

#### 3. `_meta` (Widget Only)

**Purpose:** Large or sensitive data exclusively for the widget

**Include:**
- Full object details
- Images, binary data
- Internal state
- Computed values
- Anything the model shouldn't see

**Example:**
```typescript
_meta: {
  tasksById: {
    "task_123": {
      id: "task_123",
      title: "Fix bug",
      description: "Long description...",
      comments: [...],
      attachments: [...],
      history: [...]
    }
  },
  lastSyncedAt: "2025-11-29T10:30:00Z",
  userPermissions: ["read", "write"]
}
```

### Complete Example

```typescript
async function loadKanbanBoard(workspace: string) {
  const tasks = await db.fetchTasks(workspace);
  
  return {
    // Model sees this (keep it concise)
    structuredContent: {
      columns: ["todo", "in-progress", "done"].map(status => ({
        id: status,
        title: status.replace("-", " "),
        tasks: tasks
          .filter(task => task.status === status)
          .slice(0, 5)  // Limit for model
          .map(task => ({
            id: task.id,
            title: task.title,
            priority: task.priority
          }))
      }))
    },
    
    // Model narration
    content: [{
      type: "text",
      text: "Here's the latest snapshot. Drag cards to update status."
    }],
    
    // Widget-only data (full details)
    _meta: {
      tasksById: Object.fromEntries(
        tasks.map(task => [task.id, task])
      ),
      lastSyncedAt: new Date().toISOString(),
      userPermissions: ["read", "write", "delete"]
    }
  };
}
```

---

## Step 5: Run Locally

### 1. Build Your UI Bundle

```bash
cd web
npm run build  # Creates dist/app.js, dist/app.css
```

### 2. Start the MCP Server

```bash
cd server
npm run build
node dist/index.js
```

You should see:
```
MCP server running on http://localhost:8787/mcp
```

### 3. Test with MCP Inspector

**MCP Inspector** mirrors ChatGPT's widget runtime and catches issues early.

```bash
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

This opens a browser window where you can:
- List all tools
- Call tools with test inputs
- See the widget render
- Debug `window.openai` values

---

## Step 6: Expose an HTTPS Endpoint

ChatGPT requires **HTTPS**. During development, tunnel localhost.

### Using ngrok

```bash
ngrok http 8787
```

Output:
```
Forwarding: https://abc123.ngrok.app -> http://127.0.0.1:8787
```

Use `https://abc123.ngrok.app/mcp` when creating a connector in ChatGPT developer mode.

### Production Deployment

Deploy to a low-latency HTTPS host:
- Cloudflare Workers
- Fly.io
- Vercel
- Railway
- AWS Lambda
- Google Cloud Run

---

## Complete Example

### Minimal Server + Widget

```typescript
// server/src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({ name: "hello-world", version: "1.0.0" });

// Register UI template
server.registerResource(
  "hello",
  "ui://widget/hello.html",
  {},
  async () => ({
    contents: [{
      uri: "ui://widget/hello.html",
      mimeType: "text/html+skybridge",
      text: `
<!DOCTYPE html>
<html>
<head><title>Hello</title></head>
<body>
  <div id="root"></div>
  <script type="module">
    const { message } = window.openai?.toolOutput ?? { message: "Hi!" };
    document.getElementById("root").textContent = message;
  </script>
</body>
</html>
      `.trim()
    }]
  })
);

// Register tool
server.registerTool(
  "hello_widget",
  {
    title: "Show hello widget",
    inputSchema: { name: { type: "string" } },
    _meta: { "openai/outputTemplate": "ui://widget/hello.html" }
  },
  async ({ name }) => ({
    structuredContent: { message: `Hello ${name}!` },
    content: [{ type: "text", text: `Greeting ${name}` }],
    _meta: {}
  })
);

// Start server (HTTP setup omitted for brevity - see Step 1)
```

---

## Advanced Capabilities

### Component-Initiated Tool Calls

Allow widgets to call tools directly:

```typescript
{
  _meta: {
    "openai/outputTemplate": "ui://widget/my-widget.html",
    "openai/widgetAccessible": true  // Enable callTool from widget
  }
}
```

Then in widget:
```javascript
await window.openai.callTool("refresh_data", { id: itemId });
```

### Private Tools

Hide tools from the model but allow widget to call them:

```typescript
{
  _meta: {
    "openai/widgetAccessible": true,
    "openai/visibility": "private"  // Model can't see or call this
  }
}
```

### Content Security Policy (CSP)

Required before broad distribution:

```typescript
{
  _meta: {
    "openai/widgetCSP": {
      connect_domains: ["https://api.example.com"],
      resource_domains: ["https://cdn.example.com", "https://persistent.oaistatic.com"]
    }
  }
}
```

### Widget Domain

Get a dedicated origin for API allowlisting:

```typescript
{
  _meta: {
    "openai/widgetDomain": "myapp",  // Renders at myapp.web-sandbox.oaiusercontent.com
    "openai/widgetCSP": { /* ... */ }
  }
}
```

### Widget Description

Let the widget describe itself to reduce redundant text:

```typescript
{
  _meta: {
    "openai/widgetDescription": "Shows an interactive zoo directory rendered by get_zoo_animals."
  }
}
```

### Localized Content

ChatGPT sends the requested locale:

```typescript
// In your tool handler
async (args, context) => {
  const locale = context._meta?.["openai/locale"] || "en-US";
  
  // Format based on locale
  const formatted = new Intl.NumberFormat(locale).format(price);
  
  return {
    structuredContent: { price: formatted },
    _meta: { locale }  // Echo back
  };
}
```

### Client Context Hints

ChatGPT may send hints like `userAgent` and `userLocation`:

```typescript
async (args, context) => {
  const userAgent = context._meta?.["openai/userAgent"];
  const userLocation = context._meta?.["openai/userLocation"];
  
  // Use for analytics or formatting
  // NEVER rely on these for authorization!
  
  return { /* ... */ };
}
```

---

## Troubleshooting

### Widget Doesn't Render

**Problem:** Widget shows blank or doesn't load

**Solutions:**
- ✅ Ensure `mimeType: "text/html+skybridge"`
- ✅ Check bundled JS/CSS URLs resolve
- ✅ Verify no CSP violations in browser console
- ✅ Test with MCP Inspector first

### `window.openai` is Undefined

**Problem:** Widget can't access runtime

**Solutions:**
- ✅ Confirm MIME type is `text/html+skybridge`
- ✅ Check CSP settings
- ✅ Ensure script loads after iframe is ready

### CSP or CORS Failures

**Problem:** Requests blocked

**Solutions:**
- ✅ Set `openai/widgetCSP` with exact domains
- ✅ Check CORS headers on your APIs
- ✅ Use `connect_domains` for API calls
- ✅ Use `resource_domains` for static assets

### Stale Bundles Keep Loading

**Problem:** Changes don't appear

**Solutions:**
- ✅ Cache-bust template URIs (add version param)
- ✅ Change file names on breaking changes
- ✅ Clear browser cache
- ✅ Restart MCP server

### Structured Payloads Are Huge

**Problem:** Slow rendering, poor model performance

**Solutions:**
- ✅ Trim `structuredContent` to essentials
- ✅ Move large data to `_meta`
- ✅ Paginate results
- ✅ Use IDs instead of full objects

---

## Security Reminders

### Never Expose Secrets

- ❌ **DON'T** put API keys, tokens, or secrets in:
  - `structuredContent`
  - `_meta`
  - `content`
  - Widget state

- ✅ **DO** enforce auth in your MCP server and backing APIs

### Don't Trust Client Hints

- ❌ **DON'T** use for authorization:
  - `userAgent`
  - `locale`
  - `userLocation`

- ✅ **DO** verify identity and permissions server-side

### Avoid Exposing Admin Tools

- ❌ **DON'T** expose destructive tools without:
  - Caller identity verification
  - Intent confirmation
  - Permission checks

- ✅ **DO** use `visibility: "private"` for sensitive tools

---

## Next Steps

Once your MCP server is working:

1. **Build your UI** with [Build ChatGPT UI Guide](./build-chatgpt-ui.md)
2. **Add authentication** with [Authentication Guide](./build-authentication.md)
3. **Manage state** with [State Management Guide](./build-state-management.md)
4. **See examples** in [Examples Guide](./build-examples.md)

---

## Additional Resources

- [MCP Server Guide](./mcp-server-guide.md) - Deeper technical dive
- [Planning Tools](./planning-tools.md) - How to design tools
- [Implementation Examples](./implementation-examples.md) - Code patterns
- [Apps SDK Reference](https://developers.openai.com/docs/chatgpt-apps/reference)

---

**Remember:** The fastest way to refine your app is to use ChatGPT itself. Call your tools in a real conversation, watch your logs, and debug the widget with browser devtools!

