import { Setter } from "solid-js";

// Add a random tile (2 or 4) to an empty cell
export const addRandomTile = (
  board: number[][],
  setBoard: (board: number[][] | ((prev: number[][]) => number[][])) => void
): {row: number, col: number} | null => {
  // Find all empty cells
  const emptyCells: {row: number, col: number}[] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({row, col});
      }
    }
  }
  
  // If there are no empty cells, return null
  if (emptyCells.length === 0) {
    return null;
  }
  
  // Choose a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const {row, col} = emptyCells[randomIndex];
  
  // Place a random tile (2 or 4) in the cell
  const newValue = Math.random() < 0.9 ? 2 : 4;
  
  // Update the board
  const newBoard = board.map(rowArray => [...rowArray]);
  newBoard[row][col] = newValue;
  setBoard(newBoard);
  
  // Return the position of the new tile
  return {row, col};
};

// Check if game is over
export function checkGameOver(board: number[][]): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }
  
  // Check for possible horizontal merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }
  
  // Check for possible vertical merges
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }
  
  // If no empty cells and no possible merges
  return true;
}

// Move tiles left
export function moveLeft(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  for (let i = 0; i < 4; i++) {
    // Array to track tiles that have already been merged in this move
    const mergedTiles = [false, false, false, false];
    
    // Shift and merge tiles from left to right
    for (let j = 1; j < 4; j++) {
      if (newBoard[i][j] !== 0) {
        let k = j;
        
        // Shift the tile left until it hits another tile or the edge
        while (k > 0 && newBoard[i][k - 1] === 0) {
          newBoard[i][k - 1] = newBoard[i][k];
          newBoard[i][k] = 0;
          k--;
          moved = true;
        }
        
        // Merge identical tiles, but only if the target tile hasn't been merged in this move
        if (k > 0 && newBoard[i][k - 1] === newBoard[i][k] && !mergedTiles[k - 1]) {
          newBoard[i][k - 1] *= 2;
          newBoard[i][k] = 0;
          setScore(prev => prev + newBoard[i][k - 1]);
          // Mark this tile as already merged
          mergedTiles[k - 1] = true;
          moved = true;
        }
      }
    }
  }
  
  if (moved) {
    setBoard(newBoard);
  }
  
  return moved;
}

// Move tiles right
export function moveRight(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let i = 0; i < 4; i++) {
    // Array to track tiles that have already been merged in this move
    const mergedTiles = [false, false, false, false];
    
    // Shift all tiles right
    for (let j = 2; j >= 0; j--) {
      if (newBoard[i][j] !== 0) {
        let k = j;
        while (k < 3 && newBoard[i][k + 1] === 0) {
          newBoard[i][k + 1] = newBoard[i][k];
          newBoard[i][k] = 0;
          k++;
          moved = true;
        }
        
        // Merge identical tiles, but only if the target tile hasn't been merged
        if (k < 3 && newBoard[i][k + 1] === newBoard[i][k] && !mergedTiles[k + 1]) {
          newBoard[i][k + 1] *= 2;
          newBoard[i][k] = 0;
          setScore(prev => prev + newBoard[i][k + 1]);
          // Mark this tile as already merged
          mergedTiles[k + 1] = true;
          moved = true;
        }
      }
    }
  }
  
  if (moved) {
    setBoard(newBoard);
  }
  
  return moved;
}

// Move tiles up
export function moveUp(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let j = 0; j < 4; j++) {
    // Array to track tiles that have already been merged in this move
    const mergedTiles = [false, false, false, false];
    
    // Shift all tiles up
    for (let i = 1; i < 4; i++) {
      if (newBoard[i][j] !== 0) {
        let k = i;
        while (k > 0 && newBoard[k - 1][j] === 0) {
          newBoard[k - 1][j] = newBoard[k][j];
          newBoard[k][j] = 0;
          k--;
          moved = true;
        }
        
        // Merge identical tiles, but only if the target tile hasn't been merged
        if (k > 0 && newBoard[k - 1][j] === newBoard[k][j] && !mergedTiles[k - 1]) {
          newBoard[k - 1][j] *= 2;
          newBoard[k][j] = 0;
          setScore(prev => prev + newBoard[k - 1][j]);
          // Mark this tile as already merged
          mergedTiles[k - 1] = true;
          moved = true;
        }
      }
    }
  }
  
  if (moved) {
    setBoard(newBoard);
  }
  
  return moved;
}

// Move tiles down
export function moveDown(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let j = 0; j < 4; j++) {
    // Array to track tiles that have already been merged in this move
    const mergedTiles = [false, false, false, false];
    
    // Shift all tiles down
    for (let i = 2; i >= 0; i--) {
      if (newBoard[i][j] !== 0) {
        let k = i;
        while (k < 3 && newBoard[k + 1][j] === 0) {
          newBoard[k + 1][j] = newBoard[k][j];
          newBoard[k][j] = 0;
          k++;
          moved = true;
        }
        
        // Merge identical tiles, but only if the target tile hasn't been merged
        if (k < 3 && newBoard[k + 1][j] === newBoard[k][j] && !mergedTiles[k + 1]) {
          newBoard[k + 1][j] *= 2;
          newBoard[k][j] = 0;
          setScore(prev => prev + newBoard[k + 1][j]);
          // Mark this tile as already merged
          mergedTiles[k + 1] = true;
          moved = true;
        }
      }
    }
  }
  
  if (moved) {
    setBoard(newBoard);
  }
  
  return moved;
} 