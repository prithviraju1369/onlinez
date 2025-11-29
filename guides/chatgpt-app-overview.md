# What Makes a Great ChatGPT App - Overview

> **Source:** [OpenAI Developer Blog](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)  
> **Author:** Corey Ching  
> **Date:** Nov 24, 2025

## Introduction

ChatGPT Apps are a new way to bring your product directly into ChatGPT conversations. This guide provides practical guidance for developers, PMs, and designers on how to choose the right use case and design an app that's actually useful once it's live.

## What a ChatGPT App Actually Is

### The Fundamental Shift

When teams build their first ChatGPT app, the starting point is often:
_"We already have a product. Let's bring it into ChatGPT."_

However, **this is the wrong mental model.**

### Key Differences

**Outside ChatGPT** (Traditional Apps):
1. Tap your icon
2. Enter your environment  
3. Learn your navigation and UI patterns
4. **You own the screen**

**Inside ChatGPT** (ChatGPT Apps):
- It's a **capability** the model can call
- Shows up **inside** an ongoing conversation
- One of several tools the model may orchestrate
- Users aren't "opening" your app - they're having a conversation

### Practical Definition

**A ChatGPT app is a set of well-defined tools that can perform tasks, trigger interactions, or access data.**

This means:
- ❌ You don't need to port every feature
- ❌ You don't need a full navigation hierarchy  
- ✅ You DO need a clear, compact API: a handful of operations that are easy to invoke and easy to build on

### The Right Mindset

Think of your ChatGPT app as:
> **A toolkit the model reaches for when the user runs into a specific type of problem.**

The more precisely that toolkit is defined, the easier it is to use in the flow of conversation.

Instead of asking "Where should the user go next?" ask **"What can we help with here?"**

## The Three Ways to Add Real Value

A simple filter for any app idea - it must do at least one of these:

### 1. **Know** - New Things to Know
Give ChatGPT new context or data it couldn't see otherwise:
- Live prices, availability, inventory
- Internal metrics, logs, analytics
- Specialized, subscription-gated, or niche datasets
- User-specific data (accounts, history, preferences, entitlements)
- Sensor data, live video streams

**The app becomes the "eyes and ears" of the model in your domain.**

### 2. **Do** - New Things to Do
Let ChatGPT take actions on the user's behalf:
- Create or update records in internal tools
- Send messages, tickets, approvals, notifications
- Schedule, book, order, or configure things
- Trigger workflows (deploy, escalate, sync data)
- Play interactive games (apply rules, advance turns, track state)
- Take actions in the physical world (IoT, robotics control)

**The app is a pair of hands that turns the model's intent into concrete changes.**

### 3. **Show** - Better Ways to Show
Present information in a GUI that makes it more digestible or actionable:
- Shortlists, comparisons, rankings
- Tables, timelines, charts
- Role-specific or decision-specific summaries
- Visual or structured views of game state (boards, inventories, scores)

**Especially valuable when users are making choices or trade-offs.**

### The Litmus Test

If an app doesn't clearly move the needle on at least one of **know/do/show**, it tends to feel like a thin wrapper around what the base model already does.

## Resources

- [Apps SDK Quickstart](https://developers.openai.com/docs/chatgpt-apps)
- [Apps SDK Developer Docs](https://developers.openai.com/docs/chatgpt-apps)
- [Apps SDK UI Library](https://developers.openai.com/docs/chatgpt-apps/ui-library)
- [Apps SDK Examples](https://developers.openai.com/docs/chatgpt-apps/examples)
- [Apps SDK Forum](https://community.openai.com/c/chatgpt-apps)

