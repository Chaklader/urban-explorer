// src/UrbanExplorer.tsx
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import PlayerControls from './components/PlayerControls';
import Ground from './components/Ground';
import Buildings from './components/Buildings';
import PositionLogger from './components/PositionLogger';

type KeyMap = { name: string; keys: string[] }[];

const keyMap: KeyMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'sprint', keys: ['Shift'] },
];

const BOUNDARY_SIZE = 100;

export default function UrbanExplorer() {
    return (
        <KeyboardControls map={keyMap}>
            <Canvas
                shadows
                camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 1.6, 5],
                }}
            >
                {/* Static Daytime Lighting */}
                <ambientLight intensity={0.8} />
                <directionalLight
                    castShadow
                    position={[50, 80, 30]}
                    intensity={1.5}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={150}
                    shadow-camera-left={-80}
                    shadow-camera-right={80}
                    shadow-camera-top={80}
                    shadow-camera-bottom={-80}
                />
                {/* Use Drei's Environment for realistic lighting */}
                <Environment preset="city" />
                {/* Physics world setup */}
                <Physics gravity={[0, -9.81, 0]}>
                    {/* Player controls component with boundary settings */}
                    <PlayerControls speed={20} sprintSpeed={40} boundarySize={BOUNDARY_SIZE} />
                    <Ground />
                    <Buildings count={30} area={BOUNDARY_SIZE} />
                </Physics>

                {/* Add PositionLogger for debugging */}
                <PositionLogger />
            </Canvas>
        </KeyboardControls>
    );
}
