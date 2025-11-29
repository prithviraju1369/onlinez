# Troubleshooting ChatGPT Apps

> **Source:** [OpenAI Apps SDK - Troubleshooting](https://developers.openai.com/apps-sdk/deploy/troubleshooting)  
> Troubleshoot issues in Apps SDK apps

## How to Triage Issues

When something goes wrong, **isolate which layer is responsible:**

```
┌─────────────────┐
│  ChatGPT Client │ ← User interface, display issues
├─────────────────┤
│  Component/UI   │ ← Widget rendering, interactions
├─────────────────┤
│  MCP Server     │ ← Tool handlers, data processing
├─────────────────┤
│  Backend APIs   │ ← Database, external services
└─────────────────┘
```

Use the checklists below to **quickly identify and resolve** common problems.

---

## Server-Side Issues

### No Tools Listed

**Symptoms:**
- Connector creates but shows no tools
- "No tools found" message
- Empty tool list in MCP Inspector

**Possible Causes:**
1. Server not running
2. Wrong endpoint URL
3. Tools not registered
4. Server crashed on startup

**Solutions:**

**1. Verify server is running:**
```bash
# Check if process is running
ps aux | grep node

# Check server logs
npm run logs

# Try starting manually
npm run dev
```

**2. Confirm endpoint is accessible:**
```bash
# Test the /mcp endpoint
curl https://your-app.com/mcp

# Should return some response (not 404)
```

**3. Check tool registration:**
```typescript
// Ensure tools are actually registered
server.registerTool('my_tool', { /* ... */ }, async () => {
  // Handler
});

// Add logging
console.log('Registered tools:', server.listTools());
```

**4. Check for startup errors:**
```bash
# Watch server logs during startup
npm run dev 2>&1 | tee startup.log
```

**5. Update connector URL:**
- Go to Settings → Connectors
- Verify URL includes `/mcp`
- Click "Refresh"

### Structured Content Only, No Component

**Symptoms:**
- Tool works, returns data
- No widget renders
- Only text response appears

**Possible Causes:**
1. Missing `outputTemplate` in tool metadata
2. Resource not registered
3. Wrong MIME type
4. CSP blocking widget

**Solutions:**

**1. Verify outputTemplate is set:**
```typescript
server.registerTool('my_tool', {
  _meta: {
    "openai/outputTemplate": "ui://widget/my-widget.html"  // Must be set!
  }
}, /* ... */);
```

**2. Ensure resource is registered:**
```typescript
server.registerResource(
  "my-widget",
  "ui://widget/my-widget.html",
  {},
  async () => ({
    contents: [{
      uri: "ui://widget/my-widget.html",
      mimeType: "text/html+skybridge",  // Must be this exact MIME type!
      text: widgetHtml
    }]
  })
);
```

**3. Check MIME type is exact:**
```typescript
// ❌ Wrong
mimeType: "text/html"

// ✅ Correct
mimeType: "text/html+skybridge"
```

**4. Check browser console for CSP errors:**
```
Open DevTools → Console
Look for: "Content Security Policy" errors
```

**5. Test with MCP Inspector:**
```bash
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

### Schema Mismatch Errors

**Symptoms:**
- "Schema validation failed"
- Type errors in logs
- Tool call fails

**Possible Causes:**
1. TypeScript/Zod types don't match
2. Output doesn't match declared schema
3. Required fields missing

**Solutions:**

**1. Ensure schemas match:**
```typescript
// Input schema
inputSchema: {
  query: z.string().min(1),
  limit: z.number().int().positive()
}

// Handler must match
async (args: { query: string; limit: number }) => {
  // TypeScript ensures type safety
}
```

**2. Validate output matches schema:**
```typescript
// Declared output schema
outputSchema: {
  results: z.array(z.object({
    id: z.string(),
    title: z.string()
  }))
}

// Handler must return matching structure
return {
  structuredContent: {
    results: [  // Must be array
      {
        id: "item_1",  // Must have id (string)
        title: "Title"  // Must have title (string)
      }
    ]
  }
};
```

**3. Regenerate types after schema changes:**
```bash
npm run build
```

**4. Add runtime validation:**
```typescript
const responseSchema = z.object({
  results: z.array(z.object({
    id: z.string(),
    title: z.string()
  }))
});

// Validate before returning
const validated = responseSchema.parse(data);
return { structuredContent: validated };
```

### Slow Responses

**Symptoms:**
- Widget feels sluggish
- Long loading times
- Timeouts

**Possible Causes:**
1. Slow backend API calls
2. No caching
3. Large data transfers
4. N+1 query problems

**Solutions:**

**1. Profile backend calls:**
```typescript
const start = Date.now();
const data = await fetchData();
console.log(`Fetch took: ${Date.now() - start}ms`);
```

**2. Add caching:**
```typescript
const cache = new Map();

async function getCachedData(key: string) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchData(key);
  cache.set(key, data);
  
  // Expire after 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
  
  return data;
}
```

**3. Reduce data transfer:**
```typescript
// ❌ Sending too much
structuredContent: {
  items: allItems  // 1000+ items
}

// ✅ Send only what's needed
structuredContent: {
  items: allItems.slice(0, 10),  // First 10
  total: allItems.length,
  hasMore: allItems.length > 10
}
```

**4. Optimize database queries:**
```typescript
// ❌ N+1 query problem
for (const item of items) {
  item.author = await db.getUser(item.authorId);
}

// ✅ Batch query
const authorIds = items.map(i => i.authorId);
const authors = await db.getUsers(authorIds);
const authorsById = Object.fromEntries(authors.map(a => [a.id, a]));
items.forEach(item => {
  item.author = authorsById[item.authorId];
});
```

**5. Set reasonable timeouts:**
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
  return await response.json();
} finally {
  clearTimeout(timeout);
}
```

---

## Widget Issues

### Widget Fails to Load

**Symptoms:**
- Blank widget area
- "Failed to load" message
- JavaScript errors

**Possible Causes:**
1. CSP violations
2. Missing bundles
3. JavaScript errors
4. Network issues

**Solutions:**

**1. Open browser console:**
```
Right-click → Inspect → Console tab
Look for errors
```

**2. Check for CSP violations:**
```
Console error: "Refused to load..."
→ Add domain to widgetCSP
```

```typescript
_meta: {
  "openai/widgetCSP": {
    connect_domains: ["https://api.example.com"],
    resource_domains: ["https://cdn.example.com"]
  }
}
```

**3. Verify bundles are accessible:**
```html
<!-- In your widget HTML -->
<script src="https://cdn.example.com/widget.js"></script>

<!-- Test URL directly -->
<!-- Open https://cdn.example.com/widget.js in browser -->
```

**4. Check for JavaScript errors:**
```javascript
// Add error boundary
window.addEventListener('error', (e) => {
  console.error('Widget error:', e.error);
});

// Log widget initialization
console.log('Widget initializing...');
console.log('window.openai available:', !!window.openai);
```

**5. Test with MCP Inspector:**
```bash
# Inspector mirrors ChatGPT's widget runtime
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

### Drag-and-Drop or Editing Doesn't Persist

**Symptoms:**
- User makes changes
- Changes disappear on refresh
- State resets unexpectedly

**Possible Causes:**
1. Not calling `setWidgetState`
2. Not reading from `widgetState` on mount
3. State not properly structured

**Solutions:**

**1. Call setWidgetState after updates:**
```javascript
function handleUpdate(newData) {
  // Update local state
  setData(newData);
  
  // Persist to widget state
  window.openai.setWidgetState({
    data: newData,
    lastUpdated: Date.now()
  });
}
```

**2. Read widgetState on mount:**
```javascript
// On component mount
const savedState = window.openai?.widgetState;
if (saved State?.data) {
  setData(savedState.data);
}
```

**3. Structure state properly:**
```javascript
// ❌ Bad - storing functions, DOM refs
window.openai.setWidgetState({
  callback: () => {},  // Can't serialize
  ref: document.getElementById('el')  // Can't serialize
});

// ✅ Good - plain data only
window.openai.setWidgetState({
  selectedIds: ['id1', 'id2'],
  filters: { status: 'open' },
  viewMode: 'list'
});
```

**4. Handle state merge correctly:**
```javascript
// Merge with existing state
const currentState = window.openai?.widgetState || {};
window.openai.setWidgetState({
  ...currentState,
  newField: newValue
});
```

### Layout Problems on Mobile

**Symptoms:**
- Widget doesn't fit screen
- Text too small
- Buttons not tappable
- Horizontal scrolling issues

**Possible Causes:**
1. Fixed widths
2. Small touch targets
3. Not responsive
4. Ignoring displayMode

**Solutions:**

**1. Use responsive units:**
```css
/* ❌ Fixed widths */
.widget {
  width: 800px;
}

/* ✅ Responsive */
.widget {
  width: 100%;
  max-width: 800px;
}
```

**2. Ensure touch targets are large enough:**
```css
button, a {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}
```

**3. Add responsive breakpoints:**
```css
/* Mobile first */
.card {
  padding: 12px;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 640px) {
  .card {
    padding: 16px;
    font-size: 16px;
  }
}
```

**4. Check displayMode:**
```javascript
const displayMode = window.openai?.displayMode;
const maxHeight = window.openai?.maxHeight;

if (displayMode === 'inline') {
  // Adjust layout for inline mode
  setCompactView(true);
}

if (maxHeight && maxHeight < 500) {
  // Limited height, adjust accordingly
  setScrollable(true);
}
```

**5. Test on actual devices:**
```
- Test on iPhone (Safari)
- Test on Android (Chrome)
- Test in ChatGPT mobile apps
```

---

## Discovery and Entry-Point Issues

### Tool Never Triggers

**Symptoms:**
- Relevant prompts don't activate tool
- Tool works in Inspector but not ChatGPT
- Low recall

**Possible Causes:**
1. Poor tool description
2. Missing keywords
3. Another tool intercepting
4. Connector not enabled

**Solutions:**

**1. Improve tool description:**
```typescript
// ❌ Vague
description: "Searches tickets"

// ✅ Specific
description: "Use this when user wants to search for Jira tickets by keyword, status, assignee, or priority. Examples: 'show my tickets', 'find urgent bugs', 'what am I working on'. Do not use for creating or updating tickets."
```

**2. Add "Use this when..." phrasing:**
```typescript
description: "Use this when user wants to [action]. Returns [what]. Do not use for [excluded cases]."
```

**3. Check if another tool is interfering:**
```
Test in ChatGPT with only your connector enabled
If it works → another tool is intercepting
If it doesn't → improve your metadata
```

**4. Ensure connector is enabled:**
```
1. Open chat
2. Click + → More
3. Verify your connector is checked
```

**5. Test with golden prompts:**
- See [Optimize Metadata Guide](./optimize-metadata.md)

### Wrong Tool Selected

**Symptoms:**
- Different tool than expected triggers
- Incorrect arguments passed
- User rejections frequent

**Possible Causes:**
1. Overlapping descriptions
2. Ambiguous tool names
3. Missing constraints

**Solutions:**

**1. Add "Do NOT use for..." section:**
```typescript
description: `Use this when user wants to search tickets.

Do NOT use for:
- Creating tickets (use create_ticket)
- Updating tickets (use update_ticket)
- Deleting tickets (use delete_ticket)`
```

**2. Make tool names more specific:**
```typescript
// ❌ Ambiguous
"search"  // Search what?
"update"  // Update what?

// ✅ Specific
"search_tickets"
"update_ticket_status"
```

**3. Split large tools:**
```typescript
// ❌ One tool does everything
"manage_tickets"  // Create, read, update, delete

// ✅ Separate tools
"search_tickets"  // Read only
"create_ticket"  // Write
"update_ticket"  // Write
"delete_ticket"  // Write
```

**4. Review similar tools:**
```
If you have:
- search_tickets
- list_tickets

Are they different enough?
Consider merging or clarifying differences.
```

### Launcher Ranking Feels Off

**Symptoms:**
- App not appearing in suggestions
- Other apps ranked higher

**Solutions:**

**1. Refresh directory metadata:**
```
Settings → Connectors → [Your Connector] → Refresh
```

**2. Ensure app icon is high quality:**
```
- 512x512px PNG
- Clear, recognizable
- Good contrast
```

**3. Update connector description:**
```
Make it match what users expect
Include key use cases
Use clear language
```

---

## Authentication Problems

### 401 Errors

**Symptoms:**
- "Unauthorized" errors
- Auth loop (keeps asking to log in)
- Token rejected

**Possible Causes:**
1. Missing WWW-Authenticate header
2. Invalid token
3. Expired token
4. Wrong audience/issuer

**Solutions:**

**1. Include WWW-Authenticate header:**
```typescript
if (!isValidToken(token)) {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Bearer realm="ChatGPT App"'
    }
  });
}
```

**2. Validate token properly:**
```typescript
try {
  const decoded = jwt.verify(token, publicKey);
  
  // Check expiration
  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }
  
  // Check issuer
  if (decoded.iss !== EXPECTED_ISSUER) {
    throw new Error('Invalid issuer');
  }
  
  // Check audience
  if (decoded.aud !== EXPECTED_AUDIENCE) {
    throw new Error('Invalid audience');
  }
  
  return decoded;
} catch (error) {
  throw new UnauthorizedError(error.message);
}
```

**3. Implement token refresh:**
```typescript
if (isTokenExpired(accessToken)) {
  accessToken = await refreshAccessToken(refreshToken);
}
```

**4. Double-check OAuth configuration:**
```
- Authorization endpoint correct?
- Token endpoint correct?
- Client ID correct?
- Client secret correct (if applicable)?
- Redirect URI matches?
```

### Dynamic Client Registration Fails

**Symptoms:**
- Can't complete OAuth flow
- "Registration failed" error

**Possible Causes:**
1. Registration endpoint missing
2. No login connection enabled
3. Invalid metadata

**Solutions:**

**1. Confirm registration endpoint exists:**
```typescript
// In your OAuth server config
{
  "authorization_endpoint": "https://auth.example.com/authorize",
  "token_endpoint": "https://auth.example.com/token",
  "registration_endpoint": "https://auth.example.com/register"  // Must be present
}
```

**2. Enable login connection for new clients:**
```
In your OAuth provider dashboard:
- Enable "Allow dynamic registration"
- Enable default login connection
- Set redirect URI allowlist
```

**3. Validate registration metadata:**
```typescript
// Registration request
{
  "client_name": "My ChatGPT App",
  "redirect_uris": ["https://chatgpt.com/..."],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "client_secret_basic"
}
```

---

## Deployment Problems

### Ngrok Tunnel Times Out

**Symptoms:**
- Connection works briefly then fails
- "Tunnel closed" error

**Possible Causes:**
1. Free ngrok session expired
2. Server crashed
3. Network issue

**Solutions:**

**1. Check ngrok status:**
```bash
# Visit http://127.0.0.1:4040
# Shows active connections and errors
```

**2. Restart tunnel:**
```bash
# Stop old tunnel (Ctrl+C)
# Start new tunnel
ngrok http 8787
```

**3. Use authenticated ngrok:**
```bash
# Sign up for free account
ngrok config add-authtoken YOUR_TOKEN

# Authenticated sessions last longer
ngrok http 8787
```

**4. Verify server is still running:**
```bash
ps aux | grep node
# If not running, restart server
```

**5. For production, use stable hosting:**
- Fly.io
- Render
- Railway
- Not ngrok

### Streaming Breaks Behind Proxies

**Symptoms:**
- Tool calls work but stream fails
- Partial responses
- Timeout errors

**Possible Causes:**
1. Proxy buffers responses
2. Load balancer doesn't support SSE
3. CDN interference

**Solutions:**

**1. Configure proxy to allow streaming:**

**Nginx:**
```nginx
location /mcp {
  proxy_pass http://backend;
  
  # Disable buffering for SSE
  proxy_buffering off;
  proxy_cache off;
  
  # Set headers
  proxy_set_header Connection '';
  proxy_http_version 1.1;
  chunked_transfer_encoding off;
}
```

**HAProxy:**
```
backend mcp_backend
  server mcp1 127.0.0.1:8787 check
  
  # Disable compression
  compression offload off
  
  # Set timeout
  timeout server 300s
```

**2. Use appropriate load balancer:**
- Application Load Balancer (AWS) ✅
- Network Load Balancer (AWS) ✅
- Google Cloud Load Balancer ✅
- Basic HTTP proxy ❌

**3. Bypass CDN for /mcp:**
```
CloudFlare: Add page rule to bypass cache for /mcp/*
Fastly: Configure backend to not cache /mcp
```

---

## When to Escalate

If you've validated the points above and the issue persists:

### Collect Information

**1. Logs:**
```bash
# Server logs
npm run logs > server-logs.txt

# Widget console logs
# Open DevTools → Console → Right-click → Save as...

# ChatGPT tool call transcript
# Copy from ChatGPT conversation
```

**2. Screenshots:**
- Widget (if rendering)
- Error messages
- Console errors
- Network tab (if relevant)

**3. Reproduction steps:**
```markdown
## Reproduction Steps

1. Open ChatGPT
2. Enable connector: [Your Connector Name]
3. Send prompt: "[Exact prompt]"
4. Expected: [What should happen]
5. Actual: [What actually happens]
6. Screenshot: [Attach screenshot]
```

**4. Environment details:**
```
- Server version: v1.2.3
- Node version: v18.17.0
- MCP SDK version: v1.20.2
- Browser: Chrome 119
- OS: macOS 14.1
- ChatGPT: Web/iOS/Android
```

### Share with OpenAI Partner

**Email template:**
```
Subject: [Your App Name] - [Issue Type]

Issue: [Brief description]

Environment:
- App version: v1.2.3
- Node: v18.17.0
- MCP SDK: v1.20.2

Reproduction:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected: [What should happen]
Actual: [What happens]

Logs: [Attached]
Screenshots: [Attached]

Attempts to resolve:
- [What you tried]
- [Results]

Request: [What you need help with]
```

**A crisp troubleshooting log shortens turnaround time** and keeps your connector reliable for users.

---

## Troubleshooting Checklist

### Quick Diagnostics

```markdown
## Pre-Escalation Checklist

### Server
- [ ] Server running
- [ ] /mcp endpoint accessible
- [ ] Tools registered
- [ ] No startup errors
- [ ] Logs show tool calls

### Widget
- [ ] Widget HTML valid
- [ ] MIME type correct (text/html+skybridge)
- [ ] No console errors
- [ ] CSP configured
- [ ] window.openai available

### Discovery
- [ ] Tool descriptions clear
- [ ] Connector enabled in chat
- [ ] Tested with golden prompts
- [ ] Metadata refreshed

### Auth
- [ ] OAuth configured correctly
- [ ] Tokens valid
- [ ] WWW-Authenticate header present
- [ ] Scopes enforced

### Deployment
- [ ] HTTPS working
- [ ] Streaming supported
- [ ] Health checks passing
- [ ] Monitoring active

### Attempted
- [ ] Tested in MCP Inspector
- [ ] Checked server logs
- [ ] Checked browser console
- [ ] Refreshed connector
- [ ] Restarted server
```

---

## Additional Resources

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Testing Guide](./deploy-testing.md)
- [Optimize Metadata](./optimize-metadata.md)
- [Security & Privacy](./security-privacy.md)

---

**Remember:** Most issues can be resolved by systematically checking each layer. Start with the checklist, isolate the problem, then apply the specific solution!

