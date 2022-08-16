import React, { Suspense } from 'react';
import { publicRoutes, privateRoutes } from '../routes';
import { Switch, Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../../store/users';
import Page404 from '../../components/pages/404Page';

const AppRouter: React.FC = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  console.warn('login = ',isLoggedIn)
  console.warn('privateRoutes = ',privateRoutes)  
  return (
    <>
      <Suspense fallback={<></>}>
        <Switch>
          {isLoggedIn &&
            privateRoutes.map(route =>
              route.path ? (
                <Route path={route.path} component={route.component} exact={route.exact} key={route.path} />
              ) : null

            )
          }
          {publicRoutes.map(route =>
              route.path ? (
                <Route path={route.path} component={route.component} exact={route.exact} key={route.path} />
              ) : null
          )}
          <Redirect to={isLoggedIn ? '/' : 'login/signIn'} />
          <Route path='*' component={Page404} />

        </Switch>
      </Suspense>
    </>
  );
};

export default AppRouter;
