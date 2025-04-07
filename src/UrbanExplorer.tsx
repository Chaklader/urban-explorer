// src/UrbanExplorer.tsx
// import React from 'react'; // No longer needed with react-jsx transform
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import PlayerControls from './components/PlayerControls';
import Ground from './components/Ground';
import Buildings from './components/Buildings';

type KeyMap = { name: string; keys: string[] }[];

const keyMap: KeyMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'sprint', keys: ['Shift'] },
];

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
                <ambientLight intensity={0.5} />
                {/* Use Drei's Environment for realistic lighting */}
                <Environment preset="city" />
                {/* Physics world setup */}
                <Physics gravity={[0, -9.81, 0]}>
                    {/* Player controls component */}
                    <PlayerControls speed={5} sprintSpeed={10} />
                    <Ground /> 
                    <Buildings count={30} area={80} /> 
                    {/* Placeholder for ground and buildings (Step 3) */}
                </Physics>
            </Canvas>
        </KeyboardControls>
    );
}
