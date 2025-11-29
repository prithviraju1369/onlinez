# Deploy Your ChatGPT App

> **Source:** [OpenAI Apps SDK - Deploy Your App](https://developers.openai.com/apps-sdk/deploy)  
> Learn how to deploy your MCP server

## Overview

Once you have a working MCP server and component bundle, the next step is to host them behind a **stable HTTPS endpoint**.

### Deployment Requirements

- ✅ **HTTPS** - Required for ChatGPT to connect
- ✅ **Streaming support** - `/mcp` must support server-sent events
- ✅ **Responsive** - Low latency, reliable uptime
- ✅ **Proper status codes** - Return appropriate HTTP codes for errors

---

## Deployment Options

### Managed Containers (Recommended for Most Apps)

**Best for:** Quick deployment, automatic TLS, easy scaling

#### Fly.io

**Pros:**
- ✅ Automatic HTTPS/TLS
- ✅ Global edge deployment
- ✅ Simple CLI
- ✅ Free tier available

**Setup:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Initialize (in your project directory)
flyctl launch

# Deploy
flyctl deploy
```

**fly.toml example:**
```toml
app = "my-chatgpt-app"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

#### Render

**Pros:**
- ✅ Zero-config HTTPS
- ✅ Auto-deploy from Git
- ✅ Easy secrets management

**Setup:**
1. Connect your Git repository
2. Select "Web Service"
3. Configure build and start commands
4. Deploy

**render.yaml example:**
```yaml
services:
  - type: web
    name: my-chatgpt-app
    env: node
    buildCommand: npm install && npm run build
    startCommand: node dist/index.js
    envVars:
      - key: NODE_ENV
        value: production
```

#### Railway

**Pros:**
- ✅ Instant deployment
- ✅ Automatic HTTPS
- ✅ Built-in observability

**Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

---

### Cloud Serverless

**Best for:** Scale-to-zero, pay-per-use, high-scale apps

⚠️ **Warning:** Long cold starts can interrupt streaming HTTP

#### Google Cloud Run

**Pros:**
- ✅ Scales to zero (cost-effective)
- ✅ Pay only for usage
- ✅ Auto-scaling

**Setup:**
```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/my-app

# Deploy
gcloud run deploy my-app \
  --image gcr.io/PROJECT_ID/my-app \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

**Dockerfile example:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

#### Azure Container Apps

**Pros:**
- ✅ Kubernetes-based
- ✅ Auto-scaling
- ✅ Built-in monitoring

**Setup:**
```bash
# Create container app
az containerapp create \
  --name my-app \
  --resource-group my-rg \
  --environment my-env \
  --image my-registry.azurecr.io/my-app:latest \
  --target-port 8080 \
  --ingress external
```

---

### Kubernetes

**Best for:** Teams already running clusters, need full control

**Pros:**
- ✅ Full control over infrastructure
- ✅ Advanced orchestration
- ✅ Multi-region deployment

**Requirements:**
- Ingress controller that supports server-sent events
- TLS termination
- Health checks

**Example deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatgpt-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chatgpt-app
  template:
    metadata:
      labels:
        app: chatgpt-app
    spec:
      containers:
      - name: app
        image: my-registry/chatgpt-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

---

## Local Development

During development, expose your local server to ChatGPT using a tunnel.

### Using ngrok

**Setup:**
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com

# Start tunnel
ngrok http 8080
```

**Output:**
```
Forwarding: https://abc123.ngrok.app -> http://127.0.0.1:8080
```

**Your MCP endpoint:**
```
https://abc123.ngrok.app/mcp
```

**Keep tunnel running while you iterate.**

### Using Cloudflare Tunnel

**Setup:**
```bash
# Install cloudflared
brew install cloudflared

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create my-app

# Run tunnel
cloudflared tunnel --url http://localhost:8080
```

### Using Tailscale Funnel

**Setup:**
```bash
# Install Tailscale
# https://tailscale.com/download

# Enable funnel
tailscale funnel 8080
```

---

## Development Workflow

### When You Change Code:

1. **Rebuild component bundle**
   ```bash
   cd web
   npm run build
   ```

2. **Restart MCP server**
   ```bash
   cd server
   npm run build
   node dist/index.js
   ```

3. **Refresh connector in ChatGPT**
   - Go to Settings → Connectors
   - Select your connector
   - Click "Refresh" to pull latest metadata

### Auto-Reload Setup

**Using nodemon (development):**
```bash
npm install --save-dev nodemon

# package.json
{
  "scripts": {
    "dev": "nodemon --watch src --exec 'npm run build && node dist/index.js'"
  }
}
```

**Using concurrently (watch both):**
```bash
npm install --save-dev concurrently

# package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:web\" \"npm run dev:server\"",
    "dev:web": "cd web && npm run dev",
    "dev:server": "cd server && nodemon --watch src --exec 'npm run build && node dist/index.js'"
  }
}
```

---

## Environment Configuration

### Secrets Management

**Never commit secrets to your repository.**

#### Using Environment Variables

```bash
# .env (add to .gitignore)
API_KEY=your_secret_key
OAUTH_CLIENT_SECRET=your_oauth_secret
DATABASE_URL=postgresql://...
```

```javascript
// Load in your app
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY;
```

#### Platform-Specific Secret Managers

**Fly.io:**
```bash
flyctl secrets set API_KEY=your_secret_key
flyctl secrets set OAUTH_CLIENT_SECRET=your_oauth_secret
```

**Render:**
```
Settings → Environment → Add Environment Variable
```

**Railway:**
```bash
railway variables set API_KEY=your_secret_key
```

**Google Cloud:**
```bash
gcloud secrets create api-key --data-file=-
# Paste secret, press Ctrl+D
```

**Kubernetes:**
```bash
kubectl create secret generic app-secrets \
  --from-literal=api-key=your_secret_key
```

---

### Logging

Log essential information for debugging:

```javascript
// Good logging
console.log({
  type: 'tool_call',
  toolName: 'search_items',
  toolCallId: callId,
  args: args,
  userId: userId,
  timestamp: new Date().toISOString(),
  latency: Date.now() - startTime
});

// Log errors with context
console.error({
  type: 'tool_error',
  toolName: 'search_items',
  error: error.message,
  stack: error.stack,
  toolCallId: callId,
  userId: userId
});
```

**What to log:**
- ✅ Tool call IDs
- ✅ Request latency
- ✅ Error payloads
- ✅ User IDs (hashed if sensitive)
- ✅ Timestamps

**What NOT to log:**
- ❌ API keys or secrets
- ❌ Full user data or PII
- ❌ Passwords or tokens
- ❌ Credit card numbers

---

### Observability

**Monitor these metrics:**

#### Performance
- CPU usage
- Memory usage
- Request count
- Request latency (p50, p95, p99)
- Error rate

#### Business
- Tool call frequency
- Active users
- Widget render time
- Conversion rates

#### Example with Prometheus/Grafana

```javascript
import prometheus from 'prom-client';

const toolCallDuration = new prometheus.Histogram({
  name: 'tool_call_duration_seconds',
  help: 'Tool call duration in seconds',
  labelNames: ['tool_name', 'status']
});

// In your tool handler
const end = toolCallDuration.startTimer({ tool_name: 'search_items' });
try {
  const result = await performSearch(args);
  end({ status: 'success' });
  return result;
} catch (error) {
  end({ status: 'error' });
  throw error;
}
```

---

## Dogfood and Rollout

Before launching broadly, test thoroughly with real users.

### Phase 1: Internal Testing

**Gate access** behind developer mode:

```javascript
// Only allow specific users during testing
const ALLOWED_USERS = process.env.BETA_USERS?.split(',') || [];

function isBetaUser(userId) {
  return ALLOWED_USERS.includes(userId) || 
         process.env.NODE_ENV === 'development';
}

// In tool handler
if (!isBetaUser(userId)) {
  return {
    content: [{
      type: 'text',
      text: 'This app is currently in beta. Stay tuned!'
    }],
    isError: true
  };
}
```

**What to test:**
- [ ] All golden prompts (direct, indirect, negative)
- [ ] Edge cases and error handling
- [ ] Mobile layouts (iOS, Android)
- [ ] Different conversation contexts
- [ ] Multi-turn interactions
- [ ] Authentication flows
- [ ] State persistence

### Phase 2: Beta Testing

**Use feature flags** (Statsig, LaunchDarkly, etc.):

```javascript
import { StatsigClient } from 'statsig-node';

const statsig = new StatsigClient(process.env.STATSIG_KEY);

async function isFeatureEnabled(userId, feature) {
  const user = { userID: userId };
  return await statsig.checkGate(user, feature);
}

// In tool handler
if (!await isFeatureEnabled(userId, 'chatgpt_app_enabled')) {
  return { /* not available */ };
}
```

**Gradual rollout:**
- Week 1: 5% of users
- Week 2: 25% of users
- Week 3: 50% of users
- Week 4: 100% of users

### Phase 3: Run Golden Prompts

Exercise the discovery prompts you drafted during planning:

```javascript
const GOLDEN_PROMPTS = [
  // Direct
  "Show my Jira board",
  "What Jira tickets are assigned to me?",
  
  // Indirect
  "What am I blocked on?",
  "Help me prioritize my work",
  
  // Negative (should NOT trigger)
  "What's the weather?",
  "Explain how Jira works"
];

// Test precision and recall
GOLDEN_PROMPTS.forEach(prompt => {
  console.log(`Testing: "${prompt}"`);
  // Record: Did model select your app? Correct tool? Right args?
});
```

**Track metrics:**
- **Precision**: % of times your app was selected correctly
- **Recall**: % of relevant prompts that triggered your app
- **Latency**: Average response time
- **Error rate**: % of failed tool calls

### Phase 4: Capture Artifacts

**For launch review:**

1. **Screenshots**
   - Widget in MCP Inspector
   - Widget in ChatGPT (desktop)
   - Widget on mobile
   - Different states (loading, error, success)

2. **Screen recordings**
   - Complete user flow
   - Edge cases
   - Error recovery

3. **Logs**
   - Sample tool calls
   - Error examples
   - Performance metrics

---

## Pre-Production Checklist

### Infrastructure
- [ ] HTTPS endpoint is stable
- [ ] /mcp route is responsive (<2s)
- [ ] Streaming responses work
- [ ] Health check endpoint exists
- [ ] Auto-scaling configured
- [ ] Rate limiting in place

### Security
- [ ] Secrets stored in secret manager
- [ ] No API keys in code or logs
- [ ] Authentication implemented
- [ ] Authorization checks in place
- [ ] Input validation on all tools
- [ ] Output sanitization

### Observability
- [ ] Logging configured
- [ ] Metrics collection enabled
- [ ] Alerts set up for errors
- [ ] Dashboard for monitoring
- [ ] On-call rotation defined

### Testing
- [ ] All golden prompts tested
- [ ] Edge cases covered
- [ ] Mobile layouts verified
- [ ] Error states handled
- [ ] Beta users gave feedback

### Documentation
- [ ] Connector metadata updated
- [ ] Auth flows documented
- [ ] Tool descriptions clear
- [ ] Release notes prepared
- [ ] Troubleshooting guide ready

---

## Production Deployment

### Deploy Steps

1. **Final testing in staging**
   ```bash
   # Deploy to staging
   npm run deploy:staging
   
   # Run full test suite
   npm run test:integration
   ```

2. **Deploy to production**
   ```bash
   npm run deploy:production
   ```

3. **Update ChatGPT connector**
   - Update connector URL if needed
   - Refresh metadata
   - Test with a few prompts

4. **Monitor closely**
   - Watch error rates
   - Check latency
   - Monitor user feedback

5. **Communicate launch**
   - Update directory metadata
   - Publish release notes
   - Announce to users

---

## Right-Sizing Your Deployment

### Small Apps (<100 users/day)

**Recommendation:** Fly.io or Render free tier

**Configuration:**
- 1-2 instances
- 256MB - 512MB RAM
- 0.5 - 1 CPU

### Medium Apps (100-10k users/day)

**Recommendation:** Render, Railway, or Fly.io

**Configuration:**
- 2-5 instances
- 512MB - 1GB RAM
- 1-2 CPUs
- Auto-scaling enabled

### Large Apps (>10k users/day)

**Recommendation:** Kubernetes or Cloud Run

**Configuration:**
- 5+ instances
- 1-2GB RAM per instance
- 2-4 CPUs per instance
- Load balancing
- Multi-region deployment
- CDN for static assets

---

## Cost Optimization

### Strategies

**1. Use serverless for low traffic**
- Pay only for actual usage
- Scale to zero when idle

**2. Cache aggressively**
- Cache API responses
- Use CDN for static assets
- Implement HTTP caching headers

**3. Optimize cold starts**
- Keep containers warm
- Use smaller base images
- Minimize dependencies

**4. Monitor and optimize**
- Track cost per user
- Identify expensive operations
- Optimize database queries

---

## Rollback Plan

Always have a rollback strategy:

### Quick Rollback

```bash
# Fly.io
flyctl releases

# Render
# Use dashboard to rollback

# Railway
railway rollback

# Kubernetes
kubectl rollout undo deployment/chatgpt-app
```

### Health Checks

```javascript
// /health endpoint
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok'
  };
  
  // Check database
  try {
    await db.ping();
    health.database = 'ok';
  } catch (error) {
    health.database = 'error';
    health.status = 'degraded';
  }
  
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
```

---

## Next Steps

Once deployed:

1. **Connect** to ChatGPT - [Connect from ChatGPT Guide](./deploy-connect-chatgpt.md)
2. **Test** your integration - [Testing Guide](./deploy-testing.md)
3. **Monitor** and iterate - Track metrics and user feedback
4. **Troubleshoot** issues - [Troubleshooting Guide](https://developers.openai.com/apps-sdk/guides/troubleshooting)

---

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

---

**Remember:** Start simple, deploy early, and iterate based on real usage. Don't over-engineer your deployment before you have users!

