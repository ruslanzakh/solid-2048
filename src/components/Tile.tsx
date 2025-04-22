type TileProps = {
  value: number;
};

export function Tile(props: TileProps) {
  const getTileClass = (value: number) => {
    switch (value) {
      case 0: return 'bg-gray-200';
      case 2: return 'bg-yellow-100 text-gray-800';
      case 4: return 'bg-yellow-200 text-gray-800';
      case 8: return 'bg-orange-300 text-white';
      case 16: return 'bg-orange-400 text-white';
      case 32: return 'bg-orange-500 text-white';
      case 64: return 'bg-orange-600 text-white';
      case 128: return 'bg-yellow-400 text-white';
      case 256: return 'bg-yellow-500 text-white';
      case 512: return 'bg-yellow-600 text-white';
      case 1024: return 'bg-yellow-700 text-white';
      case 2048: return 'bg-yellow-800 text-white';
      default: return 'bg-yellow-800 text-white';
    }
  };

  return (
    <div class={`w-16 h-16 flex items-center justify-center rounded font-bold text-xl ${getTileClass(props.value)}`}>
      {props.value !== 0 ? props.value : ''}
    </div>
  );
} 