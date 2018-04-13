import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { remove } from 'lodash';

import pageNames from 'lib/pageNames';
import { onGameJoin, onGameJoined, onGameLeft, onGameStarted } from 'services/SocketClient';
import { TeamSelector, Spinner, FullDialog } from 'components';
import { getGame, setGame, setCurrentTeam } from 'actions/game';
import { toggleTeamSpinners, joinGame } from 'actions/createGame';
import { setCurrentPage, isGameReadyToStart, isPageLoading, resetNavRedirects } from 'actions/navigation';
import TeamSpinner from './TeamSpinner';
import './GamePrepare.scss';

const defaultNumberOfPlayersPerTeam = 2;

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gamePrepare)),
  resetNavRedirects: () => dispatch(resetNavRedirects()),
  isGameReadyToStart: (ready) => dispatch(isGameReadyToStart(ready)),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
  setCurrentTeam: (team) => dispatch(setCurrentTeam(team)),
  getGame: (gameId) => dispatch(getGame(gameId)),
  toggleTeamSpinners: (gameId, showTeamSpinners) => dispatch(toggleTeamSpinners(gameId, showTeamSpinners)),
  joinGame: (gameId, teamId, userId, avatarId) => dispatch(joinGame(gameId, teamId, userId, avatarId)),
});

const mapStateToProps = state => ({
  countries: state.countries.countries,
  user: state.user.user,
  isGetGameRequestBusy: state.game.isGetGameRequestBusy,
  getGameRequestError: state.game.getGameRequestError,
  currentGame: state.game.currentGame,
  ...state.createGame,
});

class GameLobby extends PureComponent {
  constructor(props) {
    super(props);

    onGameJoined(this.handleGameJoin);
    onGameLeft(this.handleGameLeft);
    onGameStarted(this.handleGameStarted);

    this.joinGame = this.joinGame.bind(this);
  }

  state = {
    gameId: null,
    goToLobby: false,
    goToGameProper: false,
  };

  componentDidMount() {
    const { setCurrentPage, resetNavRedirects, user } = this.props;
    const { params } = this.props.match;

    setCurrentPage();
    resetNavRedirects();
    onGameJoin({ gameId: params.gameId, userId: user.userId });
    isGameReadyToStart(false);
    this.setState({ gameId: params.gameId });
    this.getGame(params.gameId);
  }

  getGame = (gameId) => {
    const { isGetGameRequestBusy, getGame } = this.props;
    if (isGetGameRequestBusy) {
      return;
    }

    getGame(gameId);
  };

  handleGameJoin = (data) => {
    const { currentGame, setGame } = this.props;

    if (data.teamId && data.game && currentGame) {
      currentGame.players = data.game.players;

      currentGame.teams.forEach(team => {
        if (team.teamId === data.teamId) {
          if (!team.users) {
            team.users = [];
          }

          const existingPlayer = team.users.find((t) => { return t.userId === data.userAvatar.userId });
          if (!existingPlayer) {
            team.users.push(data.userAvatar);
          } else {
            if (existingPlayer.playerId !== data.userAvatar.playerId) {
              existingPlayer.playerId = data.userAvatar.playerId;
            }
          }
        } else {
          remove(team.users, (user) => {
            return user.userId === data.userAvatar.userId;
          });
        }
      });

      const player = currentGame.players.find(a => a.userId === data.userAvatar.userId);
      if (player) {
        if (player.playerId !== data.userAvatar.playerId) {
          player.playerId = data.userAvatar.playerId;
        }
      }

      setGame(currentGame);
      this.isGameReady();
    }
  };

  handleGameLeft = (data) => {
    const { currentGame } = this.props;

    remove(currentGame.players, (player) => {
      return player.username === data.username;
    });

    currentGame.teams.forEach((team) => {
      remove(team.players, (player) => {
        return player.username === data.username;
      });
    });

    if (data.username === this.props.user.username) {
      this.setState({ goToLobby: true });
    }
  };

  handleGameStarted = async (data) => {
    if (!data.error) {
      const { currentGame, isPageLoading, toggleTeamSpinners } = this.props;

      if (currentGame) {
        isPageLoading(false);
        toggleTeamSpinners(currentGame.gameId, true);
      }
    }
  };

  isGameReady = () => {
    const { isGameReadyToStart, currentGame } = this.props;

    const firstTeamPlayers = currentGame.teams[0].users ? currentGame.teams[0].users.length : 0;
    const secondTeamPlayers = currentGame.teams[1].users ? currentGame.teams[1].users.length : 0;

    if (firstTeamPlayers >= defaultNumberOfPlayersPerTeam
      && secondTeamPlayers >= defaultNumberOfPlayersPerTeam
      && firstTeamPlayers === secondTeamPlayers) {
      isGameReadyToStart(true);
    }
  };

  async joinGame(teamId, avatarId) {
    const { user, currentGame, joinGame } = this.props;

    const isAvatarInUse = currentGame.teams.some((team) => {
      if (team.teamId !== teamId) {
        return false;
      }

      return team.users.some(a => a.playerId === avatarId);
    });

    if (!isAvatarInUse) {
      joinGame(currentGame.gameId, teamId, user.userId, avatarId);
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

  onCloseTeamSpinner = () => {
    const { currentGame, toggleTeamSpinners } = this.props;
    toggleTeamSpinners(currentGame.gameId);
    this.setState({ goToGameProper: true });
  }

  getCurrentUserTeam = () => {
    const { user, currentGame } = this.props;

    let teamId = null;

    currentGame.teams.forEach((team) => {
      const tUser = team.users.find(a => a.userId === user.userId);
      if (tUser) {
        teamId = team.teamId;
      }
    });

    return teamId;
  }

  render() {
    const {
      gameId,
      goToLobby,
      goToGameProper,
    } = this.state;

    const {
      isTeamSpinnersVisible,
      isGetGameRequestBusy,
      currentGame,
      user,
    } = this.props;

    return (
      <div id={`game-prepare__${gameId}`} className="game-prepare__view">
        <Spinner isLoading={isGetGameRequestBusy}>
          {
            currentGame ? (
              <Fragment>
                <div className="game-prepare__content">
                  <div className="game-prepare__header">
                    <h2>{currentGame.name}</h2>
                    <h4>{this.getLobbySubTitle()}</h4>
                  </div>
                  <div className="game-prepare__teams">
                    {
                      currentGame.teams.map((team) => (
                        <div className="game-prepare__teams-item" key={team.teamId}>
                          <TeamSelector
                            currentUser={user.userId}
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
                {
                  goToGameProper && currentGame.gameStatus === 1 && <Redirect to={`/game/${gameId}/details`} key="prep-details" />
                }
                {
                  (currentGame.gameStatus === 3 || goToLobby) && <Redirect to="/" key="prep-lobby" />
                }
                {
                  isTeamSpinnersVisible &&
                  <FullDialog buttonText="OK, I'm ready" onButtonClick={this.onCloseTeamSpinner}>
                    <TeamSpinner teams={currentGame.teams} currentTeam={this.getCurrentUserTeam()} />
                  </FullDialog>
                }
              </Fragment>
            ) : <p>No game found</p>
          }
        </Spinner>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameLobby));
export { GameLobby as PlainGameLobby };
