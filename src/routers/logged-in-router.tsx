import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../__generated__/MeQuery';
import { UserRole } from '../__generated__/globalTypes';
import Restaurants from '../pages/client/restaurants';

const ClientRouter = [
  <Route key="/" path="/" exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

function LoggedInRouter() {
  const { data, error, loading } = useQuery<MeQuery>(ME_QUERY);

  if (!data || loading || error)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );

  return (
    <Router>
      <Switch>
        {data.me.role === UserRole.CLIENT && ClientRouter}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default LoggedInRouter;
