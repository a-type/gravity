import { Game } from '0g';
import { RAPIER } from '../lib/rapier/rapier';
import * as rapierComponents from '../lib/rapier/components';
import { systems as rapierSystems } from '../lib/rapier/systems';
import { Pointer, pointer } from '../lib/input/pointer';
import { Keyboard, keyboard } from '../lib/input/keyboard';
import {
  loaders as threeLoaders,
  systems as threeSystems,
  components as threeComponents,
} from '../lib/threejs';
import { Scene, WebGLRenderer } from 'three';
import * as gameComponents from './components';
import { systems as gameSystems } from './systems';
import { characterPrefab } from './prefabs/character';
import { cameraPrefab } from './prefabs/camera';
import { worldPrefab } from './prefabs/world';
import { pointLightPrefab } from './prefabs/pointLight';

declare module '0g' {
  interface Globals {
    pointer: Pointer;
    keyboard: Keyboard;
    scene: Scene;
    renderer: WebGLRenderer;
  }

  interface AssetLoaders {
    '.gltf': typeof threeLoaders['loadGltf'];
  }
}

export const game = new Game({
  components: [
    ...Object.values(rapierComponents),
    ...Object.values(threeComponents),
    ...Object.values(gameComponents),
  ],
  systems: [/*rapierSystems*/ threeSystems, gameSystems],
  assetLoaders: {
    '.gltf': threeLoaders.loadGltf,
  },
});
(window as any).game = game;

(RAPIER as any).init().then(() => {
  game.globals.resolve('Rapier', RAPIER);
});

game.globals.resolve('keyboard', keyboard);
game.globals.resolve('pointer', pointer);

game.on('stepComplete', keyboard.frame);
game.on('stepComplete', pointer.frame);

const scene = new Scene();
game.globals.resolve('scene', scene);
(window as any).scene = scene;

const renderer = new WebGLRenderer();
game.globals.resolve('renderer', renderer);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game')!.appendChild(renderer.domElement);

worldPrefab(game);
cameraPrefab(game);
characterPrefab(game);
pointLightPrefab(game);

const loop = () => {
  requestAnimationFrame(loop);
  game.step(1000 / 60);
};

loop();
