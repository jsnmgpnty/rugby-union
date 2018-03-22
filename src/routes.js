import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Switch, Route, Redirect } from 'react-router';

import { Join, GameCreate, GamePrepare, Lobby, GameDetails } from 'view';

const propTypes = {
  location: PropTypes.object.isRequired,
};

function AppRoutes(props) {
  const isUserSignedIn = (RenderableComponent) => {
    if (props.location.pathname.indexOf('join') > -1) {
      return null;
    }

    const user = reactLocalStorage.getObject('user');
    if (user && user.userId && user.username) {
      return <RenderableComponent {...props.location} />;
    } else {
      return <Join />;
    }
  };

  return (
    <Switch>
      <Route exact path="/" render={() => isUserSignedIn(Lobby)} />
      <Route path="/create" render={() => isUserSignedIn(GameCreate)} />
      <Route path="/join" component={Join} />
      <Route path="/game/:gameId" render={() => isUserSignedIn(GamePrepare)} />
      <Route path="/game/:gameId/details" render={() => isUserSignedIn(GameDetails)} />
    </Switch>
  );
}

AppRoutes.propTypes = propTypes;

export default withRouter(AppRoutes);
