import React from 'react';
import PropTypes from 'prop-types';

import './TeamPlayer.css';

const propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.shape({
    playerId: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  avatar: null,
};

function TeamPlayer(props) {
  return (
    <div id={`team-player_${props.username}`} className="team-player">
      <p>{props.username}</p>
    </div>
  )
}

TeamPlayer.propTypes = propTypes;
TeamPlayer.defaultProps = defaultProps;

export default TeamPlayer;
