import React from 'react';

import Register from '@renderer/pages/Register';
import Login from '@renderer/pages/Login';
import NotFound from '@renderer/pages/NotFound';
import Unauthorized from '@renderer/pages/Unauthorized';
import Layout from '@renderer/pages/dashboard/Layout';

const routes = {
  landing: {
    path: '/',
    element: <Login />,
  },
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
    element: <Layout />,
    home: {
      path: '/dashboard/home',
      element: <>Dashboard Home</>,
    }
  }
};

export default routes;
