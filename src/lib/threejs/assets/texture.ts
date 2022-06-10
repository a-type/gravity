import { TextureLoader } from 'three';

const loader = new TextureLoader();

export function loadTexture(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve as any, undefined, reject);
  });
}
