declare module 'virtual:atlas-content' {
  const content: Record<string, { title: string; prerequisites: string[]; summary: string; body: string }>;
  export default content;
}
