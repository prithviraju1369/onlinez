# ChatGPT App Best Practices Checklist

> A comprehensive checklist to run before or after building your ChatGPT app

## Pre-Launch Checklist

### ✅ 1. New Powers

Does your app clearly give ChatGPT new abilities?

- [ ] **Know**: Provides new context or data ChatGPT couldn't access otherwise
- [ ] **Do**: Enables real actions on the user's behalf  
- [ ] **Show**: Presents information in a clearer, more actionable UI than plain text

**Validation Question:**  
_"Would users in your target scenarios notice if this app stopped working?"_

If no, reconsider your approach.

---

### ✅ 2. Focused Surface

Have you kept the scope tight?

- [ ] Chose a small set of capabilities (3-7 max) instead of cloning entire product
- [ ] Each capability has a clear, single purpose
- [ ] Capabilities are named and scoped to map cleanly to real jobs-to-be-done
- [ ] Avoided feature bloat - focused on 80% of value, not 100% of features

**Validation Question:**  
_"Can I explain each capability in one clear sentence?"_

---

### ✅ 3. First Interaction

Does your app handle discovery gracefully?

#### Vague Intent
- [ ] Uses context already in the thread
- [ ] Asks 1-2 clarifying questions max (if needed)
- [ ] Shows concrete value quickly
- [ ] User feels progress has started, not setup has begun

#### Specific Intent  
- [ ] Doesn't ask user to repeat themselves
- [ ] Parses the query and acts immediately
- [ ] Returns focused, structured results
- [ ] Offers optional refinements, not required steps

#### No Brand Awareness
- [ ] First response explains your role in one line
- [ ] Delivers useful output right away (don't just introduce)
- [ ] Makes next step obvious
- [ ] User understands what you are, why you're helpful, and how to use you

**Validation Question:**  
_"Can a new user understand your role and see value from the first meaningful response?"_

---

### ✅ 4. Model-Friendliness

Is your app easy for the model to work with?

#### Clear Actions and Parameters
- [ ] Action names are straightforward (`search_jobs`, `create_ticket`, not `do_thing`)
- [ ] Descriptions explain when to use each action
- [ ] Required vs. optional parameters are clearly marked
- [ ] Parameter formats are documented (dates, currencies, IDs, etc.)
- [ ] No ambiguous or overloaded actions

#### Structured Outputs
- [ ] Schemas are stable and consistent
- [ ] Include both human-readable summaries AND machine-friendly data
- [ ] Use clear field names (not `data1`, `value_x`, etc.)
- [ ] Include stable IDs for entities
- [ ] Return predictable structure across similar operations

**Example of Good Output:**
```json
{
  "summary": "Found 5 candidates matching your criteria",
  "results": [
    {
      "id": "cand_123",
      "name": "Jane Doe",
      "match_score": 92,
      "skills": ["Python", "ML"],
      "url": "https://..."
    }
  ]
}
```

**Validation Question:**  
_"Could another app or future iteration easily build on our output?"_

---

### ✅ 5. Privacy and Data Minimization

Are you collecting and exposing only what's necessary?

#### Input Collection
- [ ] Only require fields you truly need
- [ ] Avoid "blob" params that scoop up extra context
- [ ] Prefer minimal, structured inputs over "send the whole conversation"
- [ ] Be explicit about what you collect and why (one sentence)

#### Output Exposure
- [ ] Intentional about what you do NOT return
- [ ] Skip sensitive internals "just in case"
- [ ] Keep tokens/secrets out of user-visible paths
- [ ] Redact or aggregate when full fidelity isn't necessary

#### Schema Design
- [ ] Actions and schemas make it obvious what's being sent where
- [ ] When you need something sensitive, explain why
- [ ] Privacy by design, not privacy by afterthought

**Validation Question:**  
_"Would I be comfortable if every parameter and return value was logged?"_

---

### ✅ 6. Ecosystem Fit

Can your app play well with others?

#### Composability
- [ ] Actions are small and focused (not monolithic pipelines)
- [ ] Outputs are easy to pass to other tools
- [ ] Use stable IDs and consistent structures
- [ ] Don't hide important info in free-form text only

#### Flow Design
- [ ] Do your part and hand control back
- [ ] Let the model decide next steps
- [ ] Avoid long, tunnel-like multi-step flows
- [ ] Work well standalone AND as part of a chain

#### Future-Proofing
- [ ] Other apps can build on your outputs
- [ ] You benefit from improvements elsewhere
- [ ] You're contributing to the ecosystem, not competing with it

**Validation Question:**  
_"Are we comfortable being one link in a multi-app chain, rather than owning the whole journey?"_

---

### ✅ 7. Evaluation

Do you have a way to measure success?

- [ ] Created a small, thoughtful test set with:
  - [ ] Positive cases (should work)
  - [ ] Negative cases (should gracefully decline)
  - [ ] Edge cases (unclear intent, missing data, etc.)

- [ ] Have some notion of "win rate" vs. base ChatGPT answer
- [ ] Can measure if users get value on first turn
- [ ] Track when users refine vs. abandon
- [ ] Monitor which capabilities are actually used

**Validation Question:**  
_"How will I know if this app is actually helping users?"_

---

## Common Pitfalls to Avoid

### ❌ Feature Bloat
**Symptom:** Trying to replicate entire product  
**Fix:** Focus on 3-5 core capabilities delivering 80% of value

### ❌ Ambiguous Actions  
**Symptom:** Model doesn't know when to call your app  
**Fix:** Use clear names, explicit descriptions, documented parameters

### ❌ Poor First Impression
**Symptom:** Users confused about what you do or don't see value  
**Fix:** Explain role + deliver value + guide next step in first response

### ❌ Unstructured Outputs
**Symptom:** Other tools can't build on your results  
**Fix:** Always pair summaries with structured, machine-readable data

### ❌ Data Over-Collection
**Symptom:** Requesting data you don't actually need  
**Fix:** Ask only what's necessary, be explicit about why

### ❌ Monolithic Operations
**Symptom:** Single action tries to do entire workflow  
**Fix:** Break into focused, composable steps

### ❌ Tunnel Flows
**Symptom:** Users trapped in multi-step wizards  
**Fix:** Make it conversational - show value early, allow flexibility

---

## Quality Bars

### Minimum Viable App

Before shipping, your app should:
- ✅ Clearly provide at least one of: Know / Do / Show
- ✅ Have 3-5 well-defined capabilities
- ✅ Handle vague and specific intents gracefully
- ✅ Show value in first interaction
- ✅ Have clear, unambiguous action descriptions
- ✅ Return structured, consistent outputs
- ✅ Collect only necessary data
- ✅ Work well in multi-app scenarios

### Excellent App

An excellent app also:
- ✅ Handles zero brand awareness elegantly
- ✅ Offers graceful degradation when requests can't be fulfilled exactly
- ✅ Progressive disclosure - starts simple, adds complexity only when needed
- ✅ Clear win rate improvement over base ChatGPT
- ✅ Minimal latency - responds quickly
- ✅ Thoughtful error messages that guide recovery
- ✅ Privacy-first design with minimal data collection
- ✅ Composes beautifully with other apps

---

## Pre-Launch Validation

### Questions to Ask

1. **New Powers**
   - Would users notice if this stopped working?
   - Does it give ChatGPT abilities it didn't have?

2. **Focused Surface**
   - Can I describe each capability in one sentence?
   - Did I pick the essential few, not the exhaustive many?

3. **First Interaction**
   - Does a new user see value immediately?
   - Do they understand what I do and why I'm helpful?

4. **Model-Friendliness**
   - Are my actions and parameters unambiguous?
   - Can outputs be easily reused and chained?

5. **Privacy**
   - Am I collecting only what's necessary?
   - Is it obvious what data flows where?

6. **Ecosystem**
   - Can other tools build on my outputs?
   - Am I contributing or competing?

7. **Measurement**
   - How will I know if this is working?
   - What does success look like?

### Scoring

Give yourself 1 point for each "yes" answer above.

- **0-3 points**: Not ready to ship - revisit core design
- **4-5 points**: Minimum viable - ship and iterate  
- **6-7 points**: Good foundation - add polish and test more
- **8+ points**: Strong candidate - run user testing and prepare to launch

---

## Post-Launch Monitoring

### Metrics That Matter

1. **Activation**: % of users who see value in first interaction
2. **Capability Usage**: Which capabilities are used most/least
3. **Refinement Rate**: How often users refine vs. accept first result
4. **Abandon Rate**: Where in the flow do users stop engaging
5. **Multi-App Usage**: How often is your app used with others
6. **Win Rate**: Improvement over base ChatGPT for your use cases

### Iteration Signals

**Good Signs:**
- ✅ High activation rate
- ✅ Core capabilities used frequently
- ✅ Low abandon rate
- ✅ Users successfully refine results
- ✅ Positive feedback on first interaction

**Warning Signs:**
- ⚠️ Users confused about what you do
- ⚠️ High abandon rate early in conversation
- ⚠️ Capabilities rarely used
- ⚠️ Users preferring base ChatGPT
- ⚠️ Frequent errors or unclear responses

---

## Resources

### Official Documentation
- [Apps SDK Quickstart](https://developers.openai.com/docs/chatgpt-apps)
- [Apps SDK Developer Docs](https://developers.openai.com/docs/chatgpt-apps)
- [Apps SDK UI Library](https://developers.openai.com/docs/chatgpt-apps/ui-library)
- [Apps SDK Example Components](https://developers.openai.com/docs/chatgpt-apps/examples)

### Community
- [Apps SDK Forum](https://community.openai.com/c/chatgpt-apps)

### Reference Guide
- [What Makes a Great ChatGPT App](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)

---

## Quick Reference Card

Print this or keep it handy while building:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CHATGPT APP QUICK CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Know / Do / Show - at least one clearly
□ 3-5 focused capabilities (not entire product)
□ Value visible in first interaction
□ Works for vague AND specific intent
□ Clear action names and descriptions
□ Structured, consistent outputs
□ Minimal data collection
□ Plays well with other apps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ASK YOURSELF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What can we help with here?"
NOT "Where should the user go next?"

"Where are we uniquely helpful?"
NOT "What can we technically expose?"

"Would users notice if this stopped working?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

You don't need to be perfect in every dimension to ship. But if you can answer "yes" to most of the checklist items, you're not just putting your product inside ChatGPT — **you're giving ChatGPT real leverage in your domain.** That's where these apps start to feel indispensable.

