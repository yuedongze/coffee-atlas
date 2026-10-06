import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadContent } from './content.mjs';

test('authoring preserves Markdown and reports actionable errors', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-content-'));
  try {
    fs.mkdirSync(path.join(root, 'src'));
    fs.mkdirSync(path.join(root, 'content'));
    const map = [{id:'example',file:'example.md'}];
    fs.writeFileSync(path.join(root,'src/topic-map.json'),JSON.stringify(map));
    const card = path.join(root,'content/example.md');
    const valid = '---\ntitle: "A title: with punctuation"\nprerequisites: []\n---\n\nA **bold** summary.\n\n## Custom section\n\n- A list\n- [A link](https://example.com)\n';
    fs.writeFileSync(card,valid);
    const result = loadContent(root).example;
    assert.equal(result.title,'A title: with punctuation');
    assert.equal(result.summary,'A **bold** summary.');
    assert.match(result.body,/## Custom section/);
    assert.match(result.body,/\[A link\]/);
    fs.writeFileSync(card,valid.replace('prerequisites: []','prerequisites: [missing]'));
    assert.throws(()=>loadContent(root),/example.md: prerequisites/);
    fs.writeFileSync(card,valid.replace('A **bold** summary.',''));
    assert.throws(()=>loadContent(root),/example.md: Add a summary/);
    fs.writeFileSync(card,valid.replace('title: "A title: with punctuation"','title: ""'));
    assert.throws(()=>loadContent(root),/example.md: A nonempty title/);
    fs.unlinkSync(card);
    assert.throws(()=>loadContent(root),/example.md:/);
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
