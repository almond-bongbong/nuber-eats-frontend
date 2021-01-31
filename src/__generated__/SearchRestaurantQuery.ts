/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchRestaurantQuery
// ====================================================

export interface SearchRestaurantQuery_searchRestaurant_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface SearchRestaurantQuery_searchRestaurant_restaurants {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string | null;
  category: SearchRestaurantQuery_searchRestaurant_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface SearchRestaurantQuery_searchRestaurant {
  __typename: "SearchRestaurantOutput";
  ok: boolean;
  error: string | null;
  totalCount: number | null;
  totalPage: number | null;
  restaurants: SearchRestaurantQuery_searchRestaurant_restaurants[] | null;
}

export interface SearchRestaurantQuery {
  searchRestaurant: SearchRestaurantQuery_searchRestaurant;
}

export interface SearchRestaurantQueryVariables {
  input: SearchRestaurantInput;
}
