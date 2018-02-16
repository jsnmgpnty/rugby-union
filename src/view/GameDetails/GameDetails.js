import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import gameApi from 'services/GameApi';
import pageNames from 'lib/pageNames';
import { onGameLeft, onGameStart, onGameJoin, onGameTurn, onGameScoreboard, onGameFinalResult } from 'services/SocketClient';
import { TeamSelector, Spinner } from 'components';
import { setCurrentPage, setGame, isPageLoading } from 'actions/navigation';
import { setPlayerToTackle, setPlayerToReceiveBall, isBallHandler } from 'actions/game';
import './GameDetails.scss';
import { Scoreboard } from 'components';
import TeamPlayer from '../../components/TeamSelector/TeamPlayer';
import uuid from 'uuid';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameDetails)),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
  setPlayerToTackle: (playerId) => dispatch(setPlayerToTackle(playerId)),
  setPlayerToReceiveBall: (playerId) => dispatch(setPlayerToReceiveBall(playerId)),
  isBallHandler: (val) => dispatch(isBallHandler(val)),
});

const mapStateToProps = state => ({
  countries: state.countries.countries,
  user: state.user.user,
});

class GameDetails extends PureComponent {
  state = {
    //Game State
    gameId: null,
    isBusy: false,
    isGameStarted: false,
    isGameCompleted: false,
    //Game Details
    game: null,
    currentTeam: null,
    ballHandlerTeam: null,
    currentTurnNumber: 0,
    winningTeam: null,
    isTackled: false,
    isTouchdown: false,
    isPlayerOnAttack: false,
    isPlayerHoldingBall: false,
    ballHolder: null,
    ballReceiver: null,
    votes: [],
  };

  async componentDidMount() {
    const { setCurrentPage, user } = this.props;
    const { params } = this.props.match;

    // socket io callbacks
    onGameTurn(this.handleGameTurn);
    onGameScoreboard(this.handleGameScoreboardUpdate)
    onGameFinalResult(this.handleGameFinalResult);

    setCurrentPage();
    onGameJoin({ gameId: params.gameId, userId: user.userId });
    this.setState({ gameId: params.gameId });
    await this.getGameState(params.gameId);
  }

  handleGameTurn = (data) => {
    const { currentTeam, isPlayerOnAttack, currentTurnNumber } = this.state;

    if (!data.latestTurn) {
      return;
    }
    
    const turn = data.latestTurn;

    // ball handler result
    if (isPlayerOnAttack) {
      if (data.turnNumber === currentTurnNumber) {
        this.setState({ ballReceiver: turn.passedTo });
      } else {
        this.setState({ ballHolder: turn.sender, ballReceiver: null });
        this.props.setPlayerToReceiveBall(null);
      }
      // tacklers results
    } else {
      const turn = data.latestTurn;
      if (data.turnNumber === currentTurnNumber) {
        this.setState({ votes: turn });
      } else {
        this.setState({ votes: [] });
      }
    }
  };

  handleGameScoreboardUpdate = (data) => {
    const { currentTurnNumber } = this.state;

    if (data.turnNumber > currentTurnNumber) {
      this.setState({ votes: [] });
    }

    this.setState({ isTackled: false, isTouchdown: false, currentTurnNumber: data.turnNumber });
  };

  handleGameFinalResult = (data) => {
    this.setState({ isTackled: data.gameResult === 2, isTouchdown: data.gameResult === 1, currentTurnNumber: data.turnNumber });
  };

  handleGameFinalScoreboardUpdate = (data) => {
    this.setState({ isTackled: false, isTouchdown: false, currentTurnNumber: data.turnNumber, winningTeam: data.winningTeam });
  };

  getGameState = async (gameId) => {
    const { user, isBallHandler } = this.props;
    const { isBusy } = this.state;

    if (isBusy) {
      return;
    }

    this.setState({ isBusy: true });

    try {
      const gameStateResult = await gameApi.getGameState(gameId, user.userId);

      if (gameStateResult) {
        switch (gameStateResult.gameStatus) {
          case 3:
            this.setState({ isGameCompleted: true });
            return;
          default:
            break;
        }

        this.props.setGame(gameStateResult);
        this.setState({ game: gameStateResult });

        if (gameStateResult.teamId) {
          const currentTeam = gameStateResult.teams.find(a => a.teamId === gameStateResult.teamId);
          const ballHandlerTeam = gameStateResult.teams.find(a => a.isBallHandler);

          const isPlayerOnAttack = currentTeam.isBallHandler;
          isBallHandler(isPlayerOnAttack);

          this.setState({ isPlayerOnAttack });

          if (gameStateResult.latestTurn) {
            if (isPlayerOnAttack) {
              const ballHolder = gameStateResult.latestTurn[0].sender;
              const isPlayerHoldingBall = ballHolder === user.userId;
              this.setState({ isPlayerHoldingBall, ballHolder });
            } else {
              this.setState({ votes: gameStateResult.latestTurn });
            }
          }

          this.setState({ currentTeam, ballHandlerTeam, currentTurnNumber: gameStateResult.turnNumber });
          onGameStart({ userId: user.userId, teamId: currentTeam.teamId });
        }

        if (gameStateResult.winningTeam) {
          this.setState({ winningTeam: gameStateResult.winningTeam, isTackled: gameStateResult.gameResult === 2, isTouchdown: gameStateResult.gameResult === 1 });
        }

        this.setState({ isBusy: false });
      }
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  };

  getGameDetails = () => {
    const { isTackled, isTouchdown, currentTurnNumber } = this.state;
    return { isTackled, currentTurnNumber, isSaved: isTouchdown };
  }

  getVotePerPlayerBadge = (userId) => {
    if (!userId) {
      return null;
    }

    const { votes } = this.state;
    const voters = votes.filter(a => a.toTackle === userId).length;

    if (voters === 0) {
      return null;
    }

    return <div className="player-badge vote"><span>{voters}</span></div>;
  }

  getCountryByTeam = (team) => {
    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);
    return country ? country : { name: 'N/A ' };
  }

  getMappedPlayers = (team) => {
    if (!team) {
      return [];
    }

    const { countries, user } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);

    const mappedPlayers = [];

    team.users.map((user) => {
      let player = country.players.find(p => p.playerId === user.playerId);
      if (!player) {
        player = {
          playerId: null,
          name: 'N/A',
          profilePicture: null
        };
      }

      const mappedPlayer = {
        user: {
          username: user.username,
          userId: user.userId,
        },
        player: {
          playerId: player.playerId,
          profilePicture: player.profilePicture,
          name: player.name,
        }
      };

      mappedPlayers.push(mappedPlayer);
    });

    return mappedPlayers;
  }

  onPlayerSelected = (teamId, playerId, userId) => {
    const { isPlayerOnAttack } = this.state;

    if (isPlayerOnAttack) {
      this.setState({ ballReceiver: userId });
      this.props.setPlayerToReceiveBall(userId);
    } else {
      this.props.setPlayerToTackle(userId);
    }
  }

  isPlayerClickable = () => {
    const { ballHolder, isPlayerOnAttack } = this.state;
    const { user } = this.props;

    if (isPlayerOnAttack) {
      return ballHolder === user.userId;
    }

    return true;
  }

  getGameResultDisplay() {
    const { isTackled, isTouchdown, isSaved, currentTurnNumber } = this.state;
    if (isTackled) {
      return "tackled";
    } else if (isTouchdown) {
      return "try";
    } else if (isSaved) {
      return "missed";
    }
    return "default";
  }

  onGameResult(game) {
    const turnNumber = game.turnNumber;
    if (game.winningTeam) {
      this.setState({ isTackled: true, isSaved: false, currentTurnNumber: turnNumber });
    } else {
      this.setState({ isSaved: true, isTackled: true, currentTurnNumber: turnNumber })
    }
  }

  render() {
    const {
      isBusy,
      game,
      currentTeam,
      isPlayerHoldingBall,
      isPlayerOnAttack,
      ballHolder,
      ballReceiver,
      ballHandlerTeam,
      currentTurnNumber,
    } = this.state;
    const { user } = this.props;
    const mappedPlayers = this.getMappedPlayers(ballHandlerTeam);
    const resultDisplay = this.getGameResultDisplay();

    return (
      <div className="gamedetails-view">
        <Spinner isLoading={isBusy}>
          {
            game && currentTeam && (
              <div>
                <div className="gamedetails-view__header">
                  <h2>{game.name}</h2>
                  <p>{`${this.getCountryByTeam(game.teams[0]).name} vs ${this.getCountryByTeam(game.teams[1]).name}`}</p>
                  <p>{`Turn ${currentTurnNumber}`}</p>
                </div>
                <Scoreboard game={this.getGameDetails()} teams={game.teams} />
                <p className="teamBallPosession">Defense Team (Scotland)</p>
                <p className="teamMissionDescription">Guess 1 player you think is the ball bearer if majority of the team guesses the right person your team wins the round.</p>
                <div className={`turnResultDisplay ${this.getGameResultDisplay()}`}></div>
                {
                  mappedPlayers.map(a => {
                    return (
                      <TeamPlayer key={uuid()} isClickable={this.isPlayerClickable()} currentUser={user.username} user={a.user} avatar={a.player} onClick={this.onPlayerSelected}>
                        {
                          isPlayerOnAttack && ballHolder === a.user.userId && <div className="player-badge ball"></div>
                        }
                        {
                          isPlayerOnAttack && ballReceiver === a.user.userId && <div className="player-badge ball receive"></div>
                        }
                        {
                          !isPlayerOnAttack && this.getVotePerPlayerBadge(a.user.userId)
                        }
                      </TeamPlayer>
                    )
                  })
                }
              </div>
            )
          }

        </Spinner>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameDetails));
export { GameDetails as PlainGameDetails };
