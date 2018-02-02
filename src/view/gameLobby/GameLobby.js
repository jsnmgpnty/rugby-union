import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { remove } from 'lodash';
import uuid from 'uuid';

import gameApi from 'services/GameApi';
import { onGameJoin, onGameJoined } from 'services/SocketClient';
import TeamSelector from 'components/TeamSelector/TeamSelector';
import './GameLobby.css';

const username = uuid();

const mapStateToProps = state => ({
  countries: state.countries,
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

            const existingPlayer = team.players.find((t) => { t.username === data.username });
            if (!existingPlayer) {
              team.players.push({ username: data.username });
            }
          } else {
            remove(team.players, (player) => {
              return player.username === data.username;
            });
          }
        });

        this.setState({ game: {...game }});
      }
		});
  }

  state = {
    gameId: null,
    game: null,
  };

  async componentDidMount() {
    const { params } = this.props.match;
    this.setState({ gameId: params.gameId });
    await this.getGame(params.gameId);
    onGameJoin({ gameId: params.gameId, username: username });
  }

  getGame = async (gameId) => {
    try {
      const game = await gameApi.getGame(gameId);
      if (game) {
        this.setState({ game });
      }
    } catch (error) {
      console.log(error);
    }
  }

  joinGame = (teamId) => {
    const { game } = this.state;
    onGameJoin({ teamId, gameId: game.gameId, username: username });
  }

  render() {
    const { gameId, game } = this.state;
    const { countries } = this.props;

    return (
      <div id={`game-lobby__${gameId}`}>
        <div className="game-lobby__teams">
          <Row>
            {
              game ?
                game.teams.map((team) => (
                  <Col xs="6" key={team.teamId}>
                    <TeamSelector
                      teamId={team.teamId}
                      players={team.players}
                      country={countries[0]}
                      onJoin={this.joinGame}
                    />
                  </Col>
                ))
                : <p>No game found</p>
            }
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(GameLobby);
export { GameLobby as PlainGameLobby };
