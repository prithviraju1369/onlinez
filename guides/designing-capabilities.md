# Designing ChatGPT App Capabilities

> Guide for translating your product's strengths into clear, well-scoped capabilities

## From Product to Capabilities

### The Wrong Approach ❌
"What can we technically expose from our product?"

### The Right Approach ✅
"Where are we uniquely helpful in a conversation?"

## Step-by-Step Process

### Step 1: Identify Core Jobs-to-Be-Done

List the **top five jobs** your product helps users complete:

Examples:
- "Find the right home in my budget and preferred location"
- "Understand why this metric changed week-over-week"
- "Draft ad copy variations for a new campaign"
- "Get help from our support team without switching tools"

**For each job, ask:** 
"Where does the base ChatGPT experience fall short without us?"

Common answers:
- It can't see live or private data
- It can't take real actions in our systems
- It can't easily produce the structured or visual output users need

### Step 2: Turn Gaps Into Operations

Convert identified gaps into **clearly named operations**:

#### Good Examples:
```
search_properties
  → Return a structured list of candidate homes

explain_metric_change
  → Fetch relevant data and summarize likely drivers

generate_campaign_variants
  → Create multiple ad variants with metadata

create_support_ticket
  → Open a ticket and return a summary + link
```

### Step 3: Validate Operations

Each operation should be:
- ✅ **Concrete** enough for the model to choose confidently
- ✅ **Simple** enough to mix with other steps in a conversation
- ✅ **Directly tied to value**, not to your entire product map

### The Three Things Test

Ask: **"What are the three things we absolutely need this app to do well?"**

Those should map almost one-to-one to your product's capabilities.

## Capability Design Principles

### Keep Actions Small and Focused

**Good:**
```
search_candidates
score_candidates  
send_outreach
```

**Bad:**
```
run_full_recruiting_pipeline
```

### Make Outputs Easy to Pass Along

✅ **Do:**
- Use stable IDs
- Use clear field names
- Maintain consistent structures
- Include both human-readable summaries AND machine-friendly data

**Example Output:**
```json
{
  "summary": "Three options that match your budget and commute time",
  "results": [
    {
      "id": "prop_123",
      "address": "123 Main St",
      "price": 1150000,
      "commute_minutes": 25,
      "school_rating": 9,
      "url": "https://..."
    }
  ]
}
```

❌ **Don't:**
- Hide important information only in free-form text
- Use ambiguous or changing field names
- Return unstructured blobs of data

### Avoid Long, Tunnel-Like Flows

✅ **Do:**
- Do your part of the job
- Hand control back to the conversation
- Let the model decide which tool handles the next step

❌ **Don't:**
- Create multi-step wizards
- Require sequential completion of tasks
- Force users through your entire product flow

## Real-World Example: Canva

**What Canva Does Well:**
- Can generate an entire presentation draft
- Provides full-screen mode for navigation
- BUT deeper slide-by-slide editing happens in the full Canva editor

**Key Insight:** They didn't try to replicate the entire Canva experience. They focused on what works best in conversation (generation and preview) and deferred to their full product for detailed editing.

## Ecosystem Thinking

Remember: Your app is rarely the only one in play.

### Design for Composability

Your outputs should:
- Work well standalone
- Be easy for other apps to build upon
- Benefit from improvements elsewhere in the ecosystem

### Questions to Ask

1. Can another app easily use our output?
2. Can future versions of our app build on this?
3. Are we competing with the ecosystem or contributing to it?

## Privacy and Data Minimization

### Only Require What You Need

- ✅ Ask for the minimum to do the job
- ✅ Be explicit about what you collect and why
- ✅ Prefer minimal, structured inputs over "just send the whole conversation"

### Avoid Data Bloat

❌ **Don't:**
- Use "blob" params that scoop up extra context
- Return sensitive internals "just in case"
- Keep tokens/secrets in user-visible paths

✅ **Do:**
- Redact or aggregate when full fidelity isn't necessary
- Be intentional about what you do NOT return
- Design actions and schemas so it's obvious what's being sent where

## Common Pitfalls

### 1. Feature Bloat
**Symptom:** Trying to expose every feature from your product  
**Fix:** Focus on 3-5 core capabilities that deliver 80% of the value

### 2. Ambiguous Actions
**Symptom:** The model doesn't know when to call your app  
**Fix:** Use straightforward names and spell out required vs. optional params

### 3. Unstructured Outputs
**Symptom:** Other tools can't build on your results  
**Fix:** Always include structured data alongside human-readable text

### 4. Over-Collection
**Symptom:** Requesting data you don't actually need  
**Fix:** Design with privacy by default - ask only what's necessary

## Validation Questions

Before shipping, ask:

1. Can I describe each capability in one clear sentence?
2. Would the model know when to use each one?
3. Can the output be used by other apps or tools?
4. Am I asking for the minimum data needed?
5. Does this capability map to a real user job?

If you answer "no" to any of these, refine before shipping.

