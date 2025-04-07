import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three'; // Import THREE for Color

// Define type for building data
interface BuildingData {
    id: string;
    position: [number, number, number];
    args: [number, number, number];
    color: THREE.Color;
}

// Simple procedural generation for building layout
const generateBuildingData = (count = 10, area = 50): BuildingData[] => {
    const buildings: BuildingData[] = [];
    for (let i = 0; i < count; i++) {
        const width = Math.random() * 5 + 3; // Random width
        const depth = Math.random() * 5 + 3; // Random depth
        const height = Math.random() * 15 + 5; // Random height
        const x = (Math.random() - 0.5) * area; // Random position within area
        const z = (Math.random() - 0.5) * area;
        buildings.push({
            id: `building_${i}`,
            position: [x, height / 2 - 0.5, z], // Position center at ground level
            args: [width, height, depth], // Width, Height, Depth
            color: new THREE.Color(Math.random() * 0xffffff) // Add random color here
        });
    }
    return buildings;
};

interface BuildingsProps {
    count?: number;
    area?: number;
}

export default function Buildings({ count = 20, area = 60 }: BuildingsProps) { 
    const buildingData = useMemo(() => generateBuildingData(count, area), [count, area]);

    return (
        <group>
            {buildingData.map((building) => {
                return (
                    <RigidBody key={building.id} type="fixed" colliders="cuboid">
                        <Box
                            castShadow // Buildings should cast shadows
                            receiveShadow // Buildings can receive shadows
                            position={building.position}
                            args={building.args}
                        >
                            {/* Apply the random color */}
                            <meshStandardMaterial color={building.color} /> 
                        </Box>
                    </RigidBody>
                );
            })}
        </group>
    );
}
