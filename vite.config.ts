import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { loadContent, root } from './scripts/content.mjs';

function atlasContent(): Plugin {
  const id = '\0virtual:atlas-content';
  return {
    name: 'atlas-markdown-content',
    resolveId(source) { if (source === 'virtual:atlas-content') return id; },
    load(source) {
      if (source === id) return `export default ${JSON.stringify(loadContent())};`;
    },
    configureServer(server) { server.watcher.add(`${root}content`); },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(`${root}content/`) || file.endsWith('/src/topic-map.json')) {
        loadContent(); // Report authoring errors with the card filename.
        const module = server.moduleGraph.getModuleById(id);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}
export default defineConfig({ plugins: [react(), atlasContent()], base: '/coffee-atlas/' });
