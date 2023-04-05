import React from 'react';
import { Link } from 'react-router-dom';

import './Unauthorized.scss';
import routes from '../../routes';

const Unauthorized = (): JSX.Element => {
  return (
    <div className='unauthorized'>
      <div className='wrapper'>
        <div className='box'>
          <h1>403</h1>
          <p>Sorry, it&apos;s not allowed to go beyond this point!</p>
          <p>
            <Link to={routes.login.path}>Please, go back this way.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
