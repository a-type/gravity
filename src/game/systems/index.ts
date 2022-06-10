import { compose } from '0g';
import { systems as followCameraSystems } from './followCamera';
import { systems as playerControlSystems } from './playerControl';
import { systems as terrainColliderSystems } from './terrainCollider';

export const systems = compose(
  followCameraSystems,
  playerControlSystems,
  terrainColliderSystems,
);
