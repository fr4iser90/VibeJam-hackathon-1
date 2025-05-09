import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  children?: React.ReactNode;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, children }) => (
  <div style={{ textAlign: 'center', marginTop: 40 }}>
    <h1 style={{ fontSize: '2.5em', marginBottom: 16 }}>The Elusive Magic Button</h1>
    {children && <div style={{ marginBottom: 16 }}>{children}</div>}
    <button 
      onClick={onStart} 
      style={{ padding: '12px 28px', fontSize: '1.3em', cursor: 'pointer', borderRadius: 8, background: '#4caf50', color: 'white', border: 'none', marginTop: 16 }}
    >
      Start Game
    </button>
  </div>
);

export default StartScreen; 