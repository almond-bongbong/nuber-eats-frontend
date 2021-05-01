import React, { ReactElement, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { Helmet } from 'react-helmet-async';
import Dish from '../../components/dish';
import {
  CreateOrderMutation,
  CreateOrderMutationVariables,
} from '../../__generated__/CreateOrderMutation';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import DishOption from '../../components/dish-option';
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from '../../__generated__/RestaurantQuery';

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
      orderId
    }
  }
`;

function Restaurant(): ReactElement {
  const history = useHistory();
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
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION);

  const handleStartOrder = () => {
    setOrderStarted(true);
  };

  const handleCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
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

  const handleConfirmOrder = async () => {
    if (placingOrder) return;
    const ok = window.confirm('You are about to place an order');
    if (!ok) return;

    try {
      const { data } = await createOrderMutation({
        variables: {
          input: {
            restaurantId: id,
            items: orderItems,
          },
        },
      });

      if (data?.createOrder.ok) {
        alert('Order created');
        history.push(`/orders/${data.createOrder.orderId}`);
      } else {
        alert(data?.createOrder.error);
      }
    } catch (error) {
      console.error(error);
    }
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
      <div className="container pb-32 flex flex-col items-end mt-20">
        {!orderStarted && (
          <button onClick={handleStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            {orderItems.length > 0 && (
              <button onClick={handleConfirmOrder} className="btn px-10 mr-3">
                Confirm Order
              </button>
            )}
            <button
              onClick={handleCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}
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
              dishOptions={dish.options?.map((o) => {
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
