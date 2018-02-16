import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import './TeamPlayer.scss';

const propTypes = {
  currentUser: PropTypes.string.isRequired,
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  avatar: PropTypes.shape({
    playerId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func,
  isClickable: PropTypes.bool,
};

const defaultProps = {
  avatar: null,
  onClick: () => { },
  isClickable: true,
};

const getTeamPlayerId = (avatar) => {
  return !avatar ? uuid() : avatar.playerId;
};

const getAvatar = (avatar) => {
  return !avatar ? { playerId: 99, name: 'N/A', profilePicture: null } : avatar;
};

const getProfilePic = (avatar) => {
  const style = {
    background: `url(${avatar.profilePicture})`,
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  return style;
};

const isCurrentUser = (user, currentUser) => {
  if (!currentUser || !user) {
    return false;
  }

  return user === currentUser;
};

function TeamPlayer(props) {
  const username = props.user ? props.user.username : null;
  const userId = props.user ? props.user.userId : null;

  return (
    <div
      id={`team-player_${getTeamPlayerId(props.avatar)}`}
      className={`team-player ${isCurrentUser(userId, props.currentUser) ? 'is-active' : null} ${!props.isClickable ? 'disabled' : null}`}
    >
      <a onClick={() => props.onClick(props.teamId, props.avatar.playerId, userId)}>
        <div className="team-player__avatar">
          <span className="team-player__avatar-pic" style={getProfilePic(props.avatar)} />
        </div>
        <div className="team-player__user">
          <p className="team-player__user-avatar">{getAvatar(props.avatar).name}</p>
          <p className={`team-player__user-name ${username ? 'player-taken' : ''}`}>
            {
              username ? <span>{username}</span> : <span>Available</span>
            }
          </p>
        </div>
        {
          props.children
        }
      </a>
    </div>
  )
}

TeamPlayer.propTypes = propTypes;
TeamPlayer.defaultProps = defaultProps;

export default TeamPlayer;
