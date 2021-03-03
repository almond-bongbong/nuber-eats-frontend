import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserRole } from '../__generated__/globalTypes';
import Restaurants from '../pages/client/restaurants';
import Header from '../components/header';
import useMe from '../hooks/useMe';
import NotFound from '../pages/404';
import ConfirmEmail from '../pages/user/confirm-email';
import EditProfile from '../pages/user/edit-profile';
import Search from '../pages/client/search';
import Category from '../pages/client/category';
import Restaurant from '../pages/client/restaurant';

const ClientRouter = [
  <Route key="/" path="/" exact>
    <Restaurants />
  </Route>,
  <Route key="confirm-email" path="/confirm" exact>
    <ConfirmEmail />
  </Route>,
  <Route key="edit-profile" path="/edit-profile" exact>
    <EditProfile />
  </Route>,
  <Route key="search" path="/search">
    <Search />
  </Route>,
  <Route key="category" path="/category/:slug">
    <Category />
  </Route>,
  <Route key="restaurant" path="/restaurant/:id">
    <Restaurant />
  </Route>,
];

function LoggedInRouter() {
  const { data, error, loading } = useMe();

  if (!data || loading || error)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );

  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.CLIENT && ClientRouter}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default LoggedInRouter;
