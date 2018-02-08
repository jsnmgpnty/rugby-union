import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import './Lobby.scss';
import pageNames from 'lib/pageNames';
import { setCurrentPage } from 'actions/navigation';
import LobbyHeader from './LobbyHeader';
import { GameCard } from 'components';

const mapDispatchToProps = dispatch => ({
	setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameLobby)),
});

class Lobby extends PureComponent {
  static propTypes = {

  };

  componentDidMount() {
    const {
			setCurrentPage,
		} = this.props;

		setCurrentPage();
  }
  
  render() {
    return (
      <div className="lobby">
        <LobbyHeader />
        <div className="game-list">
          <GameCard number={1} home="England" away="Scotland" playerCount={6} />
          <GameCard number={2} home="England" away="Scotland" playerCount={11} />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Lobby));
