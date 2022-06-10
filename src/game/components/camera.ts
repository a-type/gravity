import { Component, State } from '0g';
import { Object3D } from 'three';

export class FollowCameraTarget extends Component(() => ({})) {}

export class FollowCamera extends Component(() => ({})) {}

export class FollowCameraTargetRef extends State(() => ({
  target: null as null | Object3D,
})) {}
