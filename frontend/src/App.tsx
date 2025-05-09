import { useState, useEffect, useRef } from 'react';
import MagicButton from './components/MagicButton';
import Timer from './components/Timer';
import { playSound } from './gameLogic/soundUtils';
import { generateMaze } from './gameLogic/maze';
import type { MazeGrid } from './gameLogic/maze';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BUTTON_DIAMETER = 60;
const HEADER_HEIGHT = 50;
const PLAYABLE_HEIGHT = GAME_HEIGHT - HEADER_HEIGHT;
const PRE_TELEPORT_DURATION = 250;
const INITIAL_TIMER_DURATION = 15;
const TIMER_DECREASE_STEP = 3;
const TIMER_DECREASE_EVERY = 5;
const MIN_TIMER_DURATION = 2;
const INITIAL_LIVES = 3;

const DEFAULT_GRID_SIZE = 10;
const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 40;

function App() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameState, setGameState] = useState<'pre-game' | 'waiting-for-move' | 'playing' | 'game-over'>('pre-game');
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [maze, setMaze] = useState<MazeGrid | null>(null);
  const [buttonCell, setButtonCell] = useState<{ row: number; col: number } | null>(null);
  const [isButtonTeleporting, setIsButtonTeleporting] = useState(false);
  const [mouseCell, setMouseCell] = useState<{ row: number; col: number } | null>(null);
  const gamePlayAreaRef = useRef<HTMLDivElement>(null);
  const [currentTimerDuration, setCurrentTimerDuration] = useState(INITIAL_TIMER_DURATION);

  // Cell size in px
  const cellWidth = GAME_WIDTH / gridSize;
  const cellHeight = PLAYABLE_HEIGHT / gridSize;

  // --- Maze Generation ---
  const createMazeAndButton = () => {
    const newMaze = generateMaze(gridSize, gridSize);
    // Place button in a random cell
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    setMaze(newMaze);
    setButtonCell({ row, col });
  };

  // --- Mouse Tracking (grid cell, wall-respecting) ---
  useEffect(() => {
    const area = gamePlayAreaRef.current;
    if (!area || (gameState !== 'playing' && gameState !== 'waiting-for-move') || !maze) return;

    // Initialize mouse cell at game start
    if (!mouseCell) {
      setMouseCell({ row: 0, col: 0 });
    }

    let lastCell = mouseCell || { row: 0, col: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = area.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
      if (!lastCell) return;
      // Only allow moving to adjacent cell
      const dRow = row - lastCell.row;
      const dCol = col - lastCell.col;
      if (Math.abs(dRow) + Math.abs(dCol) !== 1) return; // Only allow cardinal moves
      // Check for wall
      const fromCell = maze[lastCell.row][lastCell.col];
      let canMove = false;
      if (dRow === -1 && !fromCell.n) canMove = true; // Move north
      if (dRow === 1 && !fromCell.s) canMove = true; // Move south
      if (dCol === -1 && !fromCell.w) canMove = true; // Move west
      if (dCol === 1 && !fromCell.e) canMove = true; // Move east
      if (canMove) {
        setMouseCell({ row, col });
        lastCell = { row, col };
        // If waiting for move, start the timer and switch to playing
        if (gameState === 'waiting-for-move') {
          setGameState('playing');
          setTimerResetKey(prev => prev + 1);
        }
      }
    };
    area.addEventListener('mousemove', handleMouseMove);
    return () => area.removeEventListener('mousemove', handleMouseMove);
  }, [gameState, gridSize, cellWidth, cellHeight, maze, mouseCell]);

  // --- Game Start & Teleport ---
  const startGame = () => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameState('waiting-for-move');
    setIsButtonTeleporting(false);
    setTimerResetKey(prev => prev + 1); // Will be used after first move
    createMazeAndButton();
    setMouseCell({ row: 0, col: 0 }); // Initialize mouse cell at start
    setCurrentTimerDuration(INITIAL_TIMER_DURATION);
  };

  const teleportButton = () => {
    setIsButtonTeleporting(true);
    setTimeout(() => {
      createMazeAndButton();
      setIsButtonTeleporting(false);
      playSound('teleport');
      setGameState('waiting-for-move'); // Wait for first move after teleport
    }, PRE_TELEPORT_DURATION);
  };

  // --- Timer, Score, Lives ---
  const loseLife = () => {
    playSound('lose_life');
    setLives(prevLives => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        setGameState('game-over');
        playSound('game_over');
      }
      return newLives;
    });
  };

  const handleTimeUp = () => {
    if (gameState !== 'playing') return;
    playSound('timer_expiry');
    loseLife();
    if (lives > 1) {
      teleportButton();
      // Timer will start after first move post-teleport
    }
  };

  // --- Button Click ---
  const handleButtonClick = () => {
    if (isButtonTeleporting || !buttonCell || !mouseCell) return;
    // Only allow click if mouse is in the same cell as the button
    if (mouseCell.row === buttonCell.row && mouseCell.col === buttonCell.col) {
      playSound('click');
      setScore(prev => prev + 10);
      setCurrentTimerDuration(prev => {
        const decrease = Math.floor(prev / TIMER_DECREASE_EVERY) * TIMER_DECREASE_STEP;
        const newDuration = Math.max(MIN_TIMER_DURATION, INITIAL_TIMER_DURATION - decrease);
        return newDuration;
      });
      teleportButton();
      // Timer will start after first move post-teleport
    }
  };

  // --- Reset game if grid size changes ---
  useEffect(() => {
    setGameState('pre-game');
    setMaze(null);
    setButtonCell(null);
    setMouseCell(null);
  }, [gridSize]);

  // --- Render Maze Walls as divs ---
  const renderMazeWalls = (): React.ReactElement[] | null => {
    if (!maze) return null;
    const walls: React.ReactElement[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = maze[row][col];
        const x = col * cellWidth;
        const y = row * cellHeight;
        // North wall
        if (cell.n) {
          walls.push(
            <div key={`n-${row}-${col}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: cellWidth,
                height: 2,
                background: '#333',
                zIndex: 2,
              }} />
          );
        }
        // West wall
        if (cell.w) {
          walls.push(
            <div key={`w-${row}-${col}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 2,
                height: cellHeight,
                background: '#333',
                zIndex: 2,
              }} />
          );
        }
        // South wall (bottom row only)
        if (row === gridSize - 1 && cell.s) {
          walls.push(
            <div key={`s-${row}-${col}`}
              style={{
                position: 'absolute',
                left: x,
                top: y + cellHeight - 2,
                width: cellWidth,
                height: 2,
                background: '#333',
                zIndex: 2,
              }} />
          );
        }
        // East wall (right col only)
        if (col === gridSize - 1 && cell.e) {
          walls.push(
            <div key={`e-${row}-${col}`}
              style={{
                position: 'absolute',
                left: x + cellWidth - 2,
                top: y,
                width: 2,
                height: cellHeight,
                background: '#333',
                zIndex: 2,
              }} />
          );
        }
      }
    }
    return walls;
  };

  // --- Button Position (centered in cell) ---
  const buttonPixelPosition = buttonCell
    ? {
        x: buttonCell.col * cellWidth + cellWidth / 2 - BUTTON_DIAMETER / 2,
        y: buttonCell.row * cellHeight + cellHeight / 2 - BUTTON_DIAMETER / 2,
      }
    : { x: 0, y: 0 };

  // --- Highlight Mouse Cell (improved visibility & fun cursor) ---
  const renderMouseCellHighlight = () => {
    if (!mouseCell) return null;
    return (
      <div
        style={{
          position: 'absolute',
          left: mouseCell.col * cellWidth,
          top: mouseCell.row * cellHeight,
          width: cellWidth,
          height: cellHeight,
          background: 'rgba(0, 180, 255, 0.18)', // Brighter blue
          border: '3px solid #00bfff', // Thicker, vibrant border
          borderRadius: '12px',
          boxShadow: '0 0 16px 4px #00bfff88', // Glow effect
          zIndex: 3,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'mouseCellPulse 0.5s', // Pulse on move
        }}
      >
        <span style={{ fontSize: Math.min(cellWidth, cellHeight) * 0.7, filter: 'drop-shadow(0 0 2px #fff)' }} role="img" aria-label="Cursor">🖐️</span>
      </div>
    );
  };

  // Add global CSS for pulse animation (inject into head if not present)
  if (typeof window !== 'undefined' && !document.getElementById('mouseCellPulseStyle')) {
    const style = document.createElement('style');
    style.id = 'mouseCellPulseStyle';
    style.innerHTML = `
      @keyframes mouseCellPulse {
        0% { box-shadow: 0 0 24px 8px #00bfffcc; }
        100% { box-shadow: 0 0 16px 4px #00bfff88; }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div className="App">
      <h1>The Elusive Magic Button</h1>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="grid-size-slider">Maze Size: </label>
        <input
          id="grid-size-slider"
          type="range"
          min={MIN_GRID_SIZE}
          max={MAX_GRID_SIZE}
          value={gridSize}
          onChange={e => setGridSize(Number(e.target.value))}
          style={{ verticalAlign: 'middle' }}
        />
        <span style={{ marginLeft: 8 }}>{gridSize} x {gridSize}</span>
      </div>

      {gameState === 'pre-game' && (
        <StartScreen onStart={startGame}>
          <div>Click the button to start playing!<br/>Navigate the maze with your mouse and catch the Magic Button.</div>
        </StartScreen>
      )}

      {gameState === 'playing' || gameState === 'waiting-for-move' ? (
        <div className="game-container" style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}>
          <div className="game-header" style={{ height: `${HEADER_HEIGHT}px`}}>
            <div className="lives">Lives: {lives} ❤️</div>
            <div className="score">Score: {score}</div>
            <div className="timer">
              <Timer 
                duration={currentTimerDuration} 
                onTimeUp={handleTimeUp} 
                isPlaying={gameState === 'playing' && !isButtonTeleporting} 
                resetKey={timerResetKey} 
              />
              <div style={{ fontSize: '0.9em', color: '#555', marginTop: 2 }}>
                Timer: {currentTimerDuration.toFixed(1)}s
              </div>
            </div>
          </div>
          <div 
            className="game-play-area" 
            ref={gamePlayAreaRef} 
            style={{ 
              height: `${PLAYABLE_HEIGHT}px`, 
              width: `${GAME_WIDTH}px`,
              position: 'relative', 
              marginTop: `${HEADER_HEIGHT}px`,
              backgroundColor: '#dddddd',
              overflow: 'hidden',
            }}
          >
            {renderMazeWalls()}
            {renderMouseCellHighlight()}
            {buttonCell && (
              <MagicButton
                position={buttonPixelPosition}
                onClick={handleButtonClick}
                isTeleporting={isButtonTeleporting}
              />
            )}
          </div>
        </div>
      ) : null}
      
      {gameState === 'game-over' && (
        <GameOver score={score} onRestart={startGame} />
      )}
    </div>
  );
}

export default App;
