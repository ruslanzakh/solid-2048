import { Component } from 'solid-js';

type ControlsProps = {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
};

export const Controls: Component<ControlsProps> = (props) => {
  return (
    <div class="grid grid-cols-3 gap-2 mt-4 md:hidden">
      <div class="col-start-2">
        <button
          aria-label="Move Up"
          class="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex justify-center items-center transition-colors"
          onClick={() => props.onMove('up')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div class="col-start-1 col-span-1 row-start-2">
        <button
          aria-label="Move Left"
          class="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex justify-center items-center transition-colors"
          onClick={() => props.onMove('left')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div class="col-start-2">
        <button
          aria-label="Move Down"
          class="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex justify-center items-center transition-colors"
          onClick={() => props.onMove('down')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div class="col-start-3">
        <button
          aria-label="Move Right"
          class="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex justify-center items-center transition-colors"
          onClick={() => props.onMove('right')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 