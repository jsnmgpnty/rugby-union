import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';

import { Join, GameCreate, GamePrepare, Lobby, GameDetails } from 'view';

import { Switch, Route, Redirect } from 'react-router';

const propTypes = {
  setUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

function AppRoutes(props) {
  return (
    <Switch>
      <Route path="/" exact component={Lobby} />
      <Route path="/create" exact component={GameCreate} />
      <Route path="/join" exact component={Join} />
      <Route path="/game/:gameId" exact component={GamePrepare} />
      <Route path="/game/:gameId/details" exact component={GameDetails} />
    </Switch>
  );
}

AppRoutes.propTypes = propTypes;

export default withRouter(AppRoutes);
