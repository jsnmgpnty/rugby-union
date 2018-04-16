import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import pageNames from 'lib/pageNames';
import { onGameJoin, onGameTurn, onGameScoreboard, onGameFinalResult } from 'services/SocketClient';
import { Spinner, SplashScreen, Scoreboard, RoundResult } from 'components';
import { setCurrentPage, setGame, isPageLoading, resetNavRedirects } from 'actions/navigation';
import {
  setPlayerToTackle,
  setPlayerToReceiveBall,
  setBallHandler,
  lockTurn,
  unlockTurn,
  setGameStatus,
  getGameState,
  setBallHandlerTeam,
  setTurnNumber,
  setRoundNumber,
  setScores,
  setWinningTeam,
  setIsPlayerOnAttack,
  setVotes,
  setRoundResults,
} from 'actions/game';
import DefendingTeam from './DefendingTeam';
import AttackingTeam from './AttackingTeam';

import './GameDetails.scss';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameDetails)),
  resetNavRedirects: () => dispatch(resetNavRedirects()),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
  setPlayerToTackle: (playerId) => dispatch(setPlayerToTackle(playerId)),
  setPlayerToReceiveBall: (playerId) => dispatch(setPlayerToReceiveBall(playerId)),
  setBallHandler: (isBallHandler, ballHandler) => dispatch(setBallHandler(isBallHandler, ballHandler)),
  lockTurn: () => dispatch(lockTurn()),
  unlockTurn: () => dispatch(unlockTurn()),
  setGameStatus: (status) => dispatch(setGameStatus(status)),
  setVotes: (votes, userId) => dispatch(setVotes(votes, userId)),
  setBallHandlerTeam: (ballHandlerTeam) => dispatch(setBallHandlerTeam(ballHandlerTeam)),
  setTurnNumber: (turnNumber) => dispatch(setTurnNumber(turnNumber)),
  setRoundNumber: (roundNumber) => dispatch(setRoundNumber(roundNumber)),
  setScores: (scores) => dispatch(setScores(scores)),
  setWinningTeam: (winningTeam) => dispatch(setWinningTeam(winningTeam)),
  getGameState: (gameId, userId) => dispatch(getGameState(gameId, userId)),
  setIsPlayerOnAttack: (isPlayerOnAttack) => dispatch(setIsPlayerOnAttack(isPlayerOnAttack)),
  setRoundResults: (roundResults) => dispatch(setRoundResults(roundResults)),
});

const mapStateToProps = state => ({
  countries: state.countries.countries,
  user: state.user.user,
  isGameTransitioning: state.game.status === 4,
  ...state.game,
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
    isRoundResultShown: false,
    isRoundWinner: false,
    // round or turn state
    roundResults: [],
    ballHandlerTeam: null,
    winningTeam: null,
    currentUserTeam: null,
    isTackled: false,
    isTouchdown: false,
    isPlayerOnAttack: false,
    ballHolder: null,
    ballReceiver: null,
    votes: [],
    countryName: null,
    isNewTurn: false,
  };

  async componentDidMount() {
    const { setCurrentPage, user, resetNavRedirects, getGameState } = this.props;
    const { params } = this.props.match;

    // socket io callbacks
    onGameTurn(this.handleGameTurn);
    onGameScoreboard(this.handleGameScoreboardUpdate)
    onGameFinalResult(this.handleGameFinalResult);

    setCurrentPage();
    resetNavRedirects();
    onGameJoin({ gameId: params.gameId, userId: user.userId });
    getGameState(params.gameId, user.userId);
  }

  handleGameTurn = (data) => {
    const {
      user,
      setPlayerToTackle,
      setPlayerToReceiveBall,
      setBallHandler,
      setTurnNumber,
      setRoundNumber,
      lockTurn,
      unlockTurn,
      setGameStatus,
      setVotes,
      setScores,
      setBallHandlerTeam,
      setIsPlayerOnAttack,
      isPlayerOnAttack,
      currentTurnNumber,
      currentRoundNumber,
      currentGame,
      setRoundResults,
    } = this.props;

    // if data, latest turn and game is null or undefined or game then what the fuq are we doing here
    if (!data || !data.latestTurn || !currentGame) {
      return;
    }

    setGameStatus(data.gameStatus);

    // if we reached max rounds, then game has ended and skip the shenanigans
    if (currentGame.maxRoundsPerGame === data.roundNumber && data.gameStatus === 3) {
      return;
    }

    // check if its a new round
    if (data.roundNumber > currentRoundNumber) {
      // if it's a new round, we set the new ballhandler
      const newBallHandlerTeam = currentGame.teams.find(a => a.teamId === data.ballHandlerTeam);
      setBallHandlerTeam(newBallHandlerTeam);
      this.setState({ isNewTurn: true });

      // check if current player is in the new ballhandling team
      let isPlayerOnAttack = false;
      for (let i = 0; i < newBallHandlerTeam.users.length; i++) {
        if (newBallHandlerTeam.users[i].userId === user.userId) {
          isPlayerOnAttack = true;
          break;
        }
      }

      // set current state if player is on offense
      setIsPlayerOnAttack(isPlayerOnAttack);

      if (isPlayerOnAttack) {
        // set the current ball holder
        const ballHolder = data.latestTurn[0].sender;
        const ballReceiver = data.latestTurn[0].passedTo;
        setBallHandler(true, ballHolder);
        setPlayerToReceiveBall(ballReceiver);
      } else {
        // we reset the votes
        setVotes([], null);
        setBallHandler(false, null);
      }

      // reset selections on players
      setPlayerToReceiveBall(null);
      setPlayerToTackle(null);
      unlockTurn();

      // finally we set the current round and turn number (we reset the turn number as its a new round)
      setRoundNumber(data.roundNumber);
      setTurnNumber(1);
      this.setState({ isTackled: false, isTouchdown: false, isSaved: false });
    } else {
      // let's check first if this is a new turn
      if (data.turnNumber > currentTurnNumber) {
        // if it's a new turn, we set the new ball holder and reset the votes
        if (isPlayerOnAttack) {
          setBallHandler(user.userId === data.latestTurn[0].sender, data.latestTurn[0].sender);
          setPlayerToReceiveBall(null);
        } else {
          setVotes([], null);
        }

        // reset selection on players
        setPlayerToReceiveBall(null);
        setPlayerToTackle(null);
        unlockTurn();
      } else {
        // if it's the same turn, then let's just update the current selections
        if (isPlayerOnAttack) {
          // set who receives the ball
          const ballReceiver = data.latestTurn[0] ? data.latestTurn[0].passedTo : null;
          setPlayerToReceiveBall(ballReceiver);

          if (ballReceiver) {
            lockTurn();
          } else {
            unlockTurn();
          }
        } else {
          setVotes(data.latestTurn, user.userId);
        }

        if (data.gameStatus === 4) {
          const roundResult = data.roundResult;
          const isTouchdown = roundResult === 1;
          const isTackled = roundResult === 2;
          const isSaved = roundResult === 3;
          let isRoundWinner = false;

          // we set round winner flag if player holds ball and we receive touchdown status
          if (isPlayerOnAttack && isTouchdown) {
            isRoundWinner = true;
          }

          // we set round winner flag if player is defending and we receive tackled status
          if (!isPlayerOnAttack && isTackled) {
            isRoundWinner = true;
          }

          setRoundResults({
            isTouchdown,
            isTackled,
            isSaved,
            isRoundWinner,
          });

          this.setState({ isTackled, isTouchdown, isSaved });
        } else {
          this.setState({ isTackled: false, isTouchdown: false, isSaved: false });
        }
      }

      // set the current turn number
      setTurnNumber(data.turnNumber);
    }

    // let's set the game score
    setScores(data.scores);

    // hack!! get new game state
    // this.getGameState(data.gameId);
  }

  handleGameFinalResult = (data) => {
    const { setPlayerToTackle, setPlayerToReceiveBall, setRoundNumber, setTurnNumber, setWinningTeam, setScores } = this.props;
    setPlayerToReceiveBall(null);
    setPlayerToTackle(null);
    setRoundNumber(data.roundNumber);
    setTurnNumber(data.turnNumber);
    setWinningTeam(data.winningTeam);
    setScores(data.scores);
  }

  handleGameFinalScoreboardUpdate = (data) => {
    const { setRoundNumber, setTurnNumber, setWinningTeam } = this.props;
    setRoundNumber(data.roundNumber);
    setTurnNumber(data.turnNumber);
    setWinningTeam(data.winningTeam);
  }

  getVotePerPlayerBadge = (userId) => {
    if (!userId) {
      return null;
    }

    const { currentVotes } = this.props;
    const voters = currentVotes.filter(a => a.toTackle === userId).length;

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
  }

  getMappedTeamCountries = () => {
    const { countries, currentGame } = this.props;
    const mappedTeams = [];

    if (currentGame.teams) {
      currentGame.teams.forEach(team => {
        const mappedTeam = { ...team };
        const country = countries.find(a => a.countryId === team.countryId);

        if (country) {
          mappedTeam.country = country;
        }

        mappedTeams.push(mappedTeam);
      });
    }

    return mappedTeams;
  }

  onPlayerSelected = (teamId, playerId, userId) => {
    const { isPlayerOnAttack, setPlayerToReceiveBall, setPlayerToTackle } = this.props;

    if (isPlayerOnAttack) {
      setPlayerToReceiveBall(userId);
    } else {
      setPlayerToTackle(userId);
    }
  }

  isPlayerClickable = () => {
    const { user, ballHandler, isPlayerOnAttack } = this.props;

    if (isPlayerOnAttack) {
      return ballHandler === user.userId;
    }

    return true;
  }

  getLastRoundResult = () => {
    const { roundResults } = this.props;

    if (roundResults && roundResults.length > 1) {
      return roundResults[roundResults.length - 1];
    }

    return null;
  }

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
  }

  onGameResult(game) {
    const { setTurnNumber } = this.props;
    const turnNumber = game.turnNumber;

    if (game.winningTeam) {
      setTurnNumber(turnNumber);
      this.setState({ isTackled: true, isSaved: false });
    } else {
      setTurnNumber(turnNumber);
      this.setState({ isSaved: true, isTackled: true })
    }
  }

  checkShouldDisplayRoundResult() {
    return this.state.isNewTurn;
  }

  closeRoundResult = () => {
    this.setState({ isNewTurn: false, isRoundWinner: false });
  }

  getCurrentPlayerVote = () => {
    const { user, currentVotes } = this.props;

    if (currentVotes && currentVotes.length > 0) {
      const playerVote = currentVotes.find(a => a.sender === user.userId);
      return playerVote;
    }

    return null;
  }

  getCountryName = () => {
    const { countries, currentTeam } = this.props;

    if (currentTeam) {
      const countryName = countries.find(c => c.countryId === currentTeam.countryId).name;
      return countryName;
    }

    return 'N/A';
  }

  render() {
    const {
      user,
      turnLocked,
      isGetGameStateBusy,
      currentGame,
      isPlayerOnAttack,
      ballHandler,
      playerToReceiveBall,
      ballHandlerTeam,
      currentTurnNumber,
      currentRoundNumber,
      currentScores,
      winningTeam,
      currentTeam,
      currentVotes,
    } = this.props;

    const { isTouchdown, isTackled } = this.state;

    const countryName = this.getCountryName();
    const lastRoundResult = this.getLastRoundResult();
    const mappedPlayers = this.getMappedPlayers(ballHandlerTeam);

    return (
      <div className="gamedetails-view">
        {
          winningTeam && <SplashScreen teams={this.getMappedTeamCountries()} winningTeam={winningTeam} currentTeam={currentTeam} gameScore={currentScores} />
        }
        {
          this.checkShouldDisplayRoundResult() && lastRoundResult && (
            <RoundResult
              teams={this.getMappedTeamCountries()}
              isRoundWinner={lastRoundResult.isRoundWinner}
              isTackled={lastRoundResult.isTackled}
              isTouchdown={lastRoundResult.isTouchdown}
              gameScore={currentScores}
              onButtonClick={this.closeRoundResult}
            />
          )
        }
        <Spinner isLoading={isGetGameStateBusy}>
          {
            currentGame && (
              <div>
                <div className="gamedetails-view__header">
                  <h2>{currentGame.name}</h2>
                  <p>{`${this.getCountryByTeam(currentGame.teams[0]).name} vs ${this.getCountryByTeam(currentGame.teams[1]).name}`}</p>
                </div>
                <Scoreboard
                  roundNumber={currentRoundNumber || 1}
                  turnNumber={currentTurnNumber || 1}
                  isTouchdown={isTouchdown}
                  isTackled={isTackled}
                  teams={currentGame.teams}
                  gameScore={currentScores}
                />
                {
                  isPlayerOnAttack ?
                    <AttackingTeam
                      getRoundResultDisplay={this.getRoundResultDisplay}
                      country={countryName}
                      players={mappedPlayers}
                      currentUser={user}
                      onPlayerSelected={this.onPlayerSelected}
                      ballHolder={ballHandler}
                      ballReceiver={playerToReceiveBall}
                      turnLocked={turnLocked} /> :
                    <DefendingTeam
                      getRoundResultDisplay={this.getRoundResultDisplay}
                      playerVotedFor={this.getCurrentPlayerVote()}
                      country={countryName}
                      players={mappedPlayers}
                      currentUser={user}
                      onPlayerSelected={this.onPlayerSelected}
                      turnLocked={turnLocked}
                      votes={currentVotes} />
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
