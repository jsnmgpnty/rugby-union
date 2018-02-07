import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { remove } from 'lodash';
import uuid from 'uuid';

import gameApi from 'services/GameApi';
import { onGameJoin, onGameJoined } from 'services/SocketClient';
import { TeamSelector, Spinner } from 'components';
import './GamePrepare.scss';

const mapStateToProps = state => ({
  countries: state.countries,
  user: state.user,
});

class GameLobby extends PureComponent {
  constructor(props) {
    super(props);

    onGameJoined((data) => {
      const { game } = this.state;

      if (data.teamId) {
        game.teams.forEach(team => {
          if (team.teamId === data.teamId) {
            if (!team.players) {
              team.players = [];
            }

            const existingPlayer = team.players.find((t) => { return t.username === data.username });
            if (!existingPlayer) {
              team.players.push({ username: data.username });
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

        this.setState({ game: { ...game } });
      }
    });
  }

  state = {
    gameId: null,
    game: null,
    isBusy: false,
  };

  async componentDidMount() {
    const { user } = this.props;
    const { params } = this.props.match;
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
        this.setState({ game, isBusy: false });
      }
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  };

  joinGame = (username, teamId, avatarId) => {
    const { game } = this.state;
    const { user } = this.props;

    onGameJoin({ teamId, gameId: game.gameId, username: user.username, avatarId });
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
    } = this.state;

    const { countries } = this.props;

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
                          teamId={team.teamId}
                          players={team.players}
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
        </Spinner>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, null)(GameLobby));
export { GameLobby as PlainGameLobby };
