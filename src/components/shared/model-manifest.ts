const modules = import.meta.glob('../../assets/models/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const MODEL_URLS: string[] = Object.values(modules);
