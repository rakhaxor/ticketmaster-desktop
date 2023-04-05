import React from 'react';
import { Link } from 'react-router-dom';

import './NotFound.scss';

const NotFound = (): JSX.Element => {
  return (
    <article style={{ padding: '100px' }}>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className='flexGrow'>
        <Link to='/'>Visit Our Homepage</Link>
      </div>
    </article>
  );
};

export default NotFound;
