export const root: string;
export function loadContent(base?: string): Record<string, {
  title: string;
  prerequisites: string[];
  summary: string;
  body: string;
}>;
