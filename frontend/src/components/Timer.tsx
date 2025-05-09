import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPlaying: boolean; // To control if the timer is active and ticking
  resetKey: number; // A key to force reset the timer externally
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPlaying, resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset timer when resetKey changes or when initially set to play
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 0.05; // Update every 50ms for smoother bar
          if (newTime <= 0) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 50);
    } else if (!isPlaying || timeLeft <= 0) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeLeft, onTimeUp, duration]); // Removed resetKey from here, handled by separate useEffect

  const percentage = (timeLeft / duration) * 100;
  let barColor = '#4caf50'; // Green
  if (timeLeft <= duration * 0.25) { // Last 25% (0.75s for 3s duration)
    barColor = '#f44336'; // Red
  } else if (timeLeft <= duration * 0.5) { // Below 50% (1.5s for 3s duration)
    barColor = '#ffeb3b'; // Yellow
  }

  const timerBarStyle: React.CSSProperties = {
    width: '100%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #ccc',
  };

  const timerProgressStyle: React.CSSProperties = {
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: barColor,
    transition: 'width 0.05s linear, background-color 0.2s linear', // Smooth width and color change
  };

  return (
    <div style={{ width: '200px', margin: '0 auto' }}> {/* Container for centering timer bar */}
      <div style={timerBarStyle}>
        <div style={timerProgressStyle}></div>
      </div>
      {/* Optional: Display numeric time left for debugging or finer detail */}
      {/* <div style={{ fontSize: '0.8em', marginTop: '2px' }}>{timeLeft.toFixed(1)}s</div> */}
    </div>
  );
};

export default Timer; 