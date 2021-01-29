import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from '../../__generated__/RestaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query RestaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    allRestaurants(input: $input) {
      ok
      error
      totalPage
      totalCount
      results {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

function Restaurants() {
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: { page: 1 },
    },
  });

  console.log(data);

  return <h1>restaurant</h1>;
}

export default Restaurants;
