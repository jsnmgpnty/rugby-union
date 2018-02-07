import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import './TeamPlayer.scss';

const propTypes = {
  username: PropTypes.string,
  teamId: PropTypes.string.isRequired,
  avatar: PropTypes.shape({
    playerId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }),
  onJoin: PropTypes.func,
};

const defaultProps = {
  avatar: null,
  onJoin: () => { },
};

const getTeamPlayerId = (avatar) => {
  return !avatar ? uuid() : avatar.playerId;
};

const getAvatar = (avatar) => {
  return !avatar ? { playerId: 99, name: 'N/A', profilePicture: null } : avatar;
};

const getProfilePic = (avatar) => {
  const style = {
    backgroundImage: 'url(' + avatar.profilePicture + ')',
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  return style;
}

function TeamPlayer(props) {
  return (
    <div id={`team-player_${getTeamPlayerId(props.avatar)}`} className="team-player">
      <a onClick={() => props.onJoin(props.username, props.teamId, props.avatar.playerId)}>
        <div className="team-player__avatar">
          <span className="team-player__avatar-pic" style={getProfilePic(props.avatar)} />
        </div>
        <div className="team-player__user">
          <p className="team-player__user-avatar">{getAvatar(props.avatar).name}</p>
          <p className={`team-player__user-name ${props.username ? 'player-taken' : ''}`}>
            {
              props.username ? <span>{props.username}</span> : <span>Available</span>
            }
          </p>
        </div>
      </a>
    </div>
  )
}

TeamPlayer.propTypes = propTypes;
TeamPlayer.defaultProps = defaultProps;

export default TeamPlayer;
