import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client/core';
import { useMutation, useQuery } from '@apollo/client';
import {
  GetOrderQuery,
  GetOrderQueryVariables,
} from '../../__generated__/GetOrderQuery';
import { Helmet } from 'react-helmet-async';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { OrderUpdatesSubscription } from '../../__generated__/OrderUpdatesSubscription';
import useMe from '../../hooks/useMe';
import { OrderStatus, UserRole } from '../../__generated__/globalTypes';
import {
  EditOrderMutation,
  EditOrderMutationVariables,
} from '../../__generated__/EditOrderMutation';

interface Params {
  id: string;
}

const GET_ORDER_QUERY = gql`
  query GetOrderQuery($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription OrderUpdatesSubscription($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation EditOrderMutation($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

function Order() {
  const { id } = useParams<Params>();
  const { data: userData } = useMe();
  const { data, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER_QUERY, {
    variables: {
      input: { id },
    },
  });
  const [editOrderMutation] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER_MUTATION);

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: { id },
        },
        updateQuery: (
          prev,
          {
            subscriptionData,
          }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!subscriptionData.data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: { ...subscriptionData.data.orderUpdates },
            },
          };
        },
      });
    }
  }, [id, subscribeToMore, data]);

  const onButtonClick = (orderStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: { id, status: orderStatus },
      },
    });
  };

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{id}</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || 'Not yet.'}
            </span>
          </div>

          {userData?.me.role === UserRole.CLIENT && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.OWNER && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  className="btn"
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  className="btn"
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
