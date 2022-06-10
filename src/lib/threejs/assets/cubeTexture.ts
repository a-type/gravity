import { CubeTextureLoader, Material, Mesh } from 'three';

const loader = new CubeTextureLoader();

export function loadCubeTexture(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    loader.load(
      [
        `${path}/right.png`,
        `${path}/left.png`,
        `${path}/top.png`,
        `${path}/bottom.png`,
        `${path}/front.png`,
        `${path}/back.png`,
      ],
      resolve as any,
      undefined,
      reject,
    );
  });
}
