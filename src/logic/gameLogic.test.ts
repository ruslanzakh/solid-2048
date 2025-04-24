import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  addRandomTile, 
  checkGameOver, 
  moveLeft, 
  moveRight, 
  moveUp, 
  moveDown 
} from './gameLogic';

describe('gameLogic', () => {
  // Mock Math.random for predictable tests
  const originalRandom = Math.random;

  beforeEach(() => {
    // Restore the original Math.random function before each test
    Math.random = originalRandom;
  });

  describe('addRandomTile', () => {
    it('should add a tile with value 2 to an empty cell', () => {
      // Mock Math.random for predictable results
      Math.random = vi.fn()
        .mockReturnValueOnce(0.5) // For cell selection (middle of the array)
        .mockReturnValueOnce(0.5); // For value selection (2, since < 0.9)
      
      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      
      addRandomTile(board, setBoard);
      
      // Check that setBoard was called with an updated board
      // The exact location of the tile depends on Math.random, so we only check
      // that one cell contains 2 and the rest are 0
      expect(setBoard).toHaveBeenCalled();
      const calledBoard = setBoard.mock.calls[0][0];
      console.log("calledBoard", calledBoard);
      // Check that the board contains exactly one tile with value 2
      const flattenedBoard = calledBoard(board).flat();
      expect(flattenedBoard.filter((cell: number) => cell === 2)).toHaveLength(1);
      expect(flattenedBoard.filter((cell: number) => cell === 0)).toHaveLength(15);
    });

    it('should add a tile with value 4 with 10% probability', () => {
      // Mock Math.random to generate 4 (value > 0.9)
      Math.random = vi.fn()
        .mockReturnValueOnce(0.5) // For cell selection
        .mockReturnValueOnce(0.95); // For value selection (4, since > 0.9)
      
      const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      
      addRandomTile(board, setBoard);
      
      // Check that a tile with value 4 was added
      expect(setBoard).toHaveBeenCalled();
      const calledBoard = setBoard.mock.calls[0][0];
      
      // Check that the board contains exactly one tile with value 4
      const flattenedBoard = calledBoard(board).flat();
      expect(flattenedBoard.filter((cell: number) => cell === 4)).toHaveLength(1);
      expect(flattenedBoard.filter((cell: number) => cell === 0)).toHaveLength(15);
    });
    
    it('should not modify the board if there are no empty cells', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4],
        [2, 4, 8, 16]
      ];
      
      const setBoard = vi.fn();
      
      addRandomTile(board, setBoard);
      
      // Check that setBoard was not called
      expect(setBoard).not.toHaveBeenCalled();
    });
  });
  
  describe('checkGameOver', () => {
    it('should return false if there are empty cells', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 0, 256], // Has an empty cell
        [512, 1024, 2048, 4],
        [2, 4, 8, 16]
      ];
      
      expect(checkGameOver(board)).toBe(false);
    });
    
    it('should return false if there are possible horizontal merges', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 64, 256], // Two identical tiles next to each other
        [512, 1024, 2048, 4],
        [2, 4, 8, 16]
      ];
      
      expect(checkGameOver(board)).toBe(false);
    });
    
    it('should return false if there are possible vertical merges', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 4, 128, 256], // 4 above and below
        [512, 4, 2048, 4],
        [2, 16, 8, 16]
      ];
      
      expect(checkGameOver(board)).toBe(false);
    });
    
    it('should return true if there are no empty cells and no possible merges', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4],
        [2, 8, 16, 32]
      ];
      
      expect(checkGameOver(board)).toBe(true);
    });

    it('should correctly handle a board with identical values in corners', () => {
      const board = [
        [2, 4, 8, 2],
        [4, 16, 32, 8],
        [8, 32, 16, 4],
        [2, 8, 4, 2]
      ];
      
      // The board has identical values in corners (2), but they are not adjacent
      expect(checkGameOver(board)).toBe(true);
    });
  });
  
  describe('moveLeft', () => {
    it('should shift tiles to the left', () => {
      const board = [
        [0, 2, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveLeft(board, setBoard, setScore);
      
      // Expect shift and merge
      const expectedBoard = [
        [4, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called with a function
      expect(setScore).toHaveBeenCalled();
    });
    
    it('should correctly merge multiple tiles', () => {
      const board = [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveLeft(board, setBoard, setScore);
      
      // Expect two merges (2+2 and 2+2)
      const expectedBoard = [
        [4, 4, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called twice
      expect(setScore).toHaveBeenCalledTimes(2);
    });
    
    it('should not modify the board if movement is impossible', () => {
      const board = [
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0],
        [16, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveLeft(board, setBoard, setScore);
      
      expect(moved).toBe(false);
      expect(setBoard).not.toHaveBeenCalled();
      expect(setScore).not.toHaveBeenCalled();
    });

    it('should correctly handle more complex merge cases', () => {
      const board = [
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveLeft(board, setBoard, setScore);
      
      // Expect two merges of different values (2+2=4 and 4+4=8)
      const expectedBoard = [
        [4, 8, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called twice
      expect(setScore).toHaveBeenCalledTimes(2);
    });

    it('should not merge tiles more than once per move', () => {
      const board = [
        [2, 2, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveLeft(board, setBoard, setScore);
      
      // 2+2=4, but no further merging with the existing 4 should occur
      const expectedBoard = [
        [4, 4, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called once
      expect(setScore).toHaveBeenCalledTimes(1);
    });

    it('should correctly handle different consecutive values when moving left', () => {
      const board = [
        [2, 2, 4, 8],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveLeft(board, setBoard, setScore);
      
      // Expect that in the top row, only the two 2's merge, and 4 and 8 shift to the left
      // Other rows are already left-aligned and won't move
      const expectedBoard = [
        [4, 4, 8, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called once (for the 2+2=4 merge)
      expect(setScore).toHaveBeenCalledTimes(1);
      // Check that score is incremented by 4 (the value of the merged tile)
      const scoreUpdateFn = setScore.mock.calls[0][0];
      expect(scoreUpdateFn(0)).toBe(4);
    });
  });
  
  describe('moveRight', () => {
    it('should shift tiles to the right', () => {
      const board = [
        [2, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveRight(board, setBoard, setScore);
      
      // Expect shift and merge
      const expectedBoard = [
        [0, 0, 0, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called
      expect(setScore).toHaveBeenCalled();
    });

    it('should correctly merge multiple tiles when moving right', () => {
      const board = [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveRight(board, setBoard, setScore);
      
      // Expect two merges from right to left
      const expectedBoard = [
        [0, 0, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called twice
      expect(setScore).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('moveUp', () => {
    it('should shift tiles upwards', () => {
      const board = [
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveUp(board, setBoard, setScore);
      
      // Expect shift and merge
      const expectedBoard = [
        [4, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called
      expect(setScore).toHaveBeenCalled();
    });

    it('should correctly handle complex cases when moving up', () => {
      const board = [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveUp(board, setBoard, setScore);
      
      // Expect two merges of identical values
      const expectedBoard = [
        [4, 0, 0, 0],
        [8, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called twice
      expect(setScore).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('moveDown', () => {
    it('should shift tiles downwards', () => {
      const board = [
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveDown(board, setBoard, setScore);
      
      // Expect shift and merge
      const expectedBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called
      expect(setScore).toHaveBeenCalled();
    });

    it('should correctly handle complex cases when moving down', () => {
      const board = [
        [2, 0, 0, 2],
        [2, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveDown(board, setBoard, setScore);
      
      // Expect downward shift and merge
      const expectedBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 0, 0, 4]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called twice
      expect(setScore).toHaveBeenCalledTimes(2);
    });

    it('should correctly handle consecutive different values when moving down', () => {
      const board = [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0]
      ];
      
      const setBoard = vi.fn();
      const setScore = vi.fn();
      
      const moved = moveDown(board, setBoard, setScore);
      
      // Expect shift without merges since all values are different, except the top two 2's
      const expectedBoard = [
        [0, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0]
      ];
      
      expect(moved).toBe(true);
      expect(setBoard).toHaveBeenCalledWith(expectedBoard);
      // Check that setScore was called once (for the 2+2=4 merge)
      expect(setScore).toHaveBeenCalledTimes(1);
      // Check that score is incremented by 4 (the value of the merged tile)
      const scoreUpdateFn = setScore.mock.calls[0][0];
      expect(scoreUpdateFn(0)).toBe(4);
    });
  });

  // Integration test to verify interaction between methods
  describe('integration testing', () => {
    it('should correctly process a sequence of moves', () => {
      // Initial board
      let board = [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0]
      ];
      
      let score = 0;
      const setBoard = vi.fn((newBoard) => {
        board = newBoard;
      });
      const setScore = vi.fn((updateFn) => {
        if (typeof updateFn === 'function') {
          score = updateFn(score);
        } else {
          score = updateFn;
        }
      });
      
      // First move: left
      moveLeft(board, setBoard, setScore);
      
      // After the first move
      expect(board).toEqual([
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
      
      // Second move: up (merge 2+2)
      moveUp(board, setBoard, setScore);
      
      // After the second move
      expect(board).toEqual([
        [4, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
      
      // Check that score increased to 4
      expect(score).toBe(4);
    });
  });
}); 