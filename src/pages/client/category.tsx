import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  CategoryQuery,
  CategoryQueryVariables,
} from '../../__generated__/CategoryQuery';

interface Params {
  slug: string;
}

const CATEGORY_QUERY = gql`
  query CategoryQuery($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPage
      totalCount
      category {
        ...CategoryParts
        restaurants {
          ...RestaurantParts
        }
      }
    }
  }
  ${CATEGORY_FRAGMENT}
  ${RESTAURANT_FRAGMENT}
`;

function Category(): ReactElement {
  const { slug } = useParams<Params>();
  const { data } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          slug,
          page: 1,
        },
      },
    }
  );

  console.log(data?.category);

  return <div>category</div>;
}

export default Category;
