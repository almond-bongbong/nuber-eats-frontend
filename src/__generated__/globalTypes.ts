/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderStatus {
  Cooked = "Cooked",
  Cooking = "Cooking",
  Delivered = "Delivered",
  Pending = "Pending",
  PickedUp = "PickedUp",
}

export enum UserRole {
  CLIENT = "CLIENT",
  DELIVERY = "DELIVERY",
  OWNER = "OWNER",
}

export interface CategoryInput {
  page?: number | null;
  slug: string;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateDishInput {
  name: string;
  price: number;
  description: string;
  options?: DishOptionInput[] | null;
  restaurantId: string;
}

export interface CreateOrderInput {
  restaurantId: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  dishId: string;
  options?: OrderItemOptionInput[] | null;
}

export interface CreateRestaurantInput {
  name: string;
  coverImage?: string | null;
  address: string;
  categoryName: string;
}

export interface DishChoiceInput {
  name: string;
  extra?: number | null;
}

export interface DishOptionInput {
  name: string;
  choices?: DishChoiceInput[] | null;
  extra?: number | null;
}

export interface EditOrderInput {
  id: string;
  status: OrderStatus;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface GetOrderInput {
  id: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MyRestaurantInput {
  id: string;
}

export interface OrderItemOptionInput {
  name: string;
  choice?: string | null;
  extra?: number | null;
}

export interface OrderUpdatesInput {
  id: string;
}

export interface RestaurantInput {
  restaurantId: string;
}

export interface RestaurantsInput {
  page?: number | null;
}

export interface SearchRestaurantInput {
  page?: number | null;
  query: string;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
