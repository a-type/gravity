import { Texture, TextureLoader } from 'three';

const loader = new TextureLoader();

export async function loadHeightmap(path: string): Promise<any> {
  const texture = await new Promise<Texture>((resolve, reject) => {
    loader.load(path, resolve, undefined, reject);
  });
  const canvas = document.createElement('canvas');
  canvas.width = texture.image.width;
  canvas.height = texture.image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(texture.image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const heights = new Float32Array(data.length / 4);
  for (let i = 0; i < data.length; i += 4) {
    const total = data[i] + data[i + 1] + data[i + 2];
    heights[i / 4] = total / 12;
  }

  return {
    texture,
    heights,
  };
}
