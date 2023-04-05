import React from 'react';

import './BouncyLoader.scss';

const BouncyLoader = (): JSX.Element => {
  return (
    <div className='bouncy-loader-parent'>
      <div className='bouncy-loader'>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default BouncyLoader;
