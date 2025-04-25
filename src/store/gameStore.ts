import { createStore } from "solid-js/store";
import { moveLeft, moveRight, moveUp, moveDown, addRandomTile, checkGameOver } from "../logic/gameLogic";
import { batch } from "solid-js";
// @ts-ignore
import { koggy, pikachu, cool, wink, winner, jump, unicorn, joker, doggy } from '../logic/easterEggs';

// Key for localStorage
const GAME_STATE_KEY = '2048_game_state';

// Type for saving the full game state
type GameHistoryState = {
  board: number[][];
  score: number;
  newTile: {row: number, col: number};
};

// Type for saving in localStorage (only necessary fields)
type SavedGameState = {
  board: number[][];
  score: number;
  newTile: {row: number, col: number};
  has64Appeared: boolean;
  has128Appeared: boolean;
  has256Appeared: boolean;
  has512Appeared: boolean; 
  has1024Appeared: boolean;
  has2048Appeared: boolean;
  history: GameHistoryState[];
  undoCounter: number;
  animationsEnabled: boolean;
};

export type GameState = {
  board: number[][];
  score: number;
  gameOver: boolean;
  newTile: {row: number, col: number};
  has64Appeared: boolean;
  has128Appeared: boolean;
  has256Appeared: boolean;
  has512Appeared: boolean;
  has1024Appeared: boolean;
  has2048Appeared: boolean;
  // History of previous states
  history: GameHistoryState[];
  // Can undo a move
  canUndo: boolean;
  // Counter for alternating easter eggs when undoing a move
  undoCounter: number;
  // Animation enabled flag
  animationsEnabled: boolean;
};

// Function for saving the state to localStorage
const saveGameToLocalStorage = (state: GameState) => {
  const savedState: SavedGameState = {
    board: state.board,
    score: state.score,
    newTile: state.newTile,
    has64Appeared: state.has64Appeared,
    has128Appeared: state.has128Appeared,
    has256Appeared: state.has256Appeared,
    has512Appeared: state.has512Appeared,
    has1024Appeared: state.has1024Appeared,
    has2048Appeared: state.has2048Appeared,
    history: state.history,
    undoCounter: state.undoCounter,
    animationsEnabled: state.animationsEnabled
  };
  
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(savedState));
  } catch (e) {
    console.error('Failed to save game state to localStorage:', e);
  }
};

// Function for loading the state from localStorage
const loadGameFromLocalStorage = (): SavedGameState | null => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState) as SavedGameState;
    return parsedState;
  } catch (e) {
    console.error('Failed to load game state from localStorage:', e);
    return null;
  }
};

export const useGameStore = () => {
  // Initial game state - try to load from localStorage or use default
  const loadedState = loadGameFromLocalStorage();
  
  const getInitialState = (): GameState => {
    const loadedState = loadGameFromLocalStorage();
    if (loadedState) {
      return {
        ...loadedState,
        gameOver: false, // Always reset gameOver when loading
        canUndo: loadedState.history.length > 0,
        animationsEnabled: loadedState.animationsEnabled !== undefined ? loadedState.animationsEnabled : true
      };
    }
    return {
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      score: 0,
      gameOver: false,
      newTile: {row: -1, col: -1},
      has64Appeared: false,
      has128Appeared: false,
      has256Appeared: false,
      has512Appeared: false,
      has1024Appeared: false,
      has2048Appeared: false,
      history: [],
      canUndo: false,
      undoCounter: 0,
      animationsEnabled: true
    };
  };
  
  const [state, setState] = createStore<GameState>(getInitialState());

  // Save to localStorage when state changes
  const saveStateToLocalStorage = () => {
    saveGameToLocalStorage(state);
  };

  // Flag for tracking if the game was loaded from localStorage
  let isGameLoadedFromStorage = !!loadedState;

  const checkEasterEggs = () => {
    if(!checkFor64Tile()) return;
    if(!checkFor128Tile()) return;
    if(!checkFor256Tile()) return;
    if(!checkFor512Tile()) return;
    if(!checkFor1024Tile()) return;
    if(!checkFor2048Tile()) return;
  };

  // Function for saving the current state to history before changing
  const saveStateToHistory = () => {
    // Create a copy of the current state board
    const currentBoard = state.board.map(row => [...row]);
    
    // Create a new history object
    const historyItem: GameHistoryState = {
      board: currentBoard,
      score: state.score,
      newTile: {...state.newTile}
    };
    
    // Add to history, limiting it to 5 last states
    const newHistory = [historyItem, ...state.history];
    if (newHistory.length > 5) {
      newHistory.pop(); // Remove the oldest state if there are more than 5
    }
    
    setState('history', newHistory);
    setState('canUndo', true);
    
    // Save the updated state to localStorage
    saveStateToLocalStorage();
  };
  
  // Function for returning to the previous state
  const undoMove = () => {
    if (!state.canUndo || state.history.length === 0) return false;
    
    // Get the last saved state
    const lastState = state.history[0];
    const newHistory = state.history.slice(1);
    
    if (state.animationsEnabled) {
      if (state.undoCounter % 2 === 0) {
        joker();
      } else {
        doggy();
      }
    }
    
    // Increase the counter of clicks
    
    // Update the game state
    batch(() => {
      setState('undoCounter', state.undoCounter + 1);
      setState('board', lastState.board.map(row => [...row]));
      setState('score', lastState.score);
      setState('newTile', {...lastState.newTile});
      setState('history', newHistory);
      setState('canUndo', newHistory.length > 0);
      
      // Save the updated state to localStorage
      saveStateToLocalStorage();
    });
    
    return true;
  };

  const setBoard = (board: number[][] | ((prev: number[][]) => number[][]), saveHistory: boolean = true) => {
    // Save the current state before making the move
    if(saveHistory) {
      saveStateToHistory();
    }

    setState("board", board);
    checkEasterEggs();
    
    // Save the updated state to localStorage
    saveStateToLocalStorage();
  };

  const setScore = (score: number | ((prev: number) => number)) => {
    setState("score", score);
    
    // Save the updated state to localStorage
    saveStateToLocalStorage();
  };
  
  // General function to check for a tile with specific value
  const hasTileWithValue = (value: number): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state.board[row][col] === value) {
          return true;
        }
      }
    }
    return false;
  };
  
  // Function to check for 64 tile
  const checkFor64Tile = () => {
    if (state.has64Appeared) return true;
    
    if (hasTileWithValue(64)) {
      setState('has64Appeared', true);
      if (state.animationsEnabled) {
        koggy();
      }
      
      return true
    }
    return false
  };
  
  const checkFor128Tile = () => {
    if (state.has128Appeared) return true;
    
    if (hasTileWithValue(128)) {
      setState('has128Appeared', true);
      if (state.animationsEnabled) {
        cool();
      }
      
      return true
    }
    return false
  };
  
  const checkFor256Tile = () => {
    if (state.has256Appeared) return true;
    
    if (hasTileWithValue(256)) {
      setState('has256Appeared', true);
      if (state.animationsEnabled) {
        wink();
      }
      
      return true
    }
    return false
  };

  const checkFor512Tile = () => {
    if (state.has512Appeared) return true;
    
    if (hasTileWithValue(512)) {
      setState('has512Appeared', true);
      if (state.animationsEnabled) {
        winner();
      }
      
      return true
    }
    return false
  };

  const checkFor1024Tile = () => {
    if (state.has1024Appeared) return true;
    
    if (hasTileWithValue(1024)) {
      setState('has1024Appeared', true);
      if (state.animationsEnabled) {
        jump();
      }
      
      return true
    }
    return false
  };

  const checkFor2048Tile = () => {
    if (state.has2048Appeared) return true;
    
    if (hasTileWithValue(2048)) {
      setState('has2048Appeared', true);
      if (state.animationsEnabled) {
        unicorn();
      }
      
      return true
    }
    return false
  };

  // Adds a random tile (2 or 4) to an empty cell
  const addRandomTileInternal = () => {
    setState("newTile", {row: -1, col: -1});
    
    const newTilePosition = addRandomTile(state.board, setBoard);
    
    if (newTilePosition) {
      setState("newTile", newTilePosition);
      
      // Save the updated state to localStorage
      saveStateToLocalStorage();
    }
  };

  // Check if the game is over
  const checkGameOverInternal = () => {
    const isGameOver = checkGameOver(state.board);
    if (isGameOver) {
      setState("gameOver", true);
      
      // Save the updated state to localStorage
      saveStateToLocalStorage();
    }
    return isGameOver;
  };

  // Make a move
  const makeMove = (moveFn: (board: number[][], setBoard: any, setScore: any) => boolean) => {
    
    // Perform the move
    const moved = moveFn(state.board, setBoard, setScore);
    
    if (moved) {
      addRandomTileInternal();
      checkGameOverInternal();
    }
    
    return moved;
  };

  // Initialize the game
  const initGame = () => {
    batch(() => {
      setState(getInitialState());
    
      // If the game was not loaded from localStorage, add initial tiles
      if (!isGameLoadedFromStorage) {
        // Add initial tiles without saving history
        addRandomTileInternal();
        addRandomTileInternal();
        
        // Save the initial state to localStorage
        saveStateToLocalStorage();
      } else {
        // Reset the flag, since initialization is already completed
        isGameLoadedFromStorage = false;
      }
    });
  };

  // Reset the game
  const resetGame = () => {
    // Save the current animation setting
    const currentAnimationsEnabled = state.animationsEnabled;
    
    // Clear localStorage before initializing a new game
    localStorage.removeItem(GAME_STATE_KEY);
    // Reset the flag indicating that the game was loaded from storage
    isGameLoadedFromStorage = false;
    
    // Initialize the game
    initGame();
    
    // Restore animation setting
    setState('animationsEnabled', currentAnimationsEnabled);
    
    // Save updated state to localStorage with restored animation setting
    saveStateToLocalStorage();
    
    if (currentAnimationsEnabled) {
      pikachu();
    }
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent) => {
    if (state.gameOver) return;

    batch(() => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          makeMove(moveUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          makeMove(moveDown);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          makeMove(moveLeft);
          break;
        case 'ArrowRight':
          e.preventDefault();
          makeMove(moveRight);
          break;
        case 'Backspace':  // Add support for undoing a move through the Backspace key
          e.preventDefault();
          undoMove();
          return;
        default:
          return; // Ignore other keys
      }
    });
  };

  // Toggle animations
  const toggleAnimations = () => {
    setState('animationsEnabled', !state.animationsEnabled);
    saveStateToLocalStorage();
  };

  // Return state and methods to work with it
  return {
    state,
    initGame,
    resetGame,
    handleKeyDown,
    undoMove,
    toggleAnimations
  };
}; 