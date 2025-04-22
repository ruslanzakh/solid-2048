import { Accessor, Setter } from "solid-js";

// Добавляет случайную плитку (2 или 4) на пустое место
export function addRandomTile(board: number[][], setBoard: Setter<number[][]>) {
  const emptyCells: [number, number][] = [];
  
  // Находим все пустые ячейки
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) return;

  // Выбираем случайную пустую ячейку
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  
  // Генерируем 2 или 4 (с вероятностью 90% будет 2)
  const value = Math.random() < 0.9 ? 2 : 4;
  
  // Обновляем доску
  const newBoard = [...board];
  newBoard[row][col] = value;
  setBoard(newBoard);
}

// Проверка окончания игры
export function checkGameOver(board: number[][]): boolean {
  // Проверяем наличие пустых ячеек
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }
  
  // Проверяем возможность слияния по горизонтали
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }
  
  // Проверяем возможность слияния по вертикали
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }
  
  // Если нет пустых ячеек и нет возможности слияния
  return true;
}

// Перемещение влево
export function moveLeft(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let i = 0; i < 4; i++) {
    // Сдвигаем все плитки влево
    for (let j = 1; j < 4; j++) {
      if (newBoard[i][j] !== 0) {
        let k = j;
        while (k > 0 && newBoard[i][k - 1] === 0) {
          newBoard[i][k - 1] = newBoard[i][k];
          newBoard[i][k] = 0;
          k--;
          moved = true;
        }
        
        // Слияние одинаковых плиток
        if (k > 0 && newBoard[i][k - 1] === newBoard[i][k]) {
          newBoard[i][k - 1] *= 2;
          newBoard[i][k] = 0;
          setScore(prev => prev + newBoard[i][k - 1]);
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

// Перемещение вправо
export function moveRight(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let i = 0; i < 4; i++) {
    // Сдвигаем все плитки вправо
    for (let j = 2; j >= 0; j--) {
      if (newBoard[i][j] !== 0) {
        let k = j;
        while (k < 3 && newBoard[i][k + 1] === 0) {
          newBoard[i][k + 1] = newBoard[i][k];
          newBoard[i][k] = 0;
          k++;
          moved = true;
        }
        
        // Слияние одинаковых плиток
        if (k < 3 && newBoard[i][k + 1] === newBoard[i][k]) {
          newBoard[i][k + 1] *= 2;
          newBoard[i][k] = 0;
          setScore(prev => prev + newBoard[i][k + 1]);
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

// Перемещение вверх
export function moveUp(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let j = 0; j < 4; j++) {
    // Сдвигаем все плитки вверх
    for (let i = 1; i < 4; i++) {
      if (newBoard[i][j] !== 0) {
        let k = i;
        while (k > 0 && newBoard[k - 1][j] === 0) {
          newBoard[k - 1][j] = newBoard[k][j];
          newBoard[k][j] = 0;
          k--;
          moved = true;
        }
        
        // Слияние одинаковых плиток
        if (k > 0 && newBoard[k - 1][j] === newBoard[k][j]) {
          newBoard[k - 1][j] *= 2;
          newBoard[k][j] = 0;
          setScore(prev => prev + newBoard[k - 1][j]);
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

// Перемещение вниз
export function moveDown(
  board: number[][], 
  setBoard: Setter<number[][]>,
  setScore: Setter<number>
): boolean {
  let moved = false;
  const newBoard = board.map(row => [...row]);
  
  for (let j = 0; j < 4; j++) {
    // Сдвигаем все плитки вниз
    for (let i = 2; i >= 0; i--) {
      if (newBoard[i][j] !== 0) {
        let k = i;
        while (k < 3 && newBoard[k + 1][j] === 0) {
          newBoard[k + 1][j] = newBoard[k][j];
          newBoard[k][j] = 0;
          k++;
          moved = true;
        }
        
        // Слияние одинаковых плиток
        if (k < 3 && newBoard[k + 1][j] === newBoard[k][j]) {
          newBoard[k + 1][j] *= 2;
          newBoard[k][j] = 0;
          setScore(prev => prev + newBoard[k + 1][j]);
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