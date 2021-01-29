/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: RestaurantsPageQuery
// ====================================================

export interface RestaurantsPageQuery_allCategories_categories {
  __typename: "Category";
  id: string;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantCount: number;
}

export interface RestaurantsPageQuery_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: RestaurantsPageQuery_allCategories_categories[] | null;
}

export interface RestaurantsPageQuery_allRestaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface RestaurantsPageQuery_allRestaurants_results {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string | null;
  category: RestaurantsPageQuery_allRestaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface RestaurantsPageQuery_allRestaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPage: number | null;
  totalCount: number | null;
  results: RestaurantsPageQuery_allRestaurants_results[] | null;
}

export interface RestaurantsPageQuery {
  allCategories: RestaurantsPageQuery_allCategories;
  allRestaurants: RestaurantsPageQuery_allRestaurants;
}

export interface RestaurantsPageQueryVariables {
  input: RestaurantsInput;
}
