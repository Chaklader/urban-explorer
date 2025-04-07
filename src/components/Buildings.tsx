import { RigidBody } from '@react-three/rapier';
import { Box, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three'; // Import THREE for Color

// Define type for building data
interface BuildingData {
    id: string;
    position: [number, number, number];
    args: [number, number, number];
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
        });
    }
    return buildings;
};

interface BuildingsProps {
    count?: number;
    area?: number;
}

export default function Buildings({ count = 20, area = 60 }: BuildingsProps) { 
    // Load the texture
    // Using a texture from Poly Haven instead
    const texture = useTexture('https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_floor_worn_001/concrete_floor_worn_001_diff_1k.jpg');

    const buildingData = useMemo(() => generateBuildingData(count, area), [count, area]);

    return (
        <group>
            {buildingData.map((building) => {
                // Clone texture for each building to set individual repetition
                const buildingTexture = texture.clone();
                // Set texture wrapping to repeat
                buildingTexture.wrapS = buildingTexture.wrapT = THREE.RepeatWrapping;
                // Set texture repetition based on building dimensions (adjust as needed)
                buildingTexture.repeat.set(building.args[0] / 4, building.args[1] / 4); // Repeat every 4 units

                return (
                    <RigidBody key={building.id} type="fixed" colliders="cuboid">
                        <Box
                            castShadow // Buildings should cast shadows
                            receiveShadow // Buildings can receive shadows
                            position={building.position}
                            args={building.args}
                        >
                            {/* Apply the texture */} 
                            <meshStandardMaterial map={buildingTexture} />
                            {/* <meshStandardMaterial color={new THREE.Color(Math.random() * 0xffffff)} /> */}
                        </Box>
                    </RigidBody>
                );
            })}
        </group>
    );
}
