import React from 'react';

export interface WallProps {
  id: string | number; // For React key
  x: number;
  y: number;
  width: number;
  height: number;
  // color?: string; // Could be added for variety later
}

const Wall: React.FC<WallProps> = ({ x, y, width, height }) => {
  const wallStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#555555', // Dark grey for MVP walls
    border: '1px solid #333333',
  };

  return <div style={wallStyle} aria-label="Wall"></div>;
};

export default Wall; 