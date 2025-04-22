import { For } from 'solid-js';
import { Tile } from './Tile.tsx';

type BoardProps = {
  board: number[][];
};

export function Board(props: BoardProps) {
  return (
    <div class="grid grid-cols-4 gap-2 bg-gray-300 p-2 rounded">
      <For each={props.board}>
        {(row) => (
          <For each={row}>
            {(cell) => <Tile value={cell} />}
          </For>
        )}
      </For>
    </div>
  );
} 