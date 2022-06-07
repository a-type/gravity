import { Material, Mesh } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';

const loader = new GLTFLoader();

export type GLTFResult = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
};

export function loadGltf(path: string): Promise<any> {
  return new Promise<GLTFResult>((resolve, reject) => {
    loader.load(path, resolve as any, undefined, reject);
  });
}
