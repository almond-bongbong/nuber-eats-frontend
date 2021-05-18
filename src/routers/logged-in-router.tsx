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
import MyRestaurants from '../pages/owner/my-restaurants';
import AddRestaurant from '../pages/owner/add-restaurant';
import MyRestaurant from '../pages/owner/my-restaurant';
import AddDish from '../pages/owner/add-dish';
import Order from '../pages/user/order';
import Dashboard from '../pages/driver/dashboard';

const commonRoutes = [
  { path: '/confirm', component: <ConfirmEmail /> },
  { path: '/edit-profile', component: <EditProfile /> },
  { path: '/orders/:id', component: <Order /> },
];

const clientRoutes = [
  { path: '/', component: <Restaurants />, exact: true },
  { path: '/search', component: <Search /> },
  { path: '/category/:slug', component: <Category /> },
  { path: '/restaurant/:id', component: <Restaurant /> },
];

const restaurantRoutes = [
  { path: '/', component: <MyRestaurants />, exact: true },
  { path: '/add-restaurant', component: <AddRestaurant /> },
  { path: '/restaurant/:id', component: <MyRestaurant />, exact: true },
  { path: '/restaurant/:id/add-dish', component: <AddDish /> },
];

const driverRoutes = [{ path: '/', component: <Dashboard />, exact: true }];

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
        {commonRoutes.map((r) => (
          <Route key={r.path} path={r.path}>
            {r.component}
          </Route>
        ))}

        {data.me.role === UserRole.CLIENT &&
          clientRoutes.map((r) => (
            <Route key={r.path} path={r.path} exact={r.exact}>
              {r.component}
            </Route>
          ))}

        {data.me.role === UserRole.OWNER &&
          restaurantRoutes.map((r) => (
            <Route key={r.path} path={r.path} exact={r.exact}>
              {r.component}
            </Route>
          ))}

        {data.me.role === UserRole.DELIVERY &&
          driverRoutes.map((r) => (
            <Route key={r.path} path={r.path} exact={r.exact}>
              {r.component}
            </Route>
          ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default LoggedInRouter;
