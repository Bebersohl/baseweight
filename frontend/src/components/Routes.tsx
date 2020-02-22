import React from 'react';
import { Router } from '@reach/router';
import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

const Routes: React.FC = () => {
  return (
    <Router>
      <HomeScreen path="/" />
      <ListScreen path="list/:listId" />
      <NotFoundScreen default />
    </Router>
  );
};

export default Routes;
