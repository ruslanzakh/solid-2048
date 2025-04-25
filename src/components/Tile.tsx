type TileProps = {
  value: number;
  isNew?: boolean;
};

export function Tile(props: TileProps) {
  const getTileClass = (value: number) => {
    switch (value) {
      case 0: return 'bg-gray-200 dark:bg-gray-600';
      case 2: return 'bg-yellow-100 dark:bg-yellow-300 text-gray-800';
      case 4: return 'bg-yellow-200 dark:bg-yellow-400 text-gray-800';
      case 8: return 'bg-orange-300 dark:bg-orange-400 text-white';
      case 16: return 'bg-orange-400 dark:bg-orange-500 text-white';
      case 32: return 'bg-orange-500 dark:bg-orange-600 text-white';
      case 64: return 'bg-orange-600 dark:bg-orange-700 text-white';
      case 128: return 'bg-yellow-400 dark:bg-yellow-500 text-white';
      case 256: return 'bg-yellow-500 dark:bg-yellow-600 text-white';
      case 512: return 'bg-yellow-600 dark:bg-yellow-700 text-white';
      case 1024: return 'bg-yellow-700 dark:bg-yellow-800 text-white text-sm sm:text-base';
      case 2048: return 'bg-yellow-800 dark:bg-yellow-900 text-white text-sm sm:text-base';
      default: return 'bg-yellow-800 dark:bg-yellow-900 text-white text-sm sm:text-base';
    }
  };

  const animationClass = props.isNew && props.value !== 0 ? 'tile-appear' : '';
  return (
    <div class={`w-full h-auto aspect-square flex items-center justify-center rounded font-bold text-base sm:text-xl ${getTileClass(props.value)} transition-colors ${animationClass} select-none pointer-events-none`}>
      {props.value !== 0 ? props.value : ''}
    </div>
  );
} 