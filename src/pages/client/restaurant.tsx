import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from '../../__generated__/RestaurantQuery';
import { Helmet } from 'react-helmet-async';

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
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

function Restaurant(): ReactElement {
  const { id } = useParams<Params>();
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
  console.log(data);

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
    </div>
  );
}

export default Restaurant;
