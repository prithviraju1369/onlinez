# Apps SDK Quickstart

> **Source:** [OpenAI Apps SDK Quickstart](https://developers.openai.com/apps-sdk/quickstart)  
> Build and connect your first app to ChatGPT

## Introduction

The Apps SDK relies on the Model Context Protocol (MCP) to expose your app to ChatGPT. To build an app for ChatGPT with the Apps SDK, you need two things:

### 1. Web Component
A web component built with the framework of your choice. You are free to build your app as you see fit. This will be rendered in an iframe in the ChatGPT interface.

### 2. MCP Server
A Model Context Protocol (MCP) server that will expose your app and define your app's capabilities (tools) to ChatGPT.

---

## Example: To-Do List App

This quickstart builds a simple to-do list app contained in a single HTML file that keeps markup, CSS, and JavaScript together.

For more advanced examples using React, see the [examples repository on GitHub](https://github.com/openai/chatgpt-apps).

---

## Step 1: Build a Web Component

Create `public/todo-widget.html` in a new directory. This file will contain the web component rendered in the ChatGPT interface.

### Complete HTML Widget

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Todo list</title>
    <style>
      :root {
        color: #0b0b0f;
        font-family: "Inter", system-ui, -apple-system, sans-serif;
      }

      html, body {
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 16px;
        background: #f6f8fb;
      }

      main {
        width: 100%;
        max-width: 360px;
        min-height: 260px;
        margin: 0 auto;
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      }

      h2 {
        margin: 0 0 16px;
        font-size: 1.25rem;
      }

      form {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      form input {
        flex: 1;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid #cad3e0;
        font-size: 0.95rem;
      }

      form button {
        border: none;
        border-radius: 10px;
        background: #111bf5;
        color: white;
        font-weight: 600;
        padding: 0 16px;
        cursor: pointer;
      }

      input[type="checkbox"] {
        accent-color: #111bf5;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      li {
        background: #f2f4fb;
        border-radius: 12px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      li span {
        flex: 1;
      }

      li[data-completed="true"] span {
        text-decoration: line-through;
        color: #6c768a;
      }
    </style>
  </head>
  <body>
    <main>
      <h2>Todo list</h2>
      <form id="add-form" autocomplete="off">
        <input id="todo-input" name="title" placeholder="Add a task" />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list"></ul>
    </main>

    <script type="module">
      const listEl = document.querySelector("#todo-list");
      const formEl = document.querySelector("#add-form");
      const inputEl = document.querySelector("#todo-input");

      let tasks = [...(window.openai?.toolOutput?.tasks ?? [])];

      const render = () => {
        listEl.innerHTML = "";
        tasks.forEach((task) => {
          const li = document.createElement("li");
          li.dataset.id = task.id;
          li.dataset.completed = String(Boolean(task.completed));

          const label = document.createElement("label");
          label.style.display = "flex";
          label.style.alignItems = "center";
          label.style.gap = "10px";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = Boolean(task.completed);

          const span = document.createElement("span");
          span.textContent = task.title;

          label.appendChild(checkbox);
          label.appendChild(span);
          li.appendChild(label);
          listEl.appendChild(li);
        });
      };

      const updateFromResponse = (response) => {
        if (response?.structuredContent?.tasks) {
          tasks = response.structuredContent.tasks;
          render();
        }
      };

      const handleSetGlobals = (event) => {
        const globals = event.detail?.globals;
        if (!globals?.toolOutput?.tasks) return;
        tasks = globals.toolOutput.tasks;
        render();
      };

      window.addEventListener("openai:set_globals", handleSetGlobals, {
        passive: true,
      });

      const mutateTasksLocally = (name, payload) => {
        if (name === "add_todo") {
          tasks = [
            ...tasks,
            { id: crypto.randomUUID(), title: payload.title, completed: false },
          ];
        }

        if (name === "complete_todo") {
          tasks = tasks.map((task) =>
            task.id === payload.id ? { ...task, completed: true } : task
          );
        }

        if (name === "set_completed") {
          tasks = tasks.map((task) =>
            task.id === payload.id
              ? { ...task, completed: payload.completed }
              : task
          );
        }

        render();
      };

      const callTodoTool = async (name, payload) => {
        if (window.openai?.callTool) {
          mutateTasksLocally(name, payload);
          const response = await window.openai.callTool(name, payload);
          updateFromResponse(response);
        }
      };

      formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = inputEl.value.trim();
        if (!title) return;
        await callTodoTool("add_todo", { title });
        inputEl.value = "";
      });

      listEl.addEventListener("change", async (e) => {
        if (e.target.type === "checkbox") {
          const li = e.target.closest("li");
          const id = li?.dataset?.id;
          if (!id) return;
          await callTodoTool("complete_todo", { id });
        }
      });

      render();
    </script>
  </body>
</html>
```

### Key Features of the Widget

1. **Initial State from `window.openai.toolOutput`**
   ```javascript
   let tasks = [...(window.openai?.toolOutput?.tasks ?? [])];
   ```

2. **Listen for Updates**
   ```javascript
   window.addEventListener("openai:set_globals", handleSetGlobals, {
     passive: true,
   });
   ```

3. **Call Tools from the UI**
   ```javascript
   const response = await window.openai.callTool(name, payload);
   ```

4. **Optimistic Updates**
   - Mutate state locally immediately for responsive UI
   - Update from server response when it arrives

---

## Step 2: Create the MCP Server

Create `server.js` in your project root:

```javascript
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const todoHtml = readFileSync("public/todo-widget.html", "utf8");

const addTodoInputSchema = {
  title: z.string().min(1),
};

const completeTodoInputSchema = {
  id: z.string().min(1),
};

let todos = [];
let nextId = 1;

const replyWithTodos = (message) => ({
  content: message ? [{ type: "text", text: message }] : [],
  structuredContent: { tasks: todos },
});

function createTodoServer() {
  const server = new McpServer({ name: "todo-app", version: "0.1.0" });

  // Register the UI widget
  server.registerResource(
    "todo-widget",
    "ui://widget/todo.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/todo.html",
          mimeType: "text/html+skybridge",
          text: todoHtml,
          _meta: { "openai/widgetPrefersBorder": true },
        },
      ],
    })
  );

  // Register tool: add_todo
  server.registerTool(
    "add_todo",
    {
      title: "Add todo",
      description: "Creates a todo item with the given title.",
      inputSchema: addTodoInputSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/todo.html",
        "openai/toolInvocation/invoking": "Adding todo",
        "openai/toolInvocation/invoked": "Added todo",
      },
    },
    async (args) => {
      const title = args?.title?.trim?.() ?? "";
      if (!title) return replyWithTodos("Missing title.");
      const todo = { id: `todo-${nextId++}`, title, completed: false };
      todos = [...todos, todo];
      return replyWithTodos(`Added "${todo.title}".`);
    }
  );

  // Register tool: complete_todo
  server.registerTool(
    "complete_todo",
    {
      title: "Complete todo",
      description: "Marks a todo as done by id.",
      inputSchema: completeTodoInputSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/todo.html",
        "openai/toolInvocation/invoking": "Completing todo",
        "openai/toolInvocation/invoked": "Completed todo",
      },
    },
    async (args) => {
      const id = args?.id;
      if (!id) return replyWithTodos("Missing todo id.");
      const todo = todos.find((task) => task.id === id);
      if (!todo) {
        return replyWithTodos(`Todo ${id} was not found.`);
      }

      todos = todos.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      );

      return replyWithTodos(`Completed "${todo.title}".`);
    }
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain" }).end("Todo MCP server");
    return;
  }

  // Handle MCP requests
  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createTodoServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(
    `Todo MCP server listening on http://localhost:${port}${MCP_PATH}`
  );
});
```

### Key MCP Server Concepts

#### 1. Register Resources (UI Widgets)
```javascript
server.registerResource(
  "todo-widget",
  "ui://widget/todo.html",
  {},
  async () => ({
    contents: [{
      uri: "ui://widget/todo.html",
      mimeType: "text/html+skybridge",
      text: todoHtml,
      _meta: { "openai/widgetPrefersBorder": true }
    }]
  })
);
```

#### 2. Register Tools (Capabilities)
```javascript
server.registerTool(
  "add_todo",  // Tool name
  {
    title: "Add todo",
    description: "Creates a todo item with the given title.",
    inputSchema: addTodoInputSchema,  // Zod schema
    _meta: {
      "openai/outputTemplate": "ui://widget/todo.html",  // Which widget to render
      "openai/toolInvocation/invoking": "Adding todo",  // Loading message
      "openai/toolInvocation/invoked": "Added todo"     // Success message
    }
  },
  async (args) => {
    // Tool implementation
    return replyWithTodos(`Added "${todo.title}".`);
  }
);
```

#### 3. Return Structured Content
```javascript
const replyWithTodos = (message) => ({
  content: message ? [{ type: "text", text: message }] : [],
  structuredContent: { tasks: todos }  // Data for the widget
});
```

---

## Step 3: Set Up package.json

Create `package.json` with ES module support:

```json
{
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.20.2",
    "zod": "^3.25.76"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

Install dependencies:

```bash
npm install
```

---

## Step 4: Run Locally

### Start the Server

```bash
npm start
```

You should see:
```
Todo MCP server listening on http://localhost:8787/mcp
```

### Test with MCP Inspector

Use the MCP Inspector to test your server locally:

```bash
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

This opens a browser window where you can:
- View all registered tools
- Test tool calls
- Inspect responses
- Debug your MCP server

---

## Step 5: Expose to Public Internet

For ChatGPT to access your server during development, expose it to the public internet.

### Using ngrok

```bash
ngrok http 8787
```

You'll get a public URL like:
```
https://abc123.ngrok.app
```

Your MCP endpoint will be:
```
https://abc123.ngrok.app/mcp
```

### Alternative Tunneling Tools
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Tailscale Funnel](https://tailscale.com/kb/1223/tailscale-funnel/)
- [localtunnel](https://github.com/localtunnel/localtunnel)

---

## Step 6: Add Your App to ChatGPT

### Enable Developer Mode

1. Open ChatGPT
2. Go to **Settings → Apps & Connectors → Advanced settings**
3. Enable **Developer mode**

### Create a Connector

1. Go to **Settings → Connectors**
2. Click **Create**
3. Enter your HTTPS MCP URL (e.g., `https://abc123.ngrok.app/mcp`)
4. Name your connector (e.g., "Todo App")
5. Provide a short description (e.g., "Manage my todo list")
6. Click **Create**

### Test in a Conversation

1. Open a new chat
2. Click the **+** button
3. Select **More** from the menu
4. Choose your connector
5. Prompt the model: "Add a new task to read my book"

ChatGPT will:
- Call your `add_todo` tool
- Stream the response
- Render your widget
- Show the updated todo list

---

## Step 7: Iterate

### Refresh the Connector

After making changes to your MCP server:

1. Go to **Settings → Connectors**
2. Select your connector
3. Click **Refresh**

This updates:
- Tool definitions
- Tool metadata
- Widget templates

### No Refresh Needed For:
- Widget HTML/CSS/JavaScript changes
- Tool implementation logic (unless changing the response structure)

---

## Project Structure

```
my-todo-app/
├── public/
│   └── todo-widget.html    # UI widget
├── server.js               # MCP server
├── package.json           # Dependencies
└── README.md              # Documentation
```

---

## Common Issues & Solutions

### CORS Errors

**Problem:** ChatGPT can't connect to your server

**Solution:** Ensure CORS headers are set correctly:
```javascript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
```

### Widget Not Rendering

**Problem:** Widget shows blank or errors

**Solution:** Check:
- Widget is registered as a resource
- Tool metadata includes `"openai/outputTemplate"`
- MIME type is `"text/html+skybridge"`
- Widget HTML has no syntax errors

### Tool Not Being Called

**Problem:** ChatGPT doesn't use your tool

**Solution:** Improve tool metadata:
- Make description more specific
- Add examples in the description
- Use clear, action-oriented names
- Test different prompts

### State Not Persisting

**Problem:** Todos disappear after restart

**Solution:** 
- This quickstart uses in-memory storage
- Add a database for persistence (see guides)
- Or use ChatGPT's state management features

---

## Next Steps

### Read the Guidelines
- [App Developer Guidelines](https://developers.openai.com/docs/chatgpt-apps/developer-guidelines)
- [UX Principles](https://developers.openai.com/docs/chatgpt-apps/ux-principles)
- [UI Guidelines](https://developers.openai.com/docs/chatgpt-apps/ui-guidelines)

### Enhance Your App
- [Build ChatGPT UI](https://developers.openai.com/docs/chatgpt-apps/build-ui) - Use Apps SDK primitives
- [Authenticate Users](https://developers.openai.com/docs/chatgpt-apps/authenticate) - Add OAuth
- [Manage State](https://developers.openai.com/docs/chatgpt-apps/state) - Persist data
- [Examples](https://developers.openai.com/docs/chatgpt-apps/examples) - See more complex apps

### Deploy to Production
- [Deploy Your App](https://developers.openai.com/docs/chatgpt-apps/deploy)
- Use a proper hosting service (Vercel, Railway, Render, etc.)
- Add environment variables for configuration
- Set up logging and monitoring

### Advanced Topics
- Add more tools for richer functionality
- Implement authentication for user-specific data
- Use databases for persistence
- Add error handling and validation
- Optimize for performance

---

## Reference

### MCP Server API

```javascript
// Create server
const server = new McpServer({ name: "app-name", version: "1.0.0" });

// Register resource (UI widget)
server.registerResource(name, uri, options, handler);

// Register tool (capability)
server.registerTool(name, definition, handler);

// Connect to transport
await server.connect(transport);
```

### Widget API

```javascript
// Access initial data
window.openai.toolOutput

// Listen for updates
window.addEventListener("openai:set_globals", handler);

// Call tools from UI
await window.openai.callTool(name, payload);
```

### Tool Response Format

```javascript
{
  content: [{ type: "text", text: "Human-readable message" }],
  structuredContent: { /* Data for widget */ }
}
```

---

## Additional Resources

- [Apps SDK Reference](https://developers.openai.com/docs/chatgpt-apps/reference)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [GitHub Examples](https://github.com/openai/chatgpt-apps)
- [OpenAI Developer Forum](https://community.openai.com)

---

This quickstart gets you from zero to a working ChatGPT app in minutes. From here, explore the guides to build more sophisticated apps with better UX, authentication, and state management.

