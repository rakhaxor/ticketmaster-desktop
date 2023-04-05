import React from 'react';

import './Loader.scss';

interface Props {
  loading: boolean;
}

const Loader = ({ loading }: Props): JSX.Element => {
  return <span>{loading ? <div className='loading'>Loading&#8230;</div> : null}</span>;
};

export default Loader;
