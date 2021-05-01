import React from 'react';

interface Props {
  dishId: string;
  name: string;
  extra: number | null;
  isOptionSelected?: boolean;
  addOptionToItem: (dishId: string, optionName: string) => void;
  removeOptionFromItem: (dishId: string, optionName: string) => void;
}

function DishOption({
  dishId,
  name,
  extra,
  isOptionSelected,
  addOptionToItem,
  removeOptionFromItem,
}: Props) {
  const handleClick = () => {
    if (isOptionSelected) return removeOptionFromItem(dishId, name);
    addOptionToItem(dishId, name);
  };

  return (
    <span
      onClick={handleClick}
      className={`border px-2 py-1 ${
        isOptionSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      <span className="mr-2">{name}</span>
      {<span className="text-sm opacity-75">(${extra})</span>}
    </span>
  );
}

export default DishOption;
