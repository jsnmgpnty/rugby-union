import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import './Lobby.scss';
import pageNames from 'lib/pageNames';
import gameApi from 'services/GameApi';
import { setCurrentPage, setGameId, isGameSelectedOnLobby } from 'actions/navigation';
import LobbyHeader from './LobbyHeader';
import { GameCard, Spinner } from 'components';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameLobby)),
  setGameId: (gameId) => dispatch(setGameId(gameId)),
});

class Lobby extends PureComponent {
  async componentDidMount() {
    const {
      setCurrentPage,
      setGameId,
		} = this.props;

    setCurrentPage();
    setGameId(null);
    await this.getActiveGames();
  }

  state = {
    isBusy: false,
    games: [],
  };

  async getActiveGames() {
    const { isBusy } = this.state;
    if (isBusy) {
      return;
    }

    this.setState({ isBusy: true });

    try {
      const games = await gameApi.getGames();
      this.setState({ games, isBusy: false });
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  }

  onGameSelect = (gameId) => {
    this.props.setGameId(gameId);
  }

  render() {
    const { games, isBusy } = this.state;

    return (
      <div className="lobby">
        <LobbyHeader />
        <Spinner isLoading={isBusy}>
          <div className="game-list">
            {
              games && games.length > 0 && games.map((game, index) =>
                <GameCard
                  key={index}
                  home={game.teams[0].name}
                  away={game.teams[1].name}
                  playerCount={game.players.length}
                />
              )
            }
          </div>
        </Spinner>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Lobby));
