import React from 'react';

interface MagicButtonProps {
  position: {
    x: number;
    y: number;
  };
  onClick: () => void;
  isTeleporting: boolean;
}

// Corresponds to PRE_TELEPORT_DURATION in App.tsx
const TELEPORT_ANIMATION_DURATION_S = 0.25; // seconds

const MagicButton: React.FC<MagicButtonProps> = ({ position, onClick, isTeleporting }) => {
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '60px',
    height: '60px',
    backgroundColor: '#ff007f',
    border: '2px solid #cc0066',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    userSelect: 'none',
    // Apply shrink transform if isTeleporting is true
    transform: isTeleporting ? 'scale(0)' : 'scale(1)',
    // Smooth transition for transform (for shrink/grow) and background color (for click)
    transition: `transform ${TELEPORT_ANIMATION_DURATION_S}s ease-in-out, background-color 0.1s ease-out`,
    opacity: isTeleporting ? 0 : 1, // Fade out when teleporting
  };

  // Visual feedback for mousedown (only if not teleporting)
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTeleporting) return;
    (e.target as HTMLButtonElement).style.transform = 'scale(0.95)'; // Will be overridden if isTeleporting
    (e.target as HTMLButtonElement).style.backgroundColor = '#e60073';
  };

  // Reset visual feedback and call onClick (only if not teleporting)
  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTeleporting) return;
    (e.target as HTMLButtonElement).style.transform = 'scale(1)'; // Will be overridden if isTeleporting
    (e.target as HTMLButtonElement).style.backgroundColor = '#ff007f';
    onClick();
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <button
      style={buttonStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={(e) => { 
        if (isTeleporting) e.stopPropagation(); // Prevent click during teleport animation
        // Actual click logic is in onMouseUp
      }}
      draggable="false"
      onDragStart={handleDragStart}
      aria-label="Magic Button"
      // Disable button during teleport to prevent multiple rapid clicks queuing up issues
      disabled={isTeleporting} 
    >
      ✨
    </button>
  );
};

export default MagicButton; 