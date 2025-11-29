# Connect from ChatGPT

> **Source:** [OpenAI Apps SDK - Connect from ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt)  
> Connect your app to ChatGPT clients

## Before You Begin

### Enable Developer Mode

You can test your app in ChatGPT with your account using **developer mode**.

> **Note:** Publishing your app for public access is not available at the moment, but OpenAI will accept submissions later this year. Learn more in the [App Developer Guidelines](https://developers.openai.com/docs/chatgpt-apps/developer-guidelines).

### Turn On Developer Mode

1. Navigate to **Settings → Apps & Connectors → Advanced settings** (bottom of the page)
2. Toggle **Developer mode** (if your organization allows it)
3. Once active, you'll see a **Create** button under **Settings → Apps & Connectors**

### Platform Availability

As of November 13th, 2025, ChatGPT Apps are supported on:
- ✅ All plans (Free, Plus, Team, Enterprise)
- ✅ Business plans
- ✅ Enterprise plans
- ✅ Education plans

---

## Create a Connector

### Prerequisites

- ✅ MCP server is deployed and reachable over HTTPS
- ✅ For local development: tunnel set up (ngrok, Cloudflare Tunnel, etc.)
- ✅ Connector metadata prepared (name, description)

### Step-by-Step

#### 1. Ensure HTTPS Endpoint

**Production:**
```
https://your-app.example.com/mcp
```

**Local development:**
```bash
ngrok http 8080
# Output: https://abc123.ngrok.app/mcp
```

#### 2. Open ChatGPT Settings

1. Open ChatGPT (web or desktop)
2. Click your profile → **Settings**
3. Navigate to **Apps & Connectors → Connectors**
4. Click **Create**

#### 3. Provide Connector Metadata

**Connector Name**
- User-facing title
- Be descriptive and clear
- Examples: "Jira Board", "Hotel Search", "Calendar Manager"

**Description**
- Explain what the connector does
- When to use it
- The model uses this during discovery

**Good descriptions:**
```
"Search and manage Jira tasks and projects. Use when user wants to view, create, or update Jira tickets."

"Search for hotels and book reservations. Use when user needs accommodation or wants to plan travel."

"Manage calendar events and availability. Use when user wants to schedule meetings or check their calendar."
```

**Bad descriptions:**
```
"A Jira connector"  // Too vague
"Does stuff with hotels"  // Not descriptive
"Calendar"  // No context about when to use
```

**Connector URL**
- Your public `/mcp` endpoint
- Must be HTTPS
- Include the `/mcp` path

**Examples:**
```
Production:
https://my-app.fly.dev/mcp
https://my-app.onrender.com/mcp
https://my-app.railway.app/mcp

Development:
https://abc123.ngrok.app/mcp
https://xyz.cloudflare-tunnel.com/mcp
```

#### 4. Click Create

**If successful:**
- ✅ Connection established
- ✅ You'll see a list of tools your server advertises
- ✅ Connector is ready to use

**If failed:**
- ❌ Check server is running and accessible
- ❌ Verify URL is correct (include `/mcp`)
- ❌ Ensure HTTPS is working
- ❌ Check server logs for errors
- ❌ Test with [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

---

## Try the App

### Add to Conversation

1. **Open a new chat** in ChatGPT
2. **Click the + button** near the message composer
3. **Click "More"**
4. **Choose your connector** from the list of available tools

This adds your app to the conversation context for the model to use.

### Test with Prompts

**Direct prompts** (mention your app explicitly):
```
"Show my Jira board"
"Search for hotels in Seattle"
"What's on my calendar today?"
```

**Indirect prompts** (intent-based):
```
"What am I blocked on for the launch?"
"Find me a place to stay in Chicago next week"
"Do I have any meetings this afternoon?"
```

### Tool Call Display

ChatGPT displays tool-call payloads in the UI so you can:
- ✅ Confirm inputs before execution
- ✅ Verify outputs after execution
- ✅ See structured data returned

### Write Tool Confirmations

**Write tools** (that modify data) require manual confirmation unless you choose to remember approvals for the conversation.

**Examples of write tools:**
- Create Jira ticket
- Book hotel
- Add calendar event
- Update status
- Delete item

---

## Refreshing Metadata

Whenever you change your tools list or descriptions, refresh your connector.

### When to Refresh

- ✅ Added or removed tools
- ✅ Changed tool descriptions
- ✅ Updated input schemas
- ✅ Modified tool metadata
- ✅ Changed widget templates

### How to Refresh

#### 1. Update and Redeploy Server

```bash
# Make changes to your code
git commit -am "Update tool descriptions"

# Deploy
npm run deploy  # or your deployment command

# For local: just restart
npm run dev
```

#### 2. Refresh in ChatGPT

1. Go to **Settings → Connectors**
2. Click into your connector
3. Click **Refresh**
4. Wait for confirmation

#### 3. Verify Updates

1. Check tool list is updated
2. Try a few prompts to test new flows
3. Verify metadata changes took effect

---

## Using Other Clients

You can connect your MCP server on multiple clients.

### API Playground

**Purpose:** Raw request/response logs for debugging

**Steps:**
1. Visit the [OpenAI Platform Playground](https://platform.openai.com/playground)
2. Open **Tools → Add → MCP Server**
3. Paste your HTTPS endpoint
4. Test tool calls with custom prompts

**Benefits:**
- ✅ See exact JSON payloads
- ✅ Debug tool call issues
- ✅ Test without UI overhead
- ✅ Copy/paste requests for debugging

**Example request in Playground:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "Show my Jira board"
    }
  ],
  "tools": [
    {
      "type": "mcp",
      "mcp": {
        "url": "https://my-app.fly.dev/mcp"
      }
    }
  ]
}
```

### Mobile Clients

**Steps:**
1. Link connector on ChatGPT web
2. It will automatically be available on ChatGPT mobile apps
3. Test on iOS and Android

**Mobile Testing Checklist:**
- [ ] Widget renders correctly on small screens
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Text is readable without zooming
- [ ] Images scale appropriately
- [ ] Buttons and forms are usable
- [ ] Dark mode works (if applicable)
- [ ] Horizontal scrolling works (for carousels)
- [ ] Loading states are visible

### Desktop App

ChatGPT desktop apps (Mac, Windows) use the same connector.

**Test on desktop for:**
- Keyboard shortcuts
- Copy/paste functionality
- Window resizing
- System integration

---

## Managing Multiple Connectors

You can create multiple connectors for:

### Development vs Production

**Development:**
```
Name: "My App (Dev)"
URL: https://dev.ngrok.app/mcp
Description: "Development version - may be unstable"
```

**Staging:**
```
Name: "My App (Staging)"
URL: https://my-app-staging.fly.dev/mcp
Description: "Staging version for testing"
```

**Production:**
```
Name: "My App"
URL: https://my-app.fly.dev/mcp
Description: "Production version"
```

### Different Features

**Full Version:**
```
Name: "Jira Full"
Tools: list, search, create, update, delete
```

**Read-Only Version:**
```
Name: "Jira Read-Only"
Tools: list, search, view
```

---

## Connector Settings

### Update Connector

1. Go to **Settings → Connectors**
2. Click your connector
3. Update metadata (name, description, URL)
4. Click **Save**

### Delete Connector

1. Go to **Settings → Connectors**
2. Click your connector
3. Click **Delete**
4. Confirm deletion

⚠️ **Warning:** Deleting a connector removes it from all conversations.

### Disable Connector

1. Toggle connector off in conversation settings
2. Or remove from individual conversations

---

## Sharing Your App (Beta Users)

### Internal Testing

Share with colleagues:

1. Give them the connector URL
2. They enable developer mode
3. They create the same connector
4. They can test in their account

### Early Access (When Available)

Once public access is available:
- Submit for review
- Get approved
- Users can discover in directory
- No manual connector creation needed

---

## Troubleshooting Connection Issues

### "Cannot connect to server"

**Possible causes:**
- Server not running
- Wrong URL
- Not HTTPS
- Firewall blocking

**Solutions:**
```bash
# Test endpoint manually
curl https://your-app.com/mcp

# Check server logs
npm run logs

# Verify HTTPS
openssl s_client -connect your-app.com:443
```

### "No tools found"

**Possible causes:**
- Tools not registered
- MCP server not responding
- Wrong endpoint path

**Solutions:**
```javascript
// Verify tools are registered
server.registerTool('my_tool', { /* ... */ }, async () => { /* ... */ });

// Add logging
console.log('Registered tools:', server.listTools());
```

### "Connection times out"

**Possible causes:**
- Server taking too long to respond
- Network issues
- Cold start delays

**Solutions:**
- Reduce server startup time
- Keep instances warm
- Optimize dependencies
- Check network configuration

### "Authentication failed"

**Possible causes:**
- OAuth not configured
- Invalid credentials
- Token expired

**Solutions:**
- Verify OAuth settings
- Check token refresh logic
- Test auth flow separately

---

## Best Practices

### Connector Naming

**Good:**
- ✅ "Jira Project Manager"
- ✅ "Hotel Search & Booking"
- ✅ "Calendar Assistant"

**Bad:**
- ❌ "My App"
- ❌ "Tool"
- ❌ "Connector v2"

### Connector Descriptions

**Good:**
```
"Search for flights, hotels, and rental cars. Book travel and manage reservations. Use when user needs to plan trips or make travel arrangements."
```

**Bad:**
```
"Travel stuff"
```

### URL Management

**Use environment variables:**
```javascript
const MCP_URL = process.env.NODE_ENV === 'production'
  ? 'https://my-app.fly.dev/mcp'
  : 'https://dev.ngrok.app/mcp';
```

### Version Management

Include version in connector name during development:
```
"My App v2.1.0 (Dev)"
```

---

## Next Steps

Once your connector is linked:

1. **Test thoroughly** - [Testing Guide](./deploy-testing.md)
2. **Monitor usage** - Track tool calls and errors
3. **Iterate** - Based on user feedback
4. **Prepare for launch** - When public access is available

---

## Additional Resources

- [Developer Mode Documentation](https://developers.openai.com/docs/chatgpt-apps/developer-mode)
- [App Developer Guidelines](https://developers.openai.com/docs/chatgpt-apps/developer-guidelines)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Troubleshooting Guide](https://developers.openai.com/apps-sdk/guides/troubleshooting)

---

**Remember:** With the connector linked, you can now validate tooling, run experiments, and prepare for eventual rollout!

