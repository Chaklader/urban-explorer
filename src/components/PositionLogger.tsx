import { useEffect } from 'react';
import usePlayerStore from '../stores/playerStore';

export default function PositionLogger() {
  // Select the position state from the store
  const position = usePlayerStore((state) => state.position);

  // Log the position whenever it changes
  useEffect(() => {
    console.log(
      `Store Log - Player Pos: x: ${position[0].toFixed(2)}, y: ${position[1].toFixed(2)}, z: ${position[2].toFixed(2)}`
    );
  }, [position]); // Re-run effect only when position changes

  // This component doesn't render anything visible
  return null;
}
