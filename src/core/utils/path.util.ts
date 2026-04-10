import path from 'node:path';

export const resolveFromRoot = (...segments: string[]): string =>
  path.resolve(process.cwd(), ...segments);

