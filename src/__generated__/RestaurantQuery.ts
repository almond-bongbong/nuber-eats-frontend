/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: RestaurantQuery
// ====================================================

export interface RestaurantQuery_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface RestaurantQuery_restaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface RestaurantQuery_restaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: RestaurantQuery_restaurant_restaurant_menu_options_choices[] | null;
}

export interface RestaurantQuery_restaurant_restaurant_menu {
  __typename: "Dish";
  id: string;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: RestaurantQuery_restaurant_restaurant_menu_options[] | null;
}

export interface RestaurantQuery_restaurant_restaurant {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string | null;
  category: RestaurantQuery_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: RestaurantQuery_restaurant_restaurant_menu[];
}

export interface RestaurantQuery_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: RestaurantQuery_restaurant_restaurant | null;
}

export interface RestaurantQuery {
  restaurant: RestaurantQuery_restaurant;
}

export interface RestaurantQueryVariables {
  input: RestaurantInput;
}
