import { compose, makeSystem } from '0g';
import { Body } from '../../lib/rapier/components';
import { Player } from '../components';

const tmpMovement = {
  x: 0,
  y: 0,
  z: 0,
};
const playerControlSystem = makeSystem([Player, Body], (entity, game) => {
  const keyboard = game.globals.immediate('keyboard')!;

  if (keyboard.getKeyPressed('a')) {
    tmpMovement.x -= 1;
  }
  if (keyboard.getKeyPressed('d')) {
    tmpMovement.x += 1;
  }
  if (keyboard.getKeyPressed('w')) {
    tmpMovement.z += 1;
  }
  if (keyboard.getKeyPressed('s')) {
    tmpMovement.z -= 1;
  }

  const { value: body } = entity.get(Body);

  body.addForce(tmpMovement, true);
});

export const systems = compose(playerControlSystem);
