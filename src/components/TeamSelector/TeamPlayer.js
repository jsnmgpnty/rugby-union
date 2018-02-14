import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import './TeamPlayer.scss';

const propTypes = {
  currentUser: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  avatar: PropTypes.shape({
    playerId: PropTypes.string.isRequired,
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
    background: 'url(' + require(`../../assets/${avatar.profilePicture}`) + ')',
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

  return user.userId === currentUser;
};

function TeamPlayer(props) {
  const username = props.user ? props.user.username : null;

  return (
	props.avatar.players && props.avatar.players.length > 0 && props.avatar.players.map((players) =>
    <div id={`team-player_${getTeamPlayerId(players)}`} className={`team-player ${isCurrentUser(username, props.currentUser) ? 'is-active' : null}`}>
      <a onClick={() => props.onJoin(props.teamId, players.playerId)}>
        <div className="team-player__avatar">
          <span className="team-player__avatar-pic" style={getProfilePic(players)} />
        </div>
        <div className="team-player__user">
          <p className="team-player__user-avatar">{getAvatar(players).name}</p>
          <p className={`team-player__user-name ${username ? 'player-taken' : ''}`}>
            {
              username ? <span>{username}</span> : <span>{getAvatar(players).username}</span>
            }
          </p>
        </div>
      </a>
    </div>
	)
  )
}

TeamPlayer.propTypes = propTypes;
TeamPlayer.defaultProps = defaultProps;

export default TeamPlayer;
