import RAPIERCOMPAT from '@dimforge/rapier3d-compat';
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

export const RAPIER = RAPIERCOMPAT;
