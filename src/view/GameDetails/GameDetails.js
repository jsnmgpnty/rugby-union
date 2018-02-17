import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import gameApi from 'services/GameApi';
import pageNames from 'lib/pageNames';
import { onGameStart, onGameJoin, onGameTurn, onGameScoreboard, onGameFinalResult } from 'services/SocketClient';
import { Spinner, SplashScreen, TeamPlayer, Scoreboard } from 'components';
import { setCurrentPage, setGame, isPageLoading } from 'actions/navigation';
import { setPlayerToTackle, setPlayerToReceiveBall, isBallHandler, lockTurn, unlockTurn, setGameStatus } from 'actions/game';
import './GameDetails.scss';
import uuid from 'uuid';
import DefendingTeam from './DefendingTeam';
import AttackingTeam from './AttackingTeam';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameDetails)),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
  setPlayerToTackle: (playerId) => dispatch(setPlayerToTackle(playerId)),
  setPlayerToReceiveBall: (playerId) => dispatch(setPlayerToReceiveBall(playerId)),
  isBallHandler: (val) => dispatch(isBallHandler(val)),
  lockTurn: () => dispatch(lockTurn()),
  unlockTurn: () => dispatch(unlockTurn()),
  setGameStatus: (status) => dispatch(setGameStatus(status)),
});

const mapStateToProps = state => ({
  countries: state.countries.countries,
  user: state.user.user,
  turnLocked: state.game.turnLocked,
  isGameTransitioning: state.game.status === 4,
});

class GameDetails extends PureComponent {
  state = {
    // game State
    game: null,
    isBusy: false,
    isGameStarted: false,
    isGameCompleted: false,
    currentRoundNumber: 0,
    currentTurnNumber: 0,
    gameScore: [],
    // round or turn state
    ballHandlerTeam: null,
    winningTeam: null,
    isTackled: false,
    isTouchdown: false,
    isPlayerOnAttack: false,
    ballHolder: null,
    ballReceiver: null,
    votes: [],
    countryName: null,
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
    const { isPlayerOnAttack, currentTurnNumber, currentRoundNumber, game } = this.state;
    const { user, setPlayerToTackle, setPlayerToReceiveBall, isBallHandler, lockTurn, unlockTurn, setGameStatus } = this.props;

    // if data, latest turn and game is null or undefined or game then what the fuq are we doing here
    if (!data || !data.latestTurn || !game) {
      return;
    }

    setGameStatus(data.gameStatus);

    // if we reached max rounds, then game has ended and skip the shenanigans
    if (game.maxRoundsPerGame === data.roundNumber && data.gameStatus === 3) {
      return;
    }

    // check if its a new round
    if (data.roundNumber > currentRoundNumber) {
      // if it's a new round, we set the new ballhandler
      const newBallHandlerTeam = game.teams.find(a => a.teamId === data.ballHandlerTeam);
      this.setState({ ballHandlerTeam: newBallHandlerTeam });

      // check if current player is in the new ballhandling team
      let isPlayerOnAttack = false;
      for (let i = 0; i < newBallHandlerTeam.users.length; i++) {
        if (newBallHandlerTeam.users[i].userId === user.userId) {
          isPlayerOnAttack = true;
          break;
        }
      }

      // set current state if player is on offense
      isBallHandler(isPlayerOnAttack);
      this.setState({ isPlayerOnAttack });

      if (isPlayerOnAttack) {
        // set the current ball holder
        const ballHolder = data.latestTurn[0].sender;
        const ballReceiver = data.latestTurn[0].passedTo;
        this.setState({ ballHolder, ballReceiver });
      } else {
        // we reset the votes
        this.setState({ votes: [] });
      }

      // reset selections on players
      setPlayerToReceiveBall(null);
      setPlayerToTackle(null);
      unlockTurn();

      // finally we set the current round and turn number (we reset the turn number as its a new round)
      this.setState({ currentTurnNumber: 1, currentRoundNumber: data.roundNumber });
    } else {
      // let's check first if this is a new turn
      if (data.turnNumber > currentTurnNumber) {
        // if it's a new turn, we set the new ball holder and reset the votes
        if (isPlayerOnAttack) {
          this.setState({ ballHolder: data.latestTurn[0].sender, ballReceiver: null });
        } else {
          this.setState({ votes: [] });
        }

        // reset selection on players
        setPlayerToReceiveBall(null);
        setPlayerToTackle(null);
        unlockTurn();
      } else {
        // if it's the same turn, then let's just update the current selections
        if (isPlayerOnAttack) {
          // set who receives the ball
          const ballReceiver = data.latestTurn[0].passedTo;
          this.setState({ ballReceiver });
          setPlayerToReceiveBall(null);

          if (ballReceiver) {
            lockTurn();
          } else {
            unlockTurn();
          }
        } else {
          this.setVotes(data.latestTurn);
        }
      }

      // set the current turn number
      this.setState({ currentTurnNumber: data.turnNumber });
    }

    // let's set the game score
    this.setState({ gameScore: data.scores })
  };

  handleGameFinalResult = (data) => {
    const { setPlayerToTackle, setPlayerToReceiveBall } = this.props;
    setPlayerToReceiveBall(null);
    setPlayerToTackle(null);
    this.setState({ currentRoundNumber: data.roundNumber, currentTurnNumber: data.turnNumber, winningTeam: data.winningTeam, gameScore: data.scores });
  };

  handleGameFinalScoreboardUpdate = (data) => {
    this.setState({ isTackled: false, isTouchdown: false, currentTurnNumber: data.turnNumber, winningTeam: data.winningTeam });
  };

  setVotes = (votes) => {
    this.setState({ votes });

    const currentUserId = this.props.user.userId;
    if (votes.some(v => v.sender === currentUserId && v.toTackle)) {
      this.props.lockTurn();
    }
  }

  getGameState = async (gameId) => {
    const { user, isBallHandler, lockTurn, unlockTurn, setGameStatus } = this.props;
    const { isBusy } = this.state;

    if (isBusy) {
      return;
    }

    this.setState({ isBusy: true });

    try {
      const gameStateResult = await gameApi.getGameState(gameId, user.userId);

      if (gameStateResult) {
        setGameStatus(gameStateResult.gameStatus);
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
          const countryName = this.props.countries.find(c => c.countryId === currentTeam.countryId).name;
          const ballHandlerTeam = gameStateResult.teams.find(a => a.isBallHandler);
          const isPlayerOnAttack = currentTeam.isBallHandler;
          isBallHandler(isPlayerOnAttack);

          this.setState({ isPlayerOnAttack });
          if (gameStateResult.latestTurn) {
            if (isPlayerOnAttack) {
              const ballHolder = gameStateResult.latestTurn[0].sender;
              const ballReceiver = gameStateResult.latestTurn[0].passedTo;
              this.setState({ ballHolder, ballReceiver });

              if (ballReceiver) {
                lockTurn();
              } else {
                unlockTurn();
              }
            } else {
              this.setVotes(gameStateResult.latestTurn);
            }
          }

          this.setState({ ballHandlerTeam, currentTurnNumber: gameStateResult.turnNumber, currentRoundNumber: gameStateResult.roundNumber, countryName });
          onGameStart({ userId: user.userId, teamId: currentTeam.teamId });
        }

        if (gameStateResult.scores) {
          this.setState({ gameScore: gameStateResult.scores })
        }

        if (gameStateResult.winningTeam) {
          this.setState({ winningTeam: gameStateResult.winningTeam });
        }

        if (gameStateResult.gameStatus === 4) {
          const roundResult = gameStateResult.roundResult;
          const isTouchdown = roundResult === 1;
          const isTackled = roundResult === 2;
          const isSaved = roundResult === 3;
          this.setState({ isTackled, isTouchdown, isSaved});
        } else {
          this.setState({ isTackled: false, isTouchdown: false, isSaved: false });
        }

        this.setState({ isBusy: false });
      }
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  };

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
  };

  getCountryByTeam = (team) => {
    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);
    return country ? country : { name: 'N/A ' };
  };

  getMappedPlayers = (team) => {
    if (!team) {
      return [];
    }

    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);

    const mappedPlayers = team.users.map((user) => {
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

      return mappedPlayer;
    });

    return mappedPlayers;
  };

  getMappedTeamCountries = () => {
    const { game } = this.state;
    const { countries } = this.props;

    const mappedTeams = [];

    if (game.teams) {
      game.teams.forEach(team => {
        const mappedTeam = { ...team };
        const country = countries.find(a => a.countryId === team.countryId);

        if (country) {
          mappedTeam.country = country;
        }

        mappedTeams.push(mappedTeam);
      });
    }

    return mappedTeams;
  };

  onPlayerSelected = (teamId, playerId, userId) => {
    const { isPlayerOnAttack } = this.state;

    if (isPlayerOnAttack) {
      this.setState({ ballReceiver: userId });
      this.props.setPlayerToReceiveBall(userId);
    } else {
      this.props.setPlayerToTackle(userId);
    }
  };

  isPlayerClickable = () => {
    const { ballHolder, isPlayerOnAttack } = this.state;
    const { user } = this.props;

    if (isPlayerOnAttack) {
      return ballHolder === user.userId;
    }

    return true;
  };

  getRoundResultDisplay = () => {
    if (!this.props.isGameTransitioning) {
      return "default";
    }

    const { isTackled, isTouchdown, isSaved } = this.state;

    if (isTackled) {
      return "tackled";
    } else if (isTouchdown) {
      return "try";
    } else if (isSaved) {
      return "missed";
    }
    return "default";
  };

  onGameResult(game) {
    const turnNumber = game.turnNumber;
    if (game.winningTeam) {
      this.setState({ isTackled: true, isSaved: false, currentTurnNumber: turnNumber });
    } else {
      this.setState({ isSaved: true, isTackled: true, currentTurnNumber: turnNumber })
    }
  };

  render() {
    const {
      isBusy,
      isTackled,
      game,
      isPlayerOnAttack,
      ballHolder,
      ballReceiver,
      ballHandlerTeam,
      currentTurnNumber,
      currentRoundNumber,
      gameScore,
      winningTeam,
      countryName,
      votes,
    } = this.state;
    const { user, turnLocked } = this.props;

    const mappedPlayers = this.getMappedPlayers(ballHandlerTeam);

    return (
      <div className="gamedetails-view">
        {
          winningTeam && <SplashScreen teams={this.getMappedTeamCountries()} winningTeam={winningTeam} gameScore={gameScore} />
        }
        <Spinner isLoading={isBusy}>
          {
            game && (
              <div>
                <div className="gamedetails-view__header">
                  <h2>{game.name}</h2>
                  <p>{`${this.getCountryByTeam(game.teams[0]).name} vs ${this.getCountryByTeam(game.teams[1]).name}`}</p>
                  <p>{`Round ${currentRoundNumber} of ${game.maxRoundsPerGame} - Turn ${currentTurnNumber}`}</p>
                </div>
                <Scoreboard
                  roundNumber={currentRoundNumber}
                  turnNumber={currentTurnNumber}
                  isTackled={isTackled}
                  teams={game.teams}
                  gameScore={gameScore}
                />
                {
                  isPlayerOnAttack ?
                    <AttackingTeam
                      getRoundResultDisplay={this.getRoundResultDisplay}
                      country={countryName}
                      players={mappedPlayers}
                      currentUser={user}
                      onPlayerSelected={this.onPlayerSelected}
                      ballHolder={ballHolder}
                      ballReceiver={ballReceiver}
                      turnLocked={turnLocked} /> :
                    <DefendingTeam
                      getRoundResultDisplay={this.getRoundResultDisplay}
                      country={countryName}
                      players={mappedPlayers}
                      currentUser={user}
                      onPlayerSelected={this.onPlayerSelected}
                      turnLocked={turnLocked}
                      votes={votes} />
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
