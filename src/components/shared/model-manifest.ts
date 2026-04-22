import { useGLTF } from '@react-three/drei';

const modules = import.meta.glob('../../assets/models/*.glb', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const MODEL_URLS: string[] = Object.values(modules);

export const MODELS_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const name = path.split('/').pop()!.replace(/\.glb$/, '');
    return [name, url];
  }),
);

MODEL_URLS.forEach((url) => useGLTF.preload(url));
