// src/App.tsx
// import React from 'react'; // No longer needed with react-jsx transform
import UrbanExplorer from './UrbanExplorer'; // Ensure this points to the renamed .tsx file
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Render the main 3D scene component */}
      <UrbanExplorer />
    </div>
  );
}

export default App;
