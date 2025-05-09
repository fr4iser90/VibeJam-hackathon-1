# MVP Tasks for The Elusive Magic Button

## 1. Project Setup & Basic Structure
- [X] Initialize React + TypeScript project with Vite (`quick-start` script)
- [X] Create basic folder structure within `frontend/src` (e.g., `components`, `assets`, `hooks`, `styles`, `gameLogic`)
- [X] Basic App component (`App.tsx`) cleanup and setup.

## 2. UI Layout & Core Display Elements
- [X] Implement basic UI layout (Game Area, Score, Lives, Timer placeholder).
- [X] **Score Display:**
    - [X] State for score.
    - [X] Display current score.
- [X] **Lives Display:**
    - [X] State for lives.
    - [X] Display current lives (e.g., as text or heart icons).
- [X] **Timer Display:**
    - [X] Placeholder for timer visual (e.g., text countdown or simple bar) -> Implemented as Timer component.

## 3. Magic Button Implementation (Core)
- [X] Create `MagicButton` component.
- [X] **Appearance:** Basic visual styling (round, distinct color).
- [X] **State:** Position (x, y) (Managed in `App.tsx`).
- [X] **Random Placement:** Function to set random initial position within game area (In `App.tsx`).
- [X] **Click Handling:**
    - [X] Detect successful click.
    - [X] Basic visual feedback on mousedown/mouseup (e.g., slight scale change or color change).
    - [X] Basic auditory feedback on click (placeholder sound).
- [X] **Teleportation Logic:**
    - [X] Function to teleport button to a new random valid position (In `App.tsx`).
    - [X] Basic pre-teleport visual cue (e.g., quick shrink/spin).

## 4. Timer Implementation (Core)
- [X] Create `Timer` component / logic.
- [X] **State:** Current time remaining (e.g., 3 seconds) (Managed in `Timer.tsx`).
- [X] **Countdown Logic:** Decrease time every tick (In `Timer.tsx`).
- [X] **Visual Representation:** Update timer display (Progress bar in `Timer.tsx`).
- [X] **Expiry Logic:**
    - [X] Action on timer reaching zero (trigger button teleport, life loss) (In `App.tsx`).
    - [X] Basic auditory feedback on timer expiry (placeholder sound).
- [X] Reset timer logic (In `App.tsx` via `resetKey` prop for `Timer.tsx`).

## 5. Lives System (Core)
- [X] **Life Loss Logic:**
    - [X] Decrement life when timer expires.
    - [X] Basic visual feedback for losing a life (e.g., update lives display, grey out a heart) (Implicitly done by state update).
    - [X] Basic auditory feedback for losing a life (placeholder sound, distinct from timer expiry).
- [X] **Game Over Condition:** Check when lives reach 0 (In `App.tsx`).

## 6. Scoring System (Core)
- [X] **Score Increment:** Increase score on successful button click.

## 7. Labyrinth (Walls) Generation (Core MVP)
- [X] Create `Wall` component(s).
- [X] **Wall Data Structure:** Store wall positions and dimensions (In `App.tsx` state, using `WallProps`).
- [X] **Wall Generation Logic (`generateWalls` function):**
    - [X] Target: 2-4 simple rectangular walls.
    - [X] Input: Button position, mouse cursor position (for path validation).
    - [X] Output: Array of wall objects (updates state in `App.tsx`).
- [X] **Path Validation (BFS/DFS - simplified for grid):**
    - [X] Represent game area as a coarse grid.
    - [X] Implement BFS or DFS to check path from mouse cell to button cell, avoiding wall cells.
    - [X] Ensure wall placement always leaves a navigable path.
- [X] **Rendering Walls:** Display walls based on generated data.
- [X] **Clearing Walls:** Logic to remove old walls before generating new ones (implicit in `setWalls([])` or by overwriting).
- [X] Integrate wall generation/clearing with button teleportation.

## 8. Game Loop & State Management
- [X] **Game State:**
    - [X] Manage overall game state (e.g., `pre-game`, `playing`, `game-over`).
    - [X] Initial game state setup.
- [X] **Start Game Logic:**
    - [X] From a "Start Game" screen/button (as per Gameplay Loop Step 0).
    - [X] Initialize score, lives, button, walls, timer.
- [X] **Game Over Sequence:**
    - [X] Stop game action (Implicit via `gameState`).
    - [X] Display "Game Over" message.
    - [X] Display final score.
    - [X] Basic auditory feedback for game over (placeholder sound).
- [X] **"Play Again?" Functionality:**
    - [X] Button to restart the game.
    - [X] Reset all relevant game states (score, lives, button position, walls, timer).

## 9. Sound Placeholders
- [X] Basic function to play sounds (Web Audio API in `soundUtils.ts`).
- [X] Placeholder sound files (or use web audio to generate simple beeps if files are an issue initially) for:
    - [X] Button click success.
    - [X] Button teleport.
    - [X] Timer expiry.
    - [X] Losing a life.
    - [X] Game Over.

## 10. Styling & Polish (MVP Basic)
- [X] Basic CSS for game area.
- [X] Basic styling for button, walls, UI text elements.

## Post-MVP (From Detailed Plan Section 7 & 8 - Not for initial build)
- [ ] Advanced button animations & taunts.
- [ ] Advanced wall aesthetics & animations.
- [ ] Funny on-screen messages.
- [ ] Detailed sound design & background music.
- [ ] Power-ups.
- [ ] Increasing difficulty.
- [ ] Refined UI styling. 