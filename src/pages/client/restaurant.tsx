import React, { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from '../../__generated__/RestaurantQuery';
import { Helmet } from 'react-helmet-async';
import Dish from '../../components/dish';
import {
  CreateOrderMutation,
  CreateOrderMutationVariables,
} from '../../__generated__/CreateOrderMutation';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import DishOption from '../../components/dish-option';

interface Params {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query RestaurantQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

function Restaurant(): ReactElement {
  const { id } = useParams<Params>();
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      skip: !id,
      variables: {
        input: {
          restaurantId: id,
        },
      },
    }
  );
  const [createOrderMutation] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION);

  const handleStartOrder = () => {
    setOrderStarted(true);
  };

  const addItemToOrder = (dishId: string) => {
    if (orderItems.some((o) => o.dishId === dishId)) return;
    setOrderItems((prev) => [{ dishId, options: null }, ...prev]);
  };

  const removeFromOrder = (dishId: string) => {
    setOrderItems((prev) => prev.filter((p) => p.dishId !== dishId));
  };

  const addOptionToItem = (dishId: string, optionName: string) => {
    const findDish = orderItems.find((o) => o.dishId === dishId);
    const isAlreadySelectedOption = findDish?.options?.find(
      (o) => o.name === optionName
    );

    if (!findDish || isAlreadySelectedOption) {
      return;
    }

    removeFromOrder(dishId);
    findDish.options = [...(findDish.options || []), { name: optionName }];
    setOrderItems((prev) => [findDish, ...prev]);
  };

  const removeOptionFromItem = (dishId: string, optionName: string) => {
    const findDish = orderItems.find((o) => o.dishId === dishId);

    if (!findDish) {
      return;
    }

    removeFromOrder(dishId);
    findDish.options = findDish.options?.filter((o) => o.name !== optionName);
    setOrderItems((prev) => [findDish, ...prev]);
  };

  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ''} | Nuber Eats</title>
      </Helmet>
      <div
        className=" bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-20">
        <button onClick={handleStartOrder} className="btn px-10">
          {orderStarted ? 'Ordering' : 'Start Order'}
        </button>
        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              key={index}
              id={dish.id}
              orderStarted={orderStarted}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isSelected={orderItems.some((o) => o.dishId === dish.id)}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
              dishOptions={
                dish.options?.length && (
                  <div>
                    <h5 className="mt-8 mb-3 font-medium">Dish Options</h5>
                    {dish.options?.map((o) => {
                      const isOptionSelected = orderItems
                        .find((item) => item.dishId === dish.id)
                        ?.options?.find((option) => option.name === o.name);

                      return (
                        <DishOption
                          key={o.name}
                          dishId={dish.id}
                          name={o.name}
                          extra={o.extra}
                          isOptionSelected={Boolean(isOptionSelected)}
                          addOptionToItem={addOptionToItem}
                          removeOptionFromItem={removeOptionFromItem}
                        />
                      );
                    })}
                  </div>
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
