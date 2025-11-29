# Test Your Integration

> **Source:** [OpenAI Apps SDK - Test Your Integration](https://developers.openai.com/apps-sdk/deploy/testing)  
> Testing strategies for Apps SDK apps

## Goals

Testing validates that your connector behaves predictably before you expose it to users.

### Three Focus Areas

1. **Tool correctness** - Handlers work as expected
2. **Component UX** - Widgets render and interact properly
3. **Discovery precision** - Model selects your app when appropriate

---

## Unit Test Your Tool Handlers

### What to Test

- ✅ **Schema validation** - Inputs match expected types
- ✅ **Error handling** - Graceful failures
- ✅ **Edge cases** - Empty results, missing IDs, null values
- ✅ **Authentication** - Token issuance, linking, expiration
- ✅ **Business logic** - Correct data transformation

### Example Test Suite

```typescript
import { describe, it, expect } from 'vitest';

describe('search_items tool', () => {
  it('returns results for valid query', async () => {
    const result = await searchItemsTool({ query: 'laptop', limit: 10 });
    
    expect(result.structuredContent.results).toBeInstanceOf(Array);
    expect(result.structuredContent.results.length).toBeLessThanOrEqual(10);
    expect(result.structuredContent.results[0]).toHaveProperty('id');
    expect(result.structuredContent.results[0]).toHaveProperty('title');
  });
  
  it('handles empty query gracefully', async () => {
    const result = await searchItemsTool({ query: '', limit: 10 });
    
    expect(result.content[0].text).toContain('no results');
    expect(result.structuredContent.results).toHaveLength(0);
  });
  
  it('validates limit parameter', async () => {
    await expect(
      searchItemsTool({ query: 'laptop', limit: 100 })
    ).rejects.toThrow('limit must be between 1 and 50');
  });
  
  it('handles missing data gracefully', async () => {
    const result = await searchItemsTool({ query: 'nonexistent123xyz', limit: 10 });
    
    expect(result.structuredContent.results).toHaveLength(0);
    expect(result.isError).toBeFalsy();
  });
  
  it('includes proper metadata', async () => {
    const result = await searchItemsTool({ query: 'laptop', limit: 10 });
    
    expect(result._meta).toBeDefined();
    expect(result._meta.timestamp).toBeDefined();
    expect(result._meta.fullResults).toBeDefined();
  });
});

describe('create_item tool', () => {
  it('creates item with valid data', async () => {
    const result = await createItemTool({
      title: 'Test Item',
      description: 'Test Description',
      price: 99.99
    });
    
    expect(result.structuredContent.item.id).toBeDefined();
    expect(result.structuredContent.item.title).toBe('Test Item');
    expect(result.content[0].text).toContain('Created');
  });
  
  it('validates required fields', async () => {
    await expect(
      createItemTool({ title: '', price: 99.99 })
    ).rejects.toThrow('title is required');
  });
  
  it('validates price range', async () => {
    await expect(
      createItemTool({ title: 'Test', price: -10 })
    ).rejects.toThrow('price must be positive');
  });
});
```

### Test Authentication Flows

```typescript
describe('authentication', () => {
  it('issues valid OAuth token', async () => {
    const token = await issueOAuthToken('user_123');
    
    expect(token.access_token).toBeDefined();
    expect(token.token_type).toBe('Bearer');
    expect(token.expires_in).toBeGreaterThan(0);
  });
  
  it('refreshes expired token', async () => {
    const oldToken = await issueOAuthToken('user_123');
    // Wait for expiration or manually expire
    await expireToken(oldToken.access_token);
    
    const newToken = await refreshOAuthToken(oldToken.refresh_token);
    
    expect(newToken.access_token).toBeDefined();
    expect(newToken.access_token).not.toBe(oldToken.access_token);
  });
  
  it('rejects invalid credentials', async () => {
    await expect(
      authenticateUser('invalid_user', 'wrong_password')
    ).rejects.toThrow('Invalid credentials');
  });
});
```

### Test Fixtures

Keep fixtures close to your MCP code:

```typescript
// fixtures/search-results.ts
export const mockSearchResults = [
  {
    id: 'item_1',
    title: 'MacBook Pro',
    price: 2499,
    description: '16-inch, M3 Max',
    image: 'https://example.com/macbook.jpg'
  },
  {
    id: 'item_2',
    title: 'ThinkPad X1',
    price: 1899,
    description: '14-inch, Intel i7',
    image: 'https://example.com/thinkpad.jpg'
  }
];

// tests/search-tool.test.ts
import { mockSearchResults } from '../fixtures/search-results';

it('formats results correctly', () => {
  const formatted = formatSearchResults(mockSearchResults);
  expect(formatted).toMatchSnapshot();
});
```

---

## Use MCP Inspector During Development

The MCP Inspector is the **fastest way to debug** your server locally.

### Setup

```bash
# Start your MCP server
npm run dev

# In another terminal, launch Inspector
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

### What Inspector Does

- ✅ Lists all available tools
- ✅ Shows tool schemas and metadata
- ✅ Calls tools with test inputs
- ✅ Displays raw requests and responses
- ✅ Renders widgets inline
- ✅ Surfaces errors immediately

### Workflow

1. **List Tools**
   - Click "List Tools" to see all registered tools
   - Verify tool names, descriptions, schemas

2. **Call Tool**
   - Select a tool
   - Fill in test parameters
   - Click "Call Tool"
   - Inspect request and response

3. **Test Widget**
   - See widget rendered inline
   - Verify `window.openai` data
   - Check for JavaScript errors
   - Test interactions

4. **Capture Screenshots**
   - Save screenshots for launch review
   - Document different states
   - Show error handling

### Example Inspector Session

```
1. List Tools
   → Sees: search_items, get_item_details, create_item

2. Call search_items
   Input: { "query": "laptop", "limit": 5 }
   → Response: 5 results with IDs, titles, prices
   → Widget: Renders card carousel

3. Call get_item_details
   Input: { "id": "item_1" }
   → Response: Full item details
   → Widget: Renders detail view with images

4. Call create_item (should fail - missing auth)
   Input: { "title": "Test" }
   → Error: "Authentication required"
   → Widget: Shows error state
```

---

## Validate in ChatGPT Developer Mode

After your connector is reachable over HTTPS, test in the actual ChatGPT environment.

### Setup

1. **Deploy or tunnel**
   ```bash
   ngrok http 8787
   ```

2. **Create connector**
   - Settings → Connectors → Create
   - Paste HTTPS endpoint
   - Add name and description

3. **Enable in conversation**
   - New chat → + → More
   - Select your connector

### Run Golden Prompt Set

Test all prompts you drafted during planning:

#### Direct Prompts
```
✓ "Show my Jira board"
✓ "Search for hotels in Seattle"
✓ "What's on my calendar today?"
✓ "Create a new task called 'Review PR'"
```

**Record:**
- Did model select your app? ✅/❌
- Which tool was called?
- What arguments were passed?
- Was the response correct?

#### Indirect Prompts
```
✓ "What am I blocked on?"
✓ "Find me a place to stay next week"
✓ "Do I have any meetings tomorrow?"
✓ "Help me plan my day"
```

**Record:**
- Model understood intent? ✅/❌
- Selected correct tool?
- Filled in missing parameters correctly?

#### Negative Prompts
```
✗ "What's the weather?" (should NOT trigger)
✗ "Explain how Jira works" (documentation, not your app)
✗ "Show me GitHub issues" (different product)
```

**Record:**
- App was NOT selected? ✅/❌
- If selected incorrectly, why?

### Test Confirmation Prompts

For write tools, verify confirmation behavior:

```
Prompt: "Create a ticket for the login bug"
Expected:
1. Model asks for confirmation
2. Shows what will be created
3. Waits for user approval
4. Executes only after approval
```

### Test Mobile Layouts

**iOS Testing:**
1. Open ChatGPT iOS app
2. Enable your connector
3. Test prompts
4. Verify widget renders correctly

**Android Testing:**
1. Open ChatGPT Android app
2. Enable your connector
3. Test prompts
4. Verify widget renders correctly

**Mobile Checklist:**
- [ ] Widget fits screen width
- [ ] Text is readable without zooming
- [ ] Buttons are tappable (44x44px min)
- [ ] Images load and scale
- [ ] Scrolling works (horizontal/vertical)
- [ ] No content cutoff
- [ ] Loading states visible
- [ ] Error states clear

---

## Connect via API Playground

For raw logs and debugging without the full UI.

### Setup

1. Visit [OpenAI Platform Playground](https://platform.openai.com/playground)
2. Click **Tools → Add → MCP Server**
3. Paste your HTTPS endpoint
4. Connect

### Use Cases

**When to use Playground:**
- 🔍 Need exact JSON payloads
- 🐛 Debugging tool call issues
- 📊 Testing without UI complexity
- 📝 Copying requests for documentation

### Example Test

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "Search for laptops under $2000"
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

**Inspect:**
- Tool selected
- Arguments extracted
- Response structure
- Error messages

---

## Regression Checklist Before Launch

Run this checklist before every major release:

### Tools & Metadata
- [ ] Tool list matches documentation
- [ ] Unused prototypes removed
- [ ] Tool descriptions accurate
- [ ] Input schemas correct
- [ ] Output schemas match actual responses
- [ ] Metadata (_meta) properly structured

### Widgets
- [ ] Render without console errors
- [ ] Inject their own styling (no conflicts)
- [ ] Restore state correctly
- [ ] Handle empty states
- [ ] Handle error states
- [ ] Handle loading states
- [ ] Work in dark mode
- [ ] Work on mobile

### Authentication
- [ ] OAuth flows work end-to-end
- [ ] Tokens are valid
- [ ] Token refresh works
- [ ] Invalid tokens rejected with clear messages
- [ ] Auth errors user-friendly

### Discovery
- [ ] All golden prompts tested
- [ ] Precision measured (% correct selections)
- [ ] Recall measured (% relevant prompts captured)
- [ ] Negative prompts don't trigger
- [ ] Edge cases handled

### Performance
- [ ] Response time < 2 seconds
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Bundle size reasonable

### Error Handling
- [ ] Network errors handled
- [ ] Invalid inputs rejected gracefully
- [ ] Server errors don't crash widget
- [ ] User sees helpful error messages
- [ ] Errors logged for debugging

---

## Testing Checklist Template

```markdown
## Test Run: [Date]

### Environment
- Server: [dev/staging/prod]
- Version: [v1.2.3]
- Tester: [Name]

### Golden Prompts

#### Direct (Expected: Select app)
- [ ] "Show my Jira board" → search_board ✅/❌
- [ ] "What tickets are assigned to me?" → list_tickets ✅/❌
- [ ] "Create ticket for bug" → create_ticket ✅/❌

#### Indirect (Expected: Select app)
- [ ] "What am I blocked on?" → list_tickets(status=blocked) ✅/❌
- [ ] "Help me prioritize" → list_tickets(sort=priority) ✅/❌

#### Negative (Expected: NOT select app)
- [ ] "What's the weather?" → NOT selected ✅/❌
- [ ] "Explain Jira" → NOT selected ✅/❌

### Widget Tests
- [ ] Renders on desktop ✅/❌
- [ ] Renders on mobile ✅/❌
- [ ] Dark mode works ✅/❌
- [ ] Loading states show ✅/❌
- [ ] Error states show ✅/❌
- [ ] Interactions work ✅/❌

### Metrics
- Precision: __% (of selections, how many correct)
- Recall: __% (of relevant prompts, how many captured)
- Avg latency: __ms
- Error rate: __%

### Issues Found
1. [Description]
2. [Description]

### Screenshots
- [Link to screenshots]
```

---

## Capture Findings

Document findings in a shared doc for release-over-release comparison.

### Test Results Document

```markdown
# Test Results: My ChatGPT App

## Release v1.0.0 (2025-11-29)

### Golden Prompts
| Prompt | Expected | Actual | Pass |
|--------|----------|--------|------|
| "Show my board" | search_board | search_board | ✅ |
| "What am I blocked on?" | list_tickets | list_tickets(status=blocked) | ✅ |
| "Weather?" | NOT selected | NOT selected | ✅ |

### Performance
- Avg latency: 250ms
- P95 latency: 500ms
- Error rate: 0.1%

### Issues
- None

---

## Release v1.1.0 (2025-12-15)

### Changes
- Added create_ticket tool
- Updated search_board description
- Fixed mobile layout bug

### Golden Prompts
| Prompt | Expected | Actual | Pass |
|--------|----------|--------|------|
| "Create bug ticket" | create_ticket | create_ticket | ✅ |
| "Show my board" | search_board | search_board | ✅ |

### Performance
- Avg latency: 280ms (+30ms from v1.0.0)
- P95 latency: 550ms
- Error rate: 0.2%

### Issues
- Mobile keyboard covers input field (filed bug #123)
```

---

## Automated Testing

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Test MCP server
        run: npm run test:integration
```

### Integration Tests

```typescript
import { spawn } from 'child_process';
import fetch from 'node-fetch';

describe('MCP Server Integration', () => {
  let serverProcess;
  
  beforeAll(async () => {
    // Start server
    serverProcess = spawn('node', ['dist/index.js']);
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
  
  afterAll(() => {
    serverProcess.kill();
  });
  
  it('lists tools', async () => {
    const response = await fetch('http://localhost:8787/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
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

## Performance Testing

### Load Testing

```javascript
import autocannon from 'autocannon';

autocannon({
  url: 'http://localhost:8787/mcp',
  connections: 10,
  duration: 30,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'search_items',
      arguments: { query: 'test', limit: 10 }
    },
    id: 1
  })
}, (err, result) => {
  console.log('Requests/sec:', result.requests.average);
  console.log('Latency p50:', result.latency.p50);
  console.log('Latency p95:', result.latency.p95);
  console.log('Latency p99:', result.latency.p99);
});
```

---

## Next Steps

After thorough testing:

1. **Fix issues** found during testing
2. **Re-test** critical paths
3. **Deploy** to production
4. **Monitor** real usage
5. **Iterate** based on feedback

---

## Additional Resources

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Troubleshooting Guide](https://developers.openai.com/apps-sdk/guides/troubleshooting)

---

**Remember:** Consistent testing keeps your connector reliable as ChatGPT and your backend evolve. Make testing part of every release cycle!

