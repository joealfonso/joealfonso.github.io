# AI Readiness Review v1.0 — Methodology

A design-layer assessment instrument for AI-assisted product experiences.

Compiled by Joseph Alfonso · August 2026 · [josephalfonso.com](https://josephalfonso.com/)

---

## 1. Purpose and scope

Most published AI governance material operates at one of two altitudes. Either it addresses the organization (management systems, policy, risk registers) or it addresses the model (evaluation, bias testing, robustness). Comparatively little of it translates into the decisions a designer actually makes: what state this panel needs, whether this confirmation step is required, what happens on this screen when the system is wrong.

This instrument occupies that gap. It restates obligations and findings from established sources as reviewable properties of an interface, so that a design review can produce a defensible readiness judgment rather than an opinion.

### In scope

- The interface layer of an AI-assisted feature: what is disclosed, what is explained, what a user can do, what happens on failure.
- Whether design decisions are supported by evidence rather than assertion.
- Whether the experience holds up across the full user population.

### Explicitly out of scope

- Model performance, accuracy benchmarking, and evaluation methodology.
- Data governance, provenance, retention, and security.
- Legal conformity assessment under any regulation.
- Organizational AI management systems.

The AI Readiness Review is **not** a compliance artifact. Regulatory citations appear because they express design obligations clearly and because they are useful in conversation with legal and risk partners. A passing score is not evidence of compliance with the EU AI Act or any other instrument, and does not substitute for qualified legal review.

---

## 2. Structure

| Layer | Count | Purpose |
|---|---|---|
| Screening questions | 5 | Establish the risk tier |
| Dimensions | 7 | Group criteria by the property being assessed |
| Criteria | 27 | The scored units |
| Gate criteria | 13 | Non-tradeable requirements, tier-dependent |

### The seven dimensions

| Code | Dimension | Assesses |
|---|---|---|
| D1 | Capability disclosure | Whether the user knows an AI is involved and how well it performs |
| D2 | Output legibility | Whether a user can tell why a result was produced and how much to trust it |
| D3 | Human agency and oversight | Whether a person remains genuinely in control |
| D4 | Uncertainty and failure design | What happens when the system is unsure or wrong |
| D5 | Equity and accessibility | Whether it holds up beyond the reference user |
| D6 | Demonstrated value | Whether it improves the work, measured against a baseline |
| D7 | Accountability record | Whether the decisions can be defended, inherited, or audited |

---

## 3. Risk tiering

Rigor scales with consequence. Applying a launch-gate standard to a low-stakes assistive feature wastes review capacity and trains teams to treat the instrument as ceremony. Applying a light standard to a consequential system is the failure mode the instrument exists to prevent.

Five screening questions determine the tier:

1. Does the output influence a decision about a person's employment, finances, health, housing, legal status, education, or benefits?
2. Can the system take an action, or commit a result, without a human confirming it first?
3. Does the feature process personal, sensitive, or identifiable data?
4. Will non-expert, vulnerable, or unsupported users rely on the output without a specialist intermediary?
5. Are the effects of a wrong output slow, costly, or impossible to reverse?

### Tier assignment

| Condition | Tier |
|---|---|
| 3 or more "yes", **or** Q1 and Q2 both "yes" | **Tier 3 — Consequential** |
| 1 to 2 "yes" | **Tier 2 — Elevated** |
| 0 "yes" | **Tier 1 — Routine** |

The Q1 + Q2 rule exists because a system that both affects a person's material circumstances *and* acts without confirmation is the highest-risk configuration in the set, regardless of how the remaining questions score. Two "yes" answers would otherwise place it in Tier 2.

### Tier thresholds

| Tier | Composite minimum | Dimension floor | Gate rule |
|---|---|---|---|
| 1 — Routine | 70% | 40% | Gates recorded, not enforced |
| 2 — Elevated | 80% | 50% | Tier 2 gates must score ≥ 1 |
| 3 — Consequential | 90% | 67% | All gates must score 2 |

---

## 4. Scoring

### Scale

| Score | Meaning |
|---|---|
| **0** | Not met. The property is absent. |
| **1** | Partially met. Present but incomplete, inconsistent, or unverified. |
| **2** | Met, with evidence. A named artifact, test result, or observation supports the score. |
| **N/A** | Genuinely inapplicable. Excluded from numerator and denominator, but counted as reviewed. |

### The evidence rule

**A score of 2 requires a stated artifact, test result, or observation.** Reviewer confidence is not evidence. This is the instrument's primary control on inter-rater drift: two reviewers who disagree about whether something is "good enough" will usually agree about whether a screen reader test was run, and when.

The tool flags any 2 recorded without evidence. Unresolved evidence gaps appear in the exported report. They do not automatically reduce the verdict, because a reviewer may legitimately record evidence outside the tool, but they are visible to anyone reading the output.

### Verdict conditions

Three independent conditions must all hold for **Ready**. A single aggregate percentage can conceal a systemic failure inside a good average, so it is deliberately not the only test.

1. **Composite threshold** — total score meets the tier minimum.
2. **Dimension floor** — no single dimension falls below the tier floor. This prevents one neglected area being averaged away by strength elsewhere. A feature with excellent disclosure and no failure design is not ready, however good the total looks.
3. **Gate clearance** — every gate criterion active at the tier is satisfied.

| Verdict | Condition |
|---|---|
| **Ready** | All three conditions met, all criteria scored |
| **Conditional** | Composite met, one other condition failed. Re-review required after remediation |
| **Not ready** | Composite below threshold |
| **Blocked** | An active gate scored 0 at Tier 2, or below 2 at Tier 3 |

**Blocked** overrides composite score entirely. A feature can score 95% and still be blocked. That is the intended behavior: gates encode requirements that are not tradeable against strength elsewhere.

---

## 5. Gate criteria

Thirteen criteria act as gates. Ten activate at Tier 2 and above; three activate only at Tier 3.

### Active at Tier 2 and above

| ID | Criterion | Principal source |
|---|---|---|
| D1.1 | Users are told they are interacting with an AI system | AI Act Art. 50(1) |
| D2.2 | Reason for output available at point of decision, in plain language | HAX G11, AI Act Art. 13(1) |
| D2.4 | Confidence and explanation conveyed non-visually | WCAG 2.2, AI Act Art. 50(5) |
| D3.1 | User sees proposed action before it takes effect | AI Act Art. 14(4) |
| D3.2 | Override or reverse without engineering assistance | AI Act Art. 14(4)(d),(e) |
| D3.3 | Consequential actions require explicit confirmation | AI Act Art. 14 |
| D4.1 | Explicit "cannot determine" state exists | PAIR failstates, NIST AI 600-1 confabulation |
| D4.3 | Designed recovery path for AI-specific errors | PAIR Errors + Graceful Failure, HAX G9 |
| D5.1 | AI-specific interface tested with assistive technology | WCAG 2.2, W3C AI accessibility |
| D7.1 | Known limitations documented and reach deployers | AI Act Art. 13(3) |

### Active at Tier 3 only

| ID | Criterion | Principal source |
|---|---|---|
| D3.4 | Design actively counters automation bias | AI Act Art. 14(4)(b), Mosier & Skitka 1996, Parasuraman & Riley 1997 |
| D5.2 | Subgroup performance disparities measured | NIST AI 100-1, NIST AI 600-1 |
| D7.3 | Impact assessment completed pre-launch | ISO/IEC 42001 A.5 |

These three are Tier 3 only because each requires investigation beyond the design surface. Demanding them of every low-stakes feature would make the instrument unusable in practice, which is its own failure mode.

---

## 6. Running a review

### Who

A minimum of two people. One designer close to the work who can produce evidence, and one reviewer not on the team. Single-reviewer assessments are valid for Tier 1 and are systematically optimistic above it.

For Tier 3, include someone from outside the product group entirely. Accessibility, research, and risk are the usual sources.

### When

| Stage | What to run |
|---|---|
| Concept | Screening only. Establish the tier before design begins, since the tier changes what needs designing. |
| Design in progress | D1 through D4. Structural problems are cheap to fix here and expensive later. |
| Pre-handoff | Full instrument. Gaps become engineering requirements rather than post-launch findings. |
| Pre-launch | Full instrument as a gate. |
| Post-launch | Full instrument as an audit, typically annually or after significant change. |

### How long

Roughly 45 to 90 minutes for a full pass with evidence gathered in advance. Considerably longer if evidence has to be produced during the session, which is itself a finding.

### Remediation

A **Conditional** or **Not ready** verdict should produce a dated remediation list, not a debate about the score. Export the report, attach it to the ticket, and re-run the instrument after the work lands. Re-running is cheap; the second pass typically takes 20 minutes.

Do not adjust scores to reach a desired verdict. If a criterion is genuinely wrong for your context, mark it N/A and record why in the evidence field. That is a legitimate use of the instrument and leaves an honest trail.

---

## 7. Known limitations

**It assesses the design, not the system.** A feature can pass the AI Readiness Review and still be built on a poorly evaluated model. The instrument makes no claim about the model.

**Scores are reviewer judgments.** The evidence rule constrains drift but does not eliminate it. Two competent reviewers will not always agree. The instrument is more reliable as a comparison across reviews by the same team than as an absolute measure across organizations.

**The tiering is coarse.** Five binary questions cannot capture every risk profile. Where the tier feels wrong, override it upward and record the reason. There is no mechanism to override downward, by design.

**Regulatory citations age, and several carry qualifiers the instrument compresses.** Citations reflect published text as of August 2026. The EU AI Act's high-risk obligations phase in over several years, Article 14's oversight requirements apply "as appropriate and proportionate" and fall on the provider, and several Article 13 sub-items are conditional on "where applicable" or "when appropriate." It states them as design properties, which is stricter than the regulation in places and is deliberate. Verify current requirements with counsel before relying on any citation here.

**One source is a working draft.** The W3C machine learning and generative AI accessibility document is an Editor's Draft and says explicitly that it should not be cited as settled guidance. Criteria D5.1 and D5.3 draw on its specific documented findings; treat them as informed practice rather than standard.

**It is not adversarial.** It assesses whether an experience is well designed for cooperative users. It does not assess misuse, gaming, prompt injection, or malicious input. Those need separate treatment.

---

## 8. Sources

The instrument's criteria derive from the following. Individual criterion-to-source mappings appear in the crosswalk in Section 4 of the tool.

1. **NIST AI 100-1** — *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*, National Institute of Standards and Technology, 2023. https://airc.nist.gov/airmf-resources/airmf/
2. **NIST AI 600-1** — *AI RMF Generative Artificial Intelligence Profile*, NIST, July 2024. https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
3. **EU AI Act, Article 13** — Transparency and provision of information to deployers. Regulation (EU) 2024/1689. https://artificialintelligenceact.eu/article/13/
4. **EU AI Act, Article 14** — Human oversight. https://artificialintelligenceact.eu/article/14/
5. **EU AI Act, Article 50** — Transparency obligations for providers and deployers of certain AI systems. https://artificialintelligenceact.eu/article/50/
6. **Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., Suh, J., Iqbal, S., Bennett, P. N., Inkpen, K., Teevan, J., Kikin-Gil, R., & Horvitz, E. (2019).** Guidelines for Human-AI Interaction. *CHI Conference on Human Factors in Computing Systems Proceedings*, ACM. https://doi.org/10.1145/3290605.3300233 · Toolkit: https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
7. **Google People + AI Research (PAIR)** — *People + AI Guidebook*. https://pair.withgoogle.com/guidebook-v2/
8. **ISO/IEC 42001:2023** — Information technology, Artificial intelligence, Management system. https://www.iso.org/standard/42001
9. **W3C Web Content Accessibility Guidelines (WCAG) 2.2** — W3C Recommendation, 5 October 2023, republished with editorial updates 12 December 2024. https://www.w3.org/WAI/standards-guidelines/wcag/
10. **W3C Accessible Platform Architectures WG** — *Accessibility of machine learning and generative AI*. **Editor's Draft, work in progress.** Cited only for its specific findings on the inadequacy of automated alternative text and ASR captioning as standalone features. The draft states it is inappropriate to cite as other than a work in progress; treat these criteria as informed by current practice rather than by settled W3C guidance. https://w3c.github.io/ai-accessibility/
11. **Parasuraman, R. & Riley, V. (1997).** Humans and Automation: Use, Misuse, Disuse, Abuse. *Human Factors*, 39(2), 230–253. https://doi.org/10.1518/001872097778543886
12. **Mosier, K. L. & Skitka, L. J. (1996).** Human Decision Makers and Automated Decision Aids: Made for Each Other? In R. Parasuraman & M. Mouloua (eds.), *Automation and Human Performance: Theory and Applications*. Origin of the term "automation bias."

---

## 9. Version history

| Version | Date | Change |
|---|---|---|
| 1.0 | August 2026 | Initial release. 27 criteria, 7 dimensions, 3-tier risk model. |

### Change control

Criterion text, gate assignments, and thresholds are versioned together. A review scored under one version should not be compared directly against a review scored under another without noting the version. Exported reports and JSON both record the instrument version.

---

*The AI Readiness Review is offered as a working instrument, not a standard. It is intended to be adapted. If you change thresholds, gates, or criteria for your context, increment the version and say what you changed.*
