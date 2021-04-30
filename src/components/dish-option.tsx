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
      className={`flex border items-center ${
        isOptionSelected ? 'border-gray-800' : ''
      }`}
    >
      <h6 className="mr-2">{name}</h6>
      {extra && <h6 className="text-sm opacity-75">(${extra})</h6>}
    </span>
  );
}

export default DishOption;
