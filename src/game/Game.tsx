import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { LinearEncoding } from 'three';
import { PhysicsWorld } from '../lib/physics3d';
import { Ticker } from '../lib/tickle';
import { Camera } from './entities/Camera';
import { Ground } from './entities/Ground';
import { Player } from './entities/Player';
import { RenderPipeline } from './RenderPipeline';
import { Skybox } from './Skybox';
import { Systems } from './systems/Systems';
import { Update } from './Update';

export const Game = () => (
  <Suspense fallback={null}>
    <Canvas
    // flat
    // gl={{
    //   logarithmicDepthBuffer: false,
    //   outputEncoding: LinearEncoding,
    //   alpha: false,
    //   depth: false,
    //   stencil: false,
    //   antialias: false,
    // }}
    >
      {/* <fog args={['#000', 0, 800]} attach="fog" /> */}
      <ambientLight intensity={0.2} />
      <directionalLight intensity={2} position={[300, 100, -200]} />
      <RenderPipeline />
      <Skybox />
      <axesHelper />
      {/* <OrbitControls /> */}

      <Ticker timeScale={1} maxDelta={1} defaultPriority={Update.Default}>
        <PhysicsWorld>
          <Camera />
          <Player />
          <Ground />

          <Systems />
        </PhysicsWorld>
      </Ticker>
    </Canvas>
  </Suspense>
);
