import React, { ReactNode } from 'react';

interface Props {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected?: boolean;
  dishOptions?: ReactNode;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: string) => void;
  removeFromOrder?: (dishId: string) => void;
}

function Dish({
  id,
  name,
  description,
  price,
  isSelected = false,
  dishOptions,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
}: Props) {
  const handleClick = () => {
    if (isSelected) return removeFromOrder?.(id);
    addItemToOrder?.(id);
  };

  return (
    <div
      className={`px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium flex items-center">
          {name}{' '}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? 'bg-red-500' : ' bg-lime-600'
              }`}
              onClick={handleClick}
            >
              {isSelected ? 'Remove' : 'Add'}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {dishOptions && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          <div className="grid gap-2  justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
}

export default Dish;
