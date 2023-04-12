import React from 'react';
import { useAppSelector } from '@renderer/hooks';

const Home = () => {
  const {userDetails} = useAppSelector(state => state.auth);

  return (
    <div>
      <h1>Home</h1>
      <p>{userDetails?.email}</p>
    </div>
  );
};

export default Home;
