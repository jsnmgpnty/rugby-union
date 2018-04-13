import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './Lobby.scss';
import pageNames from 'lib/pageNames';
import { onGameCreated } from 'services/SocketClient';
import { setCurrentPage, setGame, isGameSelectedOnLobby, resetNavRedirects } from 'actions/navigation';
import { getActiveGames, getLatestGameByUser, resetGameDetails } from 'actions/game';
import LobbyHeader from './LobbyHeader';
import { GameCard, Spinner } from 'components';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameLobby)),
  resetNavRedirects: () => dispatch(resetNavRedirects()),
  setGame: (game) => dispatch(setGame(game)),
  isGameSelectedOnLobby: (isSelected) => dispatch(isGameSelectedOnLobby(isSelected)),
  getActiveGames: () => dispatch(getActiveGames()),
  getLatestGameByUser: (userId) => dispatch(getLatestGameByUser(userId)),
  resetGameDetails: () => dispatch(resetGameDetails()),
});

const mapStateToProps = state => ({
  activeGames: state.game.activeGames,
  isGetActiveGamesBusy: state.game.isGetActiveGamesBusy,
  getActiveGamesError: state.game.getActiveGamesError,
  countries: state.countries.countries,
  user: state.user.user,
});

class Lobby extends PureComponent {
  async componentDidMount() {
    this.props.setCurrentPage(pageNames.gamePrepare);
    this.props.resetNavRedirects();
    this.props.resetGameDetails();
    this.getActiveGames();

    onGameCreated(this.handleGameCreated);
  }

  state = {
    isBusy: false,
    games: [],
    selectedGameId: null,
    activeGameId: null,
  };

  handleGameCreated = (data) => {
    this.setState({ games: this.state.games.concat(data) });
  }

  getCurrentGameByUser() {
    const { user, getLatestGameByUser } = this.props;
    getLatestGameByUser(user.userId);
  }

  getActiveGames() {
    const { isGetActiveGamesBusy, getActiveGames } = this.props;
    if (isGetActiveGamesBusy) {
      return;
    }

    getActiveGames();
  }

  onGameSelect = (game) => {
    this.setState({ selectedGameId: game.gameId });
    this.props.setGame(game);
    this.props.isGameSelectedOnLobby(true);
  }

  getCountryByTeam = (team) => {
    const country = this.props.countries.find(a => a.countryId === team.countryId);
    return country ? country : { name: 'N/A' };
  }

  render() {
    const { isGetActiveGamesBusy, activeGames } = this.props;
    const { selectedGameId } = this.state;

    return (
      <div className="lobby">
        <LobbyHeader />
        <Spinner isLoading={isGetActiveGamesBusy}>
          <div className="game-list">
            {
              activeGames && activeGames.length > 0 && activeGames.map((game, index) =>
                <GameCard
                  key={index}
                  number={index + 1}
                  game={game}
                  home={this.getCountryByTeam(game.teams[0])}
                  away={this.getCountryByTeam(game.teams[1])}
                  playerCount={game.players ? game.players.length : 0}
                  onSelect={this.onGameSelect}
                  isSelected={selectedGameId === game.gameId}
                />
              )
            }
          </div>
        </Spinner>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));
