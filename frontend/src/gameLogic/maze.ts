// Maze generation using recursive backtracking
// Each cell has walls: { n: boolean, s: boolean, e: boolean, w: boolean }

export interface MazeCell {
  n: boolean;
  s: boolean;
  e: boolean;
  w: boolean;
}

export type MazeGrid = MazeCell[][];

export function generateMaze(rows: number, cols: number): MazeGrid {
  // Initialize grid with all walls
  const grid: MazeGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ n: true, s: true, e: true, w: true }))
  );
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function carve(row: number, col: number) {
    visited[row][col] = true;
    const directions = shuffle([
      { dr: -1, dc: 0, dir: 'n', opp: 's' },
      { dr: 1, dc: 0, dir: 's', opp: 'n' },
      { dr: 0, dc: 1, dir: 'e', opp: 'w' },
      { dr: 0, dc: -1, dir: 'w', opp: 'e' },
    ]);
    for (const { dr, dc, dir, opp } of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        grid[row][col][dir as keyof MazeCell] = false;
        grid[nr][nc][opp as keyof MazeCell] = false;
        carve(nr, nc);
      }
    }
  }

  // Start from a random cell
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  carve(startRow, startCol);

  return grid;
} 