import { For } from 'solid-js';
import { Tile } from './Tile.tsx';

type BoardProps = {
  board: number[][];
  newTile: {row: number, col: number};
};

const isNewTile = (row: number, col: number, newTile: {row: number, col: number}) => {
  if (!newTile) return false;
  const isNew = newTile.row === row && newTile.col === col;
  return isNew;
};

export function Board(props: BoardProps) {
  return (
    <div class="grid grid-cols-4 gap-2 bg-gray-300 dark:bg-gray-700 p-2 rounded transition-colors">
      <For each={props.board}>
        {(row, rowIndex) => (
          <For each={row}>
            {(cell, colIndex) => 
              <Tile 
                value={cell} 
                isNew={isNewTile(rowIndex(), colIndex(), props.newTile)} 
              />
            }
          </For>
        )}
      </For>
    </div>
  );
} 