import React from 'react';

const Register = React.lazy(() => import('@renderer/pages/Register'));
const Login = React.lazy(() => import('@renderer/pages/Login'));
const NotFound = React.lazy(() => import('@renderer/pages/NotFound'));
const Unauthorized = React.lazy(() => import('@renderer/pages/Unauthorized'));

const routes = {
  register: {
    path: '/register',
    element: <Register />,
  },
  login: {
    path: '/app_window',
    element: <Login />,
  },
  unauthorized: {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  notFound: {
    path: '*',
    element: <NotFound />,
  },
  dashboard: {
    path: '/dashboard',
    element: <div>Dashboard</div>,
    home: {
      path: '/dashboard/home',
      element: <div>Dashboard Home</div>,
    }
  }
};

export default routes;
