import { createStore } from "solid-js/store";

export type GameState = {
  board: number[][];
  score: number;
  gameOver: boolean;
};

// Adds a random tile (2 or 4) to an empty cell
export function addRandomTile(state: GameState, setState: any) {
  const emptyCells: [number, number][] = [];
  
  // Find all empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (state.board[i][j] === 0) {
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
  setState("board", board => {
    return board.map((rowArr, rowIndex) =>
      rowIndex === row
        ? rowArr.map((cell, colIndex) => 
            colIndex === col ? value : cell
          )
        : [...rowArr]
    );
  });
}

// Check if the game is over
export function checkGameOver(state: GameState): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (state.board[i][j] === 0) {
        return false;
      }
    }
  }
  
  // Check for possible horizontal merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (state.board[i][j] === state.board[i][j + 1]) {
        return false;
      }
    }
  }
  
  // Check for possible vertical merges
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (state.board[i][j] === state.board[i + 1][j]) {
        return false;
      }
    }
  }
  
  // If no empty cells and no possible merges
  return true;
}

export const useGameStore = () => {
  // Initial game state
  const [state, setState] = createStore<GameState>({
    board: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    score: 0,
    gameOver: false
  });

  // Adds a random tile (2 or 4) to an empty cell
  const addRandomTileInternal = () => {
    addRandomTile(state, setState);
  };

  // Check if the game is over
  const checkGameOverInternal = () => {
    const isGameOver = checkGameOver(state);
    if (isGameOver) {
      setState("gameOver", true);
    }
    return isGameOver;
  };

  // Move tiles left
  const moveLeft = (): boolean => {
    let moved = false;
    const newBoard = state.board.map(row => [...row]);
    
    for (let i = 0; i < 4; i++) {
      // Shift all tiles to the left
      for (let j = 1; j < 4; j++) {
        if (newBoard[i][j] !== 0) {
          let k = j;
          while (k > 0 && newBoard[i][k - 1] === 0) {
            newBoard[i][k - 1] = newBoard[i][k];
            newBoard[i][k] = 0;
            k--;
            moved = true;
          }
          
          // Merge identical tiles
          if (k > 0 && newBoard[i][k - 1] === newBoard[i][k]) {
            newBoard[i][k - 1] *= 2;
            newBoard[i][k] = 0;
            setState("score", score => score + newBoard[i][k - 1]);
            moved = true;
          }
        }
      }
    }
    
    if (moved) {
      setState("board", newBoard);
    }
    
    return moved;
  };

  // Move tiles right
  const moveRight = (): boolean => {
    let moved = false;
    const newBoard = state.board.map(row => [...row]);
    
    for (let i = 0; i < 4; i++) {
      // Shift all tiles to the right
      for (let j = 2; j >= 0; j--) {
        if (newBoard[i][j] !== 0) {
          let k = j;
          while (k < 3 && newBoard[i][k + 1] === 0) {
            newBoard[i][k + 1] = newBoard[i][k];
            newBoard[i][k] = 0;
            k++;
            moved = true;
          }
          
          // Merge identical tiles
          if (k < 3 && newBoard[i][k + 1] === newBoard[i][k]) {
            newBoard[i][k + 1] *= 2;
            newBoard[i][k] = 0;
            setState("score", score => score + newBoard[i][k + 1]);
            moved = true;
          }
        }
      }
    }
    
    if (moved) {
      setState("board", newBoard);
    }
    
    return moved;
  };

  // Move tiles up
  const moveUp = (): boolean => {
    let moved = false;
    const newBoard = state.board.map(row => [...row]);
    
    for (let j = 0; j < 4; j++) {
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
          
          // Merge identical tiles
          if (k > 0 && newBoard[k - 1][j] === newBoard[k][j]) {
            newBoard[k - 1][j] *= 2;
            newBoard[k][j] = 0;
            setState("score", score => score + newBoard[k - 1][j]);
            moved = true;
          }
        }
      }
    }
    
    if (moved) {
      setState("board", newBoard);
    }
    
    return moved;
  };

  // Move tiles down
  const moveDown = (): boolean => {
    let moved = false;
    const newBoard = state.board.map(row => [...row]);
    
    for (let j = 0; j < 4; j++) {
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
          
          // Merge identical tiles
          if (k < 3 && newBoard[k + 1][j] === newBoard[k][j]) {
            newBoard[k + 1][j] *= 2;
            newBoard[k][j] = 0;
            setState("score", score => score + newBoard[k + 1][j]);
            moved = true;
          }
        }
      }
    }
    
    if (moved) {
      setState("board", newBoard);
    }
    
    return moved;
  };

  // Initialize the game
  const initGame = () => {
    addRandomTileInternal();
    addRandomTileInternal();
  };

  // Reset the game
  const resetGame = () => {
    setState({
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      score: 0,
      gameOver: false
    });
    
    addRandomTileInternal();
    addRandomTileInternal();
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent) => {
    if (state.gameOver) return;

    let moved = false;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moved = moveUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        moved = moveDown();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moved = moveLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        moved = moveRight();
        break;
      default:
        return; // Ignore other keys
    }

    if (moved) {
      addRandomTileInternal();
      checkGameOverInternal();
    }
  };

  // Return state and methods to work with it
  return {
    state,
    initGame,
    resetGame,
    handleKeyDown,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
  };
}; 