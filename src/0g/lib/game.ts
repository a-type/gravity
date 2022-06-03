import { Game } from '0g';
import { RAPIER } from './rapier/rapier';
import * as rapierComponents from './rapier/components';
import { systems as rapierSystems } from './rapier/systems';
import { Pointer, pointer } from './input/pointer';
import { Keyboard, keyboard } from './input/keyboard';

declare module '0g' {
  interface Globals {
    pointer: Pointer;
    keyboard: Keyboard;
  }
}

export const game = new Game({
  components: [...Object.values(rapierComponents)],
  systems: [rapierSystems],
});

(RAPIER as any).init().then(() => {
  game.globals.resolve('Rapier', RAPIER);
});

game.globals.resolve('keyboard', keyboard);
game.globals.resolve('pointer', pointer);

game.on('stepComplete', keyboard.frame);
game.on('stepComplete', pointer.frame);

(window as any).game = game;
