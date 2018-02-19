import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { TeamPlayer } from 'components';

class AttackingTeam extends PureComponent {
  static propTypes = {
    getRoundResultDisplay: PropTypes.func, // TODO: Refactor
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
    const { ballHolder, ballReceiver, currentUser, turnLocked } = this.props;
    let objective = "The objective of your team is to successfully evade 6 waves without being tackled.";

    if (turnLocked) {
      return "Waiting for the other team to tackle";
    }

    if (ballHolder === currentUser.userId) {
      return objective = `${objective} Select a player & hit pass or keep the ball`;
    }
    return objective;
  }

  getDescription = () => {
    const roundResultClass = this.props.getRoundResultDisplay();
    if (roundResultClass !== 'default') {
      return <div className={`turnResultDisplay ${roundResultClass}`}></div>;
    }

    return (
      <Fragment>
        <p className="team-description offense">Attacking Team <span className="country-name">{`(${this.props.country})`}</span></p>
        <p className="teamMissionDescription">{this.getTurnDescription()}</p>
      </Fragment>
    );
  }

  render() {
    const { players, currentUser, onPlayerSelected } = this.props;

    return (
      <Fragment>
        {this.getDescription()}
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
