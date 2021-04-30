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
  return (
    <div
      className={`px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">
          {name}{' '}
          {orderStarted && isSelected && (
            <button type="button" onClick={() => removeFromOrder?.(id)}>
              Remove
            </button>
          )}
          {orderStarted && !isSelected && (
            <button type="button" onClick={() => addItemToOrder?.(id)}>
              Add
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {dishOptions}
    </div>
  );
}

export default Dish;
