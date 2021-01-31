import React, { ReactElement, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { gql, useLazyQuery } from '@apollo/client';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from '../../__generated__/SearchRestaurantQuery';

const SEARCH_RESTAURANT_QUERY = gql`
  query SearchRestaurantQuery($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalCount
      totalPage
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

function Search(): ReactElement {
  const { search } = useLocation();
  const term = qs.parse(search).term as string;
  const [searchRestaurantQuery, { data }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT_QUERY);

  useEffect(() => {
    if (!term) return;

    searchRestaurantQuery({
      variables: {
        input: {
          page: 1,
          query: term,
        },
      },
    });
  }, [searchRestaurantQuery, term]);

  console.log(data);

  if (!term) return <Redirect to="/" />;

  return <div>Search {term}</div>;
}

export default Search;
