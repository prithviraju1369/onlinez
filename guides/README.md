# ChatGPT App Development Guides

This folder contains comprehensive developer guides for building effective ChatGPT apps, based on OpenAI's official guidance and best practices.

## 📚 Guide Overview

### 0. [Apps SDK Quickstart](./apps-sdk-quickstart.md) ⚡
**Start here** to build your first ChatGPT app in minutes.

Step-by-step tutorial:
- Build a web component (todo list example)
- Create an MCP server
- Run locally and test
- Expose to public internet
- Connect to ChatGPT
- Complete working example code

**Key Takeaway:** Get from zero to a working app quickly, then dive deeper with the guides below.

---

### 1. [ChatGPT App Overview](./chatgpt-app-overview.md)
Understand what ChatGPT apps are and how they work.

Learn about:
- What a ChatGPT app actually is (and isn't)
- The fundamental shift from traditional apps
- The three ways to add value: Know, Do, Show
- The right mental model for building

**Key Takeaway:** Your ChatGPT app is a toolkit the model reaches for, not a mini version of your product.

---

## Planning Guides 📋

### 2. [Research Use Cases](./planning-use-cases.md) 🔍
Identify and prioritize use cases before building.

Topics covered:
- Gather inputs (user interviews, prompt sampling, constraints)
- Define evaluation prompts (direct, indirect, negative)
- Scope minimum lovable features
- Rank and prioritize use cases
- Translate use cases into tooling
- Prepare for iteration

**Key Takeaway:** Every successful app starts with crisp understanding of user jobs-to-be-done.

---

### 3. [Define Tools](./planning-tools.md) 🛠️
Plan and define tools before writing code.

Topics covered:
- Draft tool surface area (one job per tool)
- Define explicit inputs and predictable outputs
- Separate read and write operations
- Capture metadata for discovery
- Model-side guardrails
- Golden prompt rehearsal
- Implementation handoff

**Key Takeaway:** Well-defined tools are the foundation of great ChatGPT apps.

---

### 4. [Design Components](./planning-components.md) 🎨
Plan UI components structure, state, and interactions.

Topics covered:
- Map tools to components (rendering strategies)
- Choose display modes (inline, carousel, fullscreen, PiP)
- Inventory data dependencies
- Define state contracts
- Design responsive layouts
- Plan component interactions
- Telemetry and debugging

**Key Takeaway:** Planning components upfront prevents painful refactors later.

---

## Design & UX Guides 🎯

### 5. [UX Principles](./ux-principles.md)
Essential principles for building great ChatGPT apps.

Topics covered:
- Extract, don't port your product
- Design for conversational entry (vague, direct, first-run)
- Treat ChatGPT as "home"
- Optimize for conversation, not navigation
- Embrace the ecosystem moment
- Pre-publishing checklist

**Key Takeaway:** Do at least one thing better because it lives in ChatGPT.

---

### 6. [UI Guidelines](./ui-guidelines.md)
Guidelines for designing beautiful, accessible ChatGPT apps.

Topics covered:
- Display modes (inline, carousel, fullscreen, picture-in-picture)
- Apps SDK UI design system
- Visual design guidelines (color, typography, spacing)
- Icons and imagery
- Accessibility requirements (WCAG AA)
- Component examples

**Key Takeaway:** Consistency with ChatGPT's design system builds trust and usability.

---

### 7. [Designing Capabilities](./designing-capabilities.md)
Learn how to translate your product into clear, well-scoped capabilities.

Topics covered:
- From product features to app capabilities
- Step-by-step process for identifying core operations
- Designing for composability and ecosystem fit
- Privacy and data minimization
- Common pitfalls and how to avoid them

**Key Takeaway:** Ask "Where are we uniquely helpful?" not "What can we technically expose?"

---

### 8. [Conversation Design](./conversation-design.md)
Master the art of conversational interaction and discovery.

Topics covered:
- Handling three levels of user intent (vague, specific, no awareness)
- First interaction patterns that work
- MCP server design for better model understanding
- Anti-patterns to avoid
- Testing your conversational design

**Key Takeaway:** Design for both the human user and the model runtime.

---

## Technical Implementation Guides 🔧

### 9. [Build MCP Server](./build-mcp-server.md) 🔨
Step-by-step guide to building your MCP server.

Topics covered:
- Understanding the architecture flow
- `window.openai` widget runtime API
- Registering UI templates (resources)
- Registering tools with schemas and metadata
- Returning structured data vs metadata
- Running locally with MCP Inspector
- Advanced capabilities (CSP, private tools, localization)

**Key Takeaway:** Wire tools, templates, and widget runtime correctly for seamless integration.

---

### 10. [MCP Server Guide](./mcp-server-guide.md)
Deep technical dive into the Model Context Protocol server architecture.

Topics covered:
- MCP architecture and concepts
- Setting up an MCP server
- Registering resources (widgets) and tools
- Input validation with Zod schemas
- Widget API (`window.openai`)
- Session management & authentication
- Error handling and testing

**Key Takeaway:** Master the technical foundation that powers ChatGPT apps.

---

### 11. [Implementation Examples](./implementation-examples.md)
Practical code examples and patterns for building ChatGPT apps.

Topics covered:
- MCP server action definitions (good vs. bad)
- Response structure patterns
- Conversation flow implementations
- Error handling examples
- Widget/UI component structures
- Complete example app implementation

**Key Takeaway:** Use these as templates when implementing your own capabilities.

---

## Validation & Launch 🚀

### 12. [Best Practices Checklist](./best-practices-checklist.md)
A comprehensive pre-launch and post-launch checklist.

Includes:
- 7-point validation framework
- Common pitfalls and fixes
- Quality bars for shipping
- Post-launch monitoring metrics
- Quick reference card
- Error handling
- Testing and deployment

**Key Takeaway:** Master the technical foundation that powers ChatGPT apps.

---

## 🎯 Quick Start

### For Your First App (30 minutes)
1. **Build** following [Apps SDK Quickstart](./apps-sdk-quickstart.md) - Get a working app in 15 minutes

### For Production-Ready Apps (Full Process)

#### Phase 1: Planning (Week 1)
1. **Understand** [ChatGPT App Overview](./chatgpt-app-overview.md) - Learn the fundamentals
2. **Research** [Use Cases](./planning-use-cases.md) - Identify user jobs-to-be-done
3. **Define** [Tools](./planning-tools.md) - Plan your tool surface area
4. **Design** [Components](./planning-components.md) - Plan UI and interactions

#### Phase 2: Design (Week 2)
5. **Apply** [UX Principles](./ux-principles.md) - Design for conversation
6. **Follow** [UI Guidelines](./ui-guidelines.md) - Create beautiful, accessible interfaces
7. **Map** with [Designing Capabilities](./designing-capabilities.md) - Product to capabilities
8. **Flow** using [Conversation Design](./conversation-design.md) - Handle all entry patterns

#### Phase 3: Implementation (Weeks 3-4)
9. **Build** [MCP Server](./build-mcp-server.md) - Step-by-step server implementation
10. **Reference** [MCP Server Guide](./mcp-server-guide.md) - Deep technical dive
11. **Code** with [Implementation Examples](./implementation-examples.md) - Follow proven patterns
12. **Reference** [Apps SDK Quickstart](./apps-sdk-quickstart.md) - Technical setup

#### Phase 4: Launch (Week 5)
12. **Validate** using [Best Practices Checklist](./best-practices-checklist.md) - Ship with confidence

---

## 🔑 Core Principles

### The Three Ways to Add Value

Every great ChatGPT app does at least one of these exceptionally well:

1. **Know** - Gives ChatGPT new context or data it couldn't access otherwise
2. **Do** - Lets ChatGPT take real actions on the user's behalf
3. **Show** - Presents information in a clearer, more actionable UI

### The Right Mental Model

```
Traditional App:
You own the screen → Users enter your world → You control the flow

ChatGPT App:  
Model orchestrates → Your app is one capability → Conversation controls the flow
```

### Design Principles

- ✅ **Small and focused** - 3-5 capabilities, not entire product
- ✅ **Conversational** - No wizards or forms
- ✅ **Value first** - Show utility in first interaction
- ✅ **Privacy-minded** - Collect only what's necessary
- ✅ **Composable** - Play well with other apps
- ✅ **Clear** - Model knows when and how to use you

---

## 📖 For Different Roles

### Developers
**Building your first app?**
1. [Apps SDK Quickstart](./apps-sdk-quickstart.md) - ⚡ Build in 15 minutes

**Building for production?**
1. [ChatGPT App Overview](./chatgpt-app-overview.md) - Understand the paradigm
2. [UX Principles](./ux-principles.md) - Design for conversation
3. [UI Guidelines](./ui-guidelines.md) - Visual design system
4. [Designing Capabilities](./designing-capabilities.md) - Build the right API
5. [MCP Server Guide](./mcp-server-guide.md) - Master the technical foundation
6. [Implementation Examples](./implementation-examples.md) - See code patterns
7. [Apps SDK Quickstart](./apps-sdk-quickstart.md) - Technical setup
8. [Best Practices Checklist](./best-practices-checklist.md) - Validate before shipping

### Product Managers
Focus on:
1. [ChatGPT App Overview](./chatgpt-app-overview.md) - Know/Do/Show framework
2. [UX Principles](./ux-principles.md) - Conversational value, platform fit
3. [Designing Capabilities](./designing-capabilities.md) - Jobs-to-be-done mapping
4. [Conversation Design](./conversation-design.md) - User experience patterns
5. [Apps SDK Quickstart](./apps-sdk-quickstart.md) - Understand technical workflow

### Designers  
Read:
1. [UX Principles](./ux-principles.md) - Extract, don't port; conversation-first design
2. [UI Guidelines](./ui-guidelines.md) - Display modes, visual system, accessibility
3. [Conversation Design](./conversation-design.md) - Interaction patterns
4. [ChatGPT App Overview](./chatgpt-app-overview.md) - Understand constraints
5. [Apps SDK Quickstart](./apps-sdk-quickstart.md) - See a complete example
6. [Best Practices Checklist](./best-practices-checklist.md) - Design validation

---

## 🧪 Validation Framework

Before shipping any ChatGPT app, ensure:

| Dimension | Question |
|-----------|----------|
| **New Powers** | Would users notice if this stopped working? |
| **Focused Surface** | Can I describe each capability in one sentence? |
| **First Interaction** | Does a new user see value immediately? |
| **Model-Friendly** | Are actions and outputs unambiguous? |
| **Privacy** | Am I collecting only what's necessary? |
| **Ecosystem Fit** | Can other apps build on my outputs? |
| **Measurement** | How will I know if this is working? |

---

## 📊 Success Metrics

Track these to know if your app is working:

1. **Activation Rate** - % who see value in first interaction
2. **Capability Usage** - Which features are used most
3. **Refinement Rate** - How often users refine vs. accept
4. **Abandon Rate** - Where users stop engaging
5. **Win Rate** - Improvement over base ChatGPT

---

## 🔗 Official Resources

### Documentation
- [Apps SDK Quickstart](https://developers.openai.com/apps-sdk/quickstart)
- [Apps SDK Documentation](https://developers.openai.com/docs/chatgpt-apps)
- [MCP Server Guide](https://developers.openai.com/docs/chatgpt-apps/mcp-server)
- [UX Principles](https://developers.openai.com/docs/chatgpt-apps/ux-principles)
- [UI Guidelines](https://developers.openai.com/docs/chatgpt-apps/ui-guidelines)

### Tools & Examples
- [Apps SDK UI Library](https://developers.openai.com/docs/chatgpt-apps/ui-library)
- [Apps SDK Examples (GitHub)](https://github.com/openai/chatgpt-apps)
- [MCP Inspector](https://modelcontextprotocol.io/inspector)

### Community & Learning
- [Apps SDK Forum](https://community.openai.com/c/chatgpt-apps)
- [What Makes a Great ChatGPT App (Blog)](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

---

## 💡 Common Questions

### "Should I port my entire product to ChatGPT?"
**No.** Focus on 3-5 capabilities that deliver 80% of the value. Think toolkit, not clone.

### "How do I handle users who don't know my brand?"
Your first response should: explain your role (1 line) + deliver value + guide next step.

### "What if my app needs lots of user input?"
Avoid multi-step wizards. Use progressive disclosure - start simple, add complexity only when needed.

### "How do I make the model use my app correctly?"
Clear action names, explicit descriptions, documented parameters. Design for the model runtime, not just humans.

### "Can my app work with other apps?"
Yes, and it should! Keep actions small and focused, outputs structured and composable.

---

## 🚀 Next Steps

### Getting Started (First App)
1. **Build** - Follow the [Apps SDK Quickstart](./apps-sdk-quickstart.md)
2. **Test** - Use MCP Inspector to validate
3. **Connect** - Add to ChatGPT in developer mode
4. **Learn** - Read the conceptual guides

### Going to Production
1. **Review** - Read all guides thoroughly
2. **Plan** - Identify your core capabilities using the framework
3. **Design** - Create conversational interactions
4. **Implement** - Follow implementation examples
5. **Validate** - Use the checklist
6. **Deploy** - Host on a production service
7. **Measure** - Track success metrics
8. **Iterate** - Improve based on real usage

---

## 📝 Source

These guides are based on:
- **"What Makes a Great ChatGPT App"** by Corey Ching
- Published: November 24, 2025
- [Read original article](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)

---

## 🤝 Contributing

These guides are for internal reference and context for AI assistants like Cursor. Keep them updated as:
- OpenAI releases new guidance
- We learn from building and shipping
- User feedback reveals new patterns

Remember: The goal is to give ChatGPT **real leverage in your domain**, not just to exist inside ChatGPT.

