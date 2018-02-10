import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import gameApi from 'services/GameApi';
import pageNames from 'lib/pageNames';
import { onGameLeft } from 'services/SocketClient';
import { TeamSelector, Spinner } from 'components';
import { setCurrentPage, setGame, isPageLoading } from 'actions/navigation';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gamePrepare)),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
});

const mapStateToProps = state => ({
  countries: state.countries,
  user: state.user,
});

class GameDetails extends PureComponent {
  static propTypes = {

  }

  render() {
    return (
      <div>
        <h2>Game</h2>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameDetails));
export { GameDetails as PlainGameDetails };
