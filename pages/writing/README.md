# Writing — how to publish a post

Articles live in `pages/writing/`. The index is `pages/writing.html`.

## Pick a template

| Template | Use it for | Length |
|---|---|---|
| `_template-perspective.html` | Taking a position ("Accessibility is a strategy problem") | 4–7 min |
| `_template-field-notes.html` | Lessons from a real project: challenge → what worked → results → reflection | 5–8 min |
| `_template-playbook.html` | A repeatable method others can run ("How I run a 90-minute alignment workshop") | 4–6 min |

Finished examples: `accessibility-invisible-users.html` (perspective), `exit-flow-retention.html` and `edtech-research-challenges.html` (field notes), `ai-compliance-playbook.html` (playbook).

## Every article opens with the same skim layer

Readers (peers, hiring managers, recruiters) should get the point without scrolling:

1. **Eyebrow**: format · topic
2. **Headline**: state the argument or outcome, not the subject
3. **Dek**: one or two sentences on why it matters
4. **Meta row**: published date, reading time, topic, who it's best for
5. **The short version**: a one-line lead plus 3–4 takeaways. Someone who stops here should still get the value.
6. **In this article**: built automatically from the body's `<h2>`s (appears when there are 3 or more)

Reading time is calculated by `js/main.js` from the body's word count (238 wpm). The value typed into the HTML is only the no-JS fallback. Open the page once and copy the real number into the fallback and the index listing.

## Drafts

Files named `draft-*.html` are unpublished. They have a visible "Draft" banner and a `noindex` tag, and they aren't listed on `writing.html`. Search for `TODO(Joseph)` to find the spots that need your input (usually numbers or a reflection).

To publish a draft, rename it without the `draft-` prefix, update `canonical` and `og:url` to match, delete the `<p class="draft-banner">` line, set the published date (replacing "Draft"), then follow the checklist below.

## Publishing checklist

1. Copy a template to `pages/writing/<slug>.html` (lowercase, hyphens).
2. **Delete the `<meta name="robots" content="noindex">` line.**
3. Replace every `[bracketed]` value, including `canonical`, `og:url`, and `article:published_time`.
4. Search the file for `[` to confirm nothing is left.
5. Add an `<li class="post-list__item">` to the top of the list in `pages/writing.html`. Set `data-topics` and, for a new topic, add a matching filter button.
6. Optional: add a 1200×630 image to `images/writing/` and uncomment `og:image` for better LinkedIn previews.

## Voice

- Lead with ownership: "I ran the workshop", not "a workshop was held".
- Quantify at the feature level. Delete a stat rather than invent one.
- Include a reflection ("What I'd do differently"). It signals seniority.
- Call out accessibility wherever it shaped a decision.
