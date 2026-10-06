import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

export const root = fileURLToPath(new URL('../', import.meta.url));
export function loadContent(base = root) {
  const map = JSON.parse(fs.readFileSync(path.join(base, 'src/topic-map.json'), 'utf8'));
  const ids = new Set(map.map(t => t.id));
  if (ids.size !== map.length) throw new Error('Duplicate ID in topic-map.json');
  const result = {};
  for (const entry of map) {
    const filename = path.join(base, 'content', entry.file);
    try {
      const { data, content } = matter(fs.readFileSync(filename, 'utf8'));
      if (typeof data.title !== 'string' || !data.title.trim()) throw new Error('A nonempty title is required');
      if (!Array.isArray(data.prerequisites) || data.prerequisites.some(id => typeof id !== 'string' || !ids.has(id))) throw new Error('prerequisites must be an array of existing topic IDs');
      const boundary = content.search(/^## /m);
      if (boundary < 0) throw new Error('Add a summary followed by at least one ## section');
      const summary = content.slice(0, boundary).trim();
      const body = content.slice(boundary).trim();
      if (!summary) throw new Error('Add a summary before the first ## section');
      result[entry.id] = { title: data.title, prerequisites: data.prerequisites, summary, body };
    } catch (error) {
      throw new Error(`${entry.file}: ${error.message}`);
    }
  }
  return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Validated ${Object.keys(loadContent()).length} Markdown cards.`);
}
