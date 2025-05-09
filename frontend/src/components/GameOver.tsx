import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => (
  <div style={{ textAlign: 'center', marginTop: 40 }}>
    <h2>GAME OVER</h2>
    <p>Final Score: {score}</p>
    <button 
      onClick={onRestart} 
      style={{ padding: '10px 20px', fontSize: '1.2em', cursor: 'pointer', borderRadius: 8, background: '#ff007f', color: 'white', border: 'none', marginTop: 16 }}
    >
      Play Again?
    </button>
  </div>
);

export default GameOver; 