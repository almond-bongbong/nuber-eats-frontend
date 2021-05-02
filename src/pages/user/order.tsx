import React from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client';
import {
  GetOrderQuery,
  GetOrderQueryVariables,
} from '../../__generated__/GetOrderQuery';

interface Params {
  id: string;
}

const GET_ORDER_QUERY = gql`
  query GetOrderQuery($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        customer {
          email
        }
        driver {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

function Order() {
  const { id } = useParams<Params>();
  const { data } = useQuery<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER_QUERY, {
    variables: {
      input: { id },
    },
  });

  console.log(data);

  return <div>Order</div>;
}

export default Order;
