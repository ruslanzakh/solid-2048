import { Component } from 'solid-js';

type UndoButtonProps = {
  canUndo: boolean;
  onUndo: () => void;
};

export const UndoButton: Component<UndoButtonProps> = (props) => {
  return (
    <button
      onClick={props.onUndo}
      disabled={!props.canUndo}
      class={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded transition-colors ${
        !props.canUndo ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Undo last move"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 inline-block mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back
    </button>
  );
}; 