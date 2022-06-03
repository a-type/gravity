import type { TempContactManifold } from '@dimforge/rapier3d-compat';
import { EntityContact } from './types';

const contactPairCache = new WeakMap<
  TempContactManifold,
  [EntityContact, EntityContact]
>();
