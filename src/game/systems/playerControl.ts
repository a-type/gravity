import { compose, makeSystem } from '0g';
import { Body } from '../../lib/rapier/components';
import { Player } from '../components';

const tmpMovement = {
  x: 0,
  y: 0,
  z: 0,
};

const FORCE = 10;

const playerControlSystem = makeSystem([Player, Body], (entity, game) => {
  const keyboard = game.globals.immediate('keyboard')!;

  tmpMovement.x = 0;
  tmpMovement.y = 0;
  tmpMovement.z = 0;

  if (keyboard.getKeyPressed('a')) {
    tmpMovement.x -= FORCE;
  }
  if (keyboard.getKeyPressed('d')) {
    tmpMovement.x += FORCE;
  }
  if (keyboard.getKeyPressed('w')) {
    tmpMovement.z += FORCE;
  }
  if (keyboard.getKeyPressed('s')) {
    tmpMovement.z -= FORCE;
  }

  const { value: body } = entity.get(Body);

  body.addForce(tmpMovement, true);
});

export const systems = compose(playerControlSystem);
