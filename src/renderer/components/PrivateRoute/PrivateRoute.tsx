import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import './PrivateRoute.scss';
import routes from '../../routes';
import { useAppSelector } from '@renderer/hooks';

const PrivateRoute = (): JSX.Element => {
  const { userDetails } = useAppSelector(state => state.auth);

  if (userDetails) {
    return <Outlet />;
  }
  return <Navigate to={routes.login.path} />;
};

export default PrivateRoute;
