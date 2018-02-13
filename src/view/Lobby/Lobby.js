import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import './Lobby.scss';
import pageNames from 'lib/pageNames';
import gameApi from 'services/GameApi';
import { onGameCreated } from 'services/SocketClient';
import { setCurrentPage, setGame, isGameSelectedOnLobby } from 'actions/navigation';
import LobbyHeader from './LobbyHeader';
import { GameCard, Spinner } from 'components';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameLobby)),
  setGame: (game) => dispatch(setGame(game)),
  isGameSelectedOnLobby: (isSelected) => dispatch(isGameSelectedOnLobby(isSelected)),
});

const mapStateToProps = state => ({
  countries: state.countries.countries,
  game: state.navigation.game,
  user: state.user,
});

class Lobby extends PureComponent {
  async componentDidMount() {
    this.props.setCurrentPage(pageNames.gamePrepare);
    this.props.setGame(null);
    await this.getCurrentGameByUser();

    onGameCreated(this.handleGameCreated);
  }

  state = {
    isBusy: false,
    games: [],
    selectedGameId: null,
    activeGameId: null,
  };

  handleGameCreated = (data) => {
    this.setState({
      games: [...this.state.games, data],
    });
  }

  async getCurrentGameByUser() {
    const { user } = this.props;

    try {
      const game = await gameApi.getLatestGameByUser(user.userId);
      if (game && game.gameId) {
        this.props.setGame(game);
        this.setState({ activeGameId: game.gameId });
      } else {
        setCurrentPage();
        await this.getActiveGames();
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    const { games, isBusy, selectedGameId, activeGameId } = this.state;

    return (
      <div className="lobby">
        <LobbyHeader />
        <Spinner isLoading={isBusy}>
          <div className="game-list">
            {
              games && games.length > 0 && games.map((game, index) =>
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
        {
          activeGameId && <Redirect to={`/game/${activeGameId}`} />
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));
