/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: NewPendingOrderSubscription
// ====================================================

export interface NewPendingOrderSubscription_newPendingOrder_customer {
  __typename: "User";
  email: string;
}

export interface NewPendingOrderSubscription_newPendingOrder_driver {
  __typename: "User";
  email: string;
}

export interface NewPendingOrderSubscription_newPendingOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface NewPendingOrderSubscription_newPendingOrder {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number | null;
  customer: NewPendingOrderSubscription_newPendingOrder_customer | null;
  driver: NewPendingOrderSubscription_newPendingOrder_driver | null;
  restaurant: NewPendingOrderSubscription_newPendingOrder_restaurant;
}

export interface NewPendingOrderSubscription {
  newPendingOrder: NewPendingOrderSubscription_newPendingOrder;
}
