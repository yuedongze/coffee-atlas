# Editing atlas cards

This directory is the source of truth for the cards on the live atlas. Each card has one Markdown file:

- `green-potential/` — seeds, origins, processing, physical attributes, evaluation
- `roast-transformation/` — roasters, phases, heat, profiles, resting
- `sensory-expression/` — brewing, sensory coordinates, comparisons
- `experiment-and-repeat/` — experiments, records, production

Start with [Coffee seed](green-potential/seed-to-cup.md), [Ethiopia](green-potential/ethiopia.md), or [Profile building](roast-transformation/baseline.md). Some filenames retain earlier names to preserve saved progress and shared topic links. Find a card by searching for its title.

## File format

```markdown
---
title: "Coffee seed"
prerequisites: []
---

Write the short introduction here. This also supplies the searchable summary.

## Why it matters

Write paragraphs, **bold text**, *emphasis*, or [links](https://example.com).

## A small experiment

1. Describe the first step.
2. Describe what to observe.

## A misconception to question

> A claim you want the reader to question.

## Further reading

- [Source title](https://example.com)
```

Keep the opening `---` block. Quote titles, especially titles containing colons. `prerequisites` lists existing stable topic IDs, such as `["processing", "moisture"]`; these generate the “Connect the concepts” buttons. Use `[]` if there are none.

Everything before the first `##` heading is the summary. Everything after it is the detailed article. You can rename, add, remove, and reorder article sections freely. Keep at least one `##` section. Standard Markdown headings, lists, links, quotes, images, and code blocks work. Raw HTML is not rendered. Link to another card with `[#title](#topic-id)`, for example `[Moisture content](#moisture)`.

## Preview and publish

From the `coffee-atlas` repository:

1. Run `npm ci` once after downloading the repository.
2. Run `npm run dev` and open the printed local URL.
3. Edit and save a card. The preview reloads automatically.
4. Run `npm run content:check` to validate all cards, then `npm run build` before publishing.
5. Commit and push to `main`. GitHub Actions rebuilds and publishes Pages automatically.

You can also edit a Markdown file directly in GitHub and commit the edit to `main`. This triggers the same deployment. Nothing changes on the live site until a successful deployment.

## What stays in code

`src/topic-map.json` maps stable IDs to Markdown paths and controls section membership, core status, and ordering. `src/topics.ts` controls geometry, topic numbering, clusters, and the beginner path. Content edits do not require changing either file. To add a new card, add its Markdown file, register it in `topic-map.json`, and place it in the appropriate cluster or core route in `topics.ts`.

Do not rename IDs to change display titles: edit `title` instead. IDs preserve saved progress and shared links. Adding a Markdown file alone does not add a new map node.

The older `../content/` directory in the parent workspace is a separate, unconnected writing archive. It is not deployed. Bring finished writing into these card files when ready; existing drafts have not been overwritten.
