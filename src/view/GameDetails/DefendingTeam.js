import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { TeamPlayer } from 'components';

class DefendingTeam extends PureComponent {
  static propTypes = {
    getRoundResultDisplay: PropTypes.func, // TODO: Refactor
    country: PropTypes.string,
    players: PropTypes.array,
    currentUser: PropTypes.object,
    onPlayerSelected: PropTypes.func,
    turnLocked: PropTypes.bool,
    votes: PropTypes.array,
  };

  getVotePerPlayerBadge = (userId) => {
    if (!userId) {
      return null;
    }

    const voters = this.props.votes.filter(a => a.toTackle === userId).length;

    if (voters === 0) {
      return null;
    }

    return <div className="player-badge vote"><span>{voters}</span></div>;
  };

  getDescription = () => {
    const roundResultClass = this.props.getRoundResultDisplay();
    if (roundResultClass !== 'default') {
      return <div className={`turnResultDisplay ${roundResultClass}`}></div>;
    }

    return (
      <Fragment>
        <p className="team-description defense">Defending Team <span className="country-name">{`(${this.props.country})`}</span></p>
        <p className="teamMissionDescription">Guess 1 player you think is the ball bearer. If majority of the team guesses the right person your team wins the round.</p>
      </Fragment>
    );
  }

  render() {
    const { players, currentUser, onPlayerSelected, turnLocked } = this.props;
    return (
      <Fragment>
        {this.getDescription()}
        {
          players.map(a => {
            return (
              <TeamPlayer key={uuid()} isClickable={!turnLocked} currentUser={currentUser.username} user={a.user} avatar={a.player} onClick={onPlayerSelected}>
                {this.getVotePerPlayerBadge(a.user.userId)}
              </TeamPlayer>
            )
          })
        }
      </Fragment>
    );
  }
}

export default DefendingTeam;
