import { TempContactManifold, RigidBody } from '@dimforge/rapier3d-compat';

export type EntityContact = {
  selfId: number | null;
  otherId: number | null;
  contact: TempContactManifold;
  otherBody: RigidBody;
  selfBody: RigidBody;
  id: string;
};
