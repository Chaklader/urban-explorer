// src/UrbanExplorer.tsx
// import React from 'react'; // No longer needed with react-jsx transform
import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import PlayerControls from './components/PlayerControls';
import Ground from './components/Ground';
import Buildings from './components/Buildings';
import { useRef } from 'react';
import * as THREE from 'three';

type KeyMap = { name: string; keys: string[] }[];

const keyMap: KeyMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'sprint', keys: ['Shift'] },
];

// Sun component to handle animation
function Sun() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    const ambientRef = useRef<THREE.AmbientLight>(null!);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const cycleSpeed = 0.1;
        const angle = (time * cycleSpeed) % (2 * Math.PI);

        const sunDistance = 50;
        lightRef.current.position.set(
            Math.sin(angle) * sunDistance,
            Math.cos(angle) * sunDistance,
            30
        );
        lightRef.current.lookAt(0, 0, 0);

        const sunHeightFactor = Math.max(0, Math.cos(angle));
        lightRef.current.intensity = THREE.MathUtils.lerp(
            0.1,
            1.5,
            sunHeightFactor
        );
        ambientRef.current.intensity = THREE.MathUtils.lerp(
            0.1,
            0.6,
            sunHeightFactor
        );

        // Optional: Adjust environment intensity if needed
        // Can also swap Environment preset based on time
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={0.5} />
            <directionalLight
                ref={lightRef}
                castShadow
                position={[50, 50, 30]}
                intensity={1.5}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={150}
                shadow-camera-left={-60}
                shadow-camera-right={60}
                shadow-camera-top={60}
                shadow-camera-bottom={-60}
            />
        </>
    );
}

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
                <Sun />
                {/* Use Drei's Environment for realistic lighting */}
                <Environment preset="city" />
                {/* Physics world setup */}
                <Physics gravity={[0, -9.81, 0]}>
                    {/* Player controls component */}
                    <PlayerControls speed={20} sprintSpeed={40} />
                    <Ground />
                    <Buildings count={30} area={80} />
                    {/* Placeholder for ground and buildings (Step 3) */}
                </Physics>
            </Canvas>
        </KeyboardControls>
    );
}
