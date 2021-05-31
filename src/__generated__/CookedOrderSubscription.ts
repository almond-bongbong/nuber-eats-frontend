/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: CookedOrderSubscription
// ====================================================

export interface CookedOrderSubscription_cookedOrder_customer {
  __typename: "User";
  email: string;
}

export interface CookedOrderSubscription_cookedOrder_driver {
  __typename: "User";
  email: string;
}

export interface CookedOrderSubscription_cookedOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface CookedOrderSubscription_cookedOrder {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number | null;
  customer: CookedOrderSubscription_cookedOrder_customer | null;
  driver: CookedOrderSubscription_cookedOrder_driver | null;
  restaurant: CookedOrderSubscription_cookedOrder_restaurant;
}

export interface CookedOrderSubscription {
  cookedOrder: CookedOrderSubscription_cookedOrder;
}
