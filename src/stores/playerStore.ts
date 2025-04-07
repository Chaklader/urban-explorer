import { create } from 'zustand';

interface PlayerState {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
}

const usePlayerStore = create<PlayerState>((set: (state: Partial<PlayerState>) => void) => ({
  // Initial position (can be adjusted as needed)
  position: [0, 5, 0], 
  
  // Action to update the position (pos type is inferred from PlayerState)
  setPosition: (pos) => set({ position: pos }),
}));

export default usePlayerStore;
