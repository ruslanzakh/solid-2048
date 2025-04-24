import { Setter } from "solid-js";

export function addRandomTile(board: number[][], setBoard: Setter<number[][]>) {
  const emptyCells: [number, number][] = [];
  
  // Find all empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) return;

  // Choose a random empty cell
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  
  // Generate 2 or 4 (with 90% probability of 2)
  const value = Math.random() < 0.9 ? 2 : 4;
  
  
  // Update the board using setState, not by directly mutating
  setBoard(board => {
    return board.map((rowArr, rowIndex) =>
      rowIndex === row
        ? rowArr.map((cell, colIndex) => 
            colIndex === col ? value : cell
          )
        : [...rowArr]
    );
  });
}

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
  console.log('tick')
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