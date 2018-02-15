import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import gameApi from 'services/GameApi';
import pageNames from 'lib/pageNames';
import { onGameLeft, onGameStart, onGameResult } from 'services/SocketClient';
import { TeamSelector, Spinner } from 'components';
import { setCurrentPage, setGame, isPageLoading } from 'actions/navigation';
import './GameDetails.scss';
import { Scoreboard } from 'components';
import TeamPlayer from '../../components/TeamSelector/TeamPlayer';
import uuid from 'uuid';

const mapDispatchToProps = dispatch => ({
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameDetails)),
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
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
    currentTurnNumber: 0,
    winningTeam: null,
    isTackled: false,
    isTouchdown: false,
  };

  async componentDidMount() {
    const { setCurrentPage } = this.props;
    const { params } = this.props.match;

    setCurrentPage();
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
        this.setState({ game, isBusy: false }, () => this.getGameState(gameId));
      }
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  };

  getGameState = async (gameId) => {
    const { user } = this.props;
    const { game } = this.state;

    try {
      const gameStateResult = await gameApi.getGameState(gameId, user.userId);
      const isGood = game && gameStateResult;

      if (game && gameStateResult) {
        const gameState = gameStateResult.data;
        if (gameState.teamId) {
          const currentTeam = game.teams.find(a => a.teamId === gameState.teamId);
          this.setState({ currentTeam, currentTurnNumber: gameState.turnNumber });
          onGameStart({ userId: user.userId, teamId: currentTeam.teamId });
        }

        if (gameState.winningTeam) {
          this.setState({ winningTeam: gameState.winningTeam, isTackled: gameState.isTackled, isTouchdown: gameState.isTouchdown });
        }
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

  getGameResultDisplay(){
    const { isTackled, isTouchdown, isSaved, currentTurnNumber } = this.state;
    if(isTackled){
      return "tackled";
    } else if(isTouchdown){
      return "try";
    } else if(isSaved){
      return "missed";
    }
    return "default";
  }

  onGameResult(game){
    const turnNumber = game.turnNumber;
    if(game.winningTeam){
      this.setState({ isTackled: true, isSaved: false, currentTurnNumber: turnNumber });
    }else{
      this.setState({ isSaved: true, isTackled: true, currentTurnNumber: turnNumber })
    }
  }

  render() {
    const { isBusy, game, currentTeam } = this.state;
    const { user } = this.props;
    const mappedPlayers = this.getMappedPlayers(currentTeam);
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
                  <p>Round 1 of 5</p>
                </div>
                <Scoreboard game={this.getGameDetails()} />
                <p className="teamBallPosession">Defense Team (Scotland)</p>
                <p className="teamMissionDescription">Guess 1 player you think is the ball bearer if majority of the team guesses the right person your team wins the round.</p>
                <div className={`turnResultDisplay ${this.getGameResultDisplay()}`}></div>
                {
                  mappedPlayers.map(a => {
                    return (
                      <TeamPlayer key={uuid()} currentUser={user.username} user={a.user} avatar={a.player}>
                        <label>ball</label>
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
