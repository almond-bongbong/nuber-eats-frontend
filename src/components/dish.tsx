import React from 'react';
import { RestaurantQuery_restaurant_restaurant_menu_options } from '../__generated__/RestaurantQuery';

interface Props {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected?: boolean;
  isCustomer?: boolean;
  options?: RestaurantQuery_restaurant_restaurant_menu_options[] | null;
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
  isCustomer = false,
  options,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
}: Props) {
  return (
    <div
      onClick={() =>
        orderStarted && !isSelected
          ? addItemToOrder?.(id)
          : removeFromOrder?.(id)
      }
      className={`px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options?.length && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options</h5>
          {options?.map((o) => (
            <span className="flex items-center" key={o.name}>
              <h6 className="mr-2">{o.name}</h6>
              <h6 className="text-sm opacity-75">(${o.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dish;
