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
  const isUserSignedIn = (RenderableComponent) => {
    const user = reactLocalStorage.getObject('user');
    if (user && user.userId && user.username) {
      props.setUser(user);
      return <RenderableComponent {...props.location} />;
    } else {
      return <Redirect to="/join" />;
    }
  };

  return (
    <Switch>
      <Route path="/" exact render={() => isUserSignedIn(Lobby)} />
      <Route path="/create" exact render={() => isUserSignedIn(GameCreate)} />
      <Route path="/join" exact component={Join} />
      <Route path="/game/:gameId" exact render={() => isUserSignedIn(GamePrepare)} />
      <Route path="/game/:gameId/details" exact render={() => isUserSignedIn(GameDetails)} />
    </Switch>
  );
}

AppRoutes.propTypes = propTypes;

export default withRouter(AppRoutes);
