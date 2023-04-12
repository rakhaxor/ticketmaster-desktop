import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import '@assets/css/bootstrap.min.css';
import './App.scss';
import { useAppSelector } from '@renderer/hooks';
import PrivateRoute from '@renderer/components/PrivateRoute';
import Loader from '@renderer/components/Loader';
import routes from '@renderer/routes';

const App = (): JSX.Element => {
  const { loading } = useAppSelector(state => state.global);

  return (
    <Router>
      <div>
        <Toaster containerStyle={{top: 40}} />
      </div>
      <Loader loading={loading} />
      <Routes>
        {/* Public routes */}
        <Route path={routes.landing.path} element={routes.login.element} />
        <Route path={routes.login.path} element={routes.login.element} />
        <Route path={routes.register.path} element={routes.register.element} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path={routes.dashboard.path} element={routes.dashboard.element}>
            <Route index element={routes.dashboard.home.element} />
          </Route>
        </Route>

        <Route path={routes.unauthorized.path} element={routes.unauthorized.element} />
        <Route path={routes.notFound.path} element={routes.notFound.element} />
      </Routes>
    </Router>
  );
};

export default App;
