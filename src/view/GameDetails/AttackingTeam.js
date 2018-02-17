import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { TeamPlayer } from 'components';

class AttackingTeam extends PureComponent {
  static propTypes = {
    getGameResultDisplay: PropTypes.func, // TODO: Refactor
    country: PropTypes.string,
    players: PropTypes.array,
    currentUser: PropTypes.object,
    onPlayerSelected: PropTypes.func,
    ballHolder: PropTypes.string,
    ballReceiver: PropTypes.string,
    turnLocked: PropTypes.bool,
  };

  isPlayerClickable = () => {
    const { ballHolder, currentUser, turnLocked } = this.props;
    return !turnLocked && ballHolder === currentUser.userId;
  };

  renderBallIcon = (userId) => {
    let { ballReceiver, ballHolder } = this.props;
    const { turnLocked } = this.props;

    if (turnLocked) {
      ballHolder = ballReceiver;
      ballReceiver = null;
    }

    if (ballHolder === userId) {
      return <div className="player-badge ball"></div>;
    } else if (ballReceiver === userId) {
      return <div className="player-badge ball receive"></div>;
    }

    return null;
  }

  getTurnDescription = () => {
    const { ballHolder, ballReceiver, currentUser } = this.props;
    let objective = "The objective of your team is to successfully evade 6 waves without being tackled.";

    if (ballReceiver) {
      return "Waiting for the other team to tackle";
    }

    if (ballHolder === currentUser.userId) {
      return objective = `${objective} Select a player & hit pass or keep the ball`;
    }
    return objective;
  }

  render() {
    const { country, players, currentUser, onPlayerSelected } = this.props;
    return (
      <Fragment>
        <p className="team-description offense">Attacking Team <span className="country-name">{`(${country})`}</span></p>
        <p className="teamMissionDescription">{this.getTurnDescription()}</p>
        <div className={`turnResultDisplay ${this.props.getGameResultDisplay()}`}></div>
        {
          players.map(a => {
            return (
              <TeamPlayer key={uuid()} isClickable={this.isPlayerClickable()} currentUser={currentUser.username} user={a.user} avatar={a.player} onClick={onPlayerSelected}>
                {this.renderBallIcon(a.user.userId)}
              </TeamPlayer>
            )
          })
        }
      </Fragment>
    );
  }
}

export default AttackingTeam;
