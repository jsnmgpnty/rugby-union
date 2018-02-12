import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { remove } from 'lodash';

import gameApi from 'services/GameApi';
import pageNames from 'lib/pageNames';
import { onGameJoined, onGameLeft, onGameStarted } from 'services/SocketClient';
import { TeamSelector, Spinner } from 'components';
import { setCurrentPage, setGame, isGameReadyToStart, isPageLoading } from 'actions/navigation';
import './GamePrepare.scss';

const defaultNumberOfPlayersPerTeam = 5;

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gamePrepare)),
  isGameReadyToStart: (ready) => dispatch(isGameReadyToStart(ready)),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
});

const mapStateToProps = state => ({
  countries: state.countries.countries,
  user: state.user.user,
});

class GameLobby extends PureComponent {
  constructor(props) {
    super(props);

    onGameJoined(this.handleGameJoin);
    onGameLeft(this.handleGameLeft);
    onGameStarted(this.handleGameStarted);
  }

  state = {
    gameId: null,
    game: null,
    isBusy: false,
    currentAvatarId: null,
    currentTeamId: null,
    isGameStarted: false,
    isGameCompleted: false,
    goToLobby: false,
  };

  async componentDidMount() {
    const { setCurrentPage } = this.props;
    const { params } = this.props.match;

    setCurrentPage();
    isGameReadyToStart(false);
    this.setState({ gameId: params.gameId });
    await this.getGame(params.gameId);
  }

  getGame = async (gameId) => {
    const { isBusy } = this.state;
    if (isBusy) {
      return;
    }

    this.setState({ isBusy: true });

    try {
      const game = await gameApi.getGame(gameId);

      if (game) {
        switch (game.status) {
          case 'INPROGRESS':
          case 'PAUSED':
            this.setState({ isGameStarted: true });
            break;
          case 'COMPLETED':
            this.setState({ isGameCompleted: true });
            break;
          default:
            break;
        }
        
        this.props.setGame(game);
        this.setState({ game, isBusy: false }, this.isGameReady);
      }
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  };

  handleGameJoin = (data) => {
    const { game } = this.state;

    if (data.teamId) {
      game.teams.forEach(team => {
        if (team.teamId === data.teamId) {
          if (!team.players) {
            team.players = [];
          }

          const existingPlayer = team.players.find((t) => { return t.username === data.username });
          if (!existingPlayer) {
            team.players.push({ username: data.username, avatarId: data.avatarId });
          } else {
            if (existingPlayer.avatarId !== data.avatarId) {
              existingPlayer.avatarId = data.avatarId;
            }
          }
        } else {
          remove(team.players, (player) => {
            return player.username === data.username;
          });
        }
      });

      const player = game.players.find(a => a.username === data.username);
      if (player) {
        if (player.avatarId !== data.avatarId) {
          player.avatarId = data.avatarId;
        }
      }

      this.setState({ game: { ...game } });
    }
  };

  handleGameLeft = (data) => {
    const { game } = this.state;

    remove(game.players, (player) => {
      return player.username === data.username;
    });

    game.teams.forEach((team) => {
      remove(team.players, (player) => {
        return player.username === data.username;
      });
    });

    if (data.username === this.props.user.username) {
      this.setState({ goToLobby: true });
    }
  };

  handleGameStarted = (data) => {
    if (!data.error) {
      this.props.isPageLoading(false);
      this.setState({ isGameStarted: true });
    }
  };

  isGameReady = () => {
    const { game } = this.state;
    const { isGameReadyToStart } = this.props;

    const firstTeamPlayers = game.teams[0].players ? game.teams[0].players.length : 0;
    const secondTeamPlayers = game.teams[1].players ? game.teams[1].players.length : 0;

    if (firstTeamPlayers === defaultNumberOfPlayersPerTeam && secondTeamPlayers === defaultNumberOfPlayersPerTeam) {
      isGameReadyToStart(true);
    }
  };

  async joinGame(teamId, avatarId) {
    const { game } = this.state;
    const { user } = this.props;

    let isAvatarInUse = false;
    game.teams.every((team) => {
      const avatar = team.players.find(a => a.avatarId === avatarId);
      if (avatar) {
        isAvatarInUse = true;
        return false;
      }

      return true;
    });

    if (!isAvatarInUse) {
      const result = await gameApi.joinGame(game.gameId, teamId, user.userId, avatarId);
      if (result.isSuccess) {
        console.log(result);
      }
    }
  };

  getCountry = (countryId) => {
    const { countries } = this.props;
    const country = countries.find((c) => c.countryId === countryId);

    return country || { countryId: 99, name: 'Unknown', players: [] };
  };

  getLobbySubTitle = () => {
    const { game } = this.state;

    if (!game) {
      return '';
    }

    const firstCountry = this.getCountry(game.teams[0].countryId);
    const secondCountry = this.getCountry(game.teams[1].countryId);

    return `${firstCountry.name} vs ${secondCountry.name}`;
  };

  render() {
    const {
      gameId,
      game,
      isBusy,
      isGameStarted,
      isGameCompleted,
      goToLobby,
    } = this.state;

    const { countries, user } = this.props;

    return (
      <div id={`game-prepare__${gameId}`} className="game-prepare__view">
        <Spinner isLoading={isBusy}>
          {
            game ? (
              <div className="game-prepare__content">
                <div className="game-prepare__header">
                  <h2>{game.gameId}</h2>
                  <h4>{this.getLobbySubTitle()}</h4>
                </div>
                <div className="game-prepare__teams">
                  {
                    game.teams.map((team) => (
                      <div className="game-prepare__teams-item" key={team.teamId}>
                        <TeamSelector
                          currentUser={user.username}
                          teamId={team.teamId}
                          players={team.users}
                          country={this.getCountry(team.countryId)}
                          onJoin={this.joinGame}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            ) : <p>No game found</p>
          }
          {
            isGameStarted && <Redirect to={`/game/${gameId}/details`} />
          }
          {
            (isGameCompleted || goToLobby) && <Redirect to="/" />
          }
        </Spinner>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameLobby));
export { GameLobby as PlainGameLobby };
