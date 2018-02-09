import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import TeamPlayer from './TeamPlayer';
import './TeamSelector.scss';

const propTypes = {
  currentUser: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  country: PropTypes.shape({
    countryId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  players: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatarId: PropTypes.number.isRequired,
  })),
  onJoin: PropTypes.func,
};

const defaultProps = {
  players: [],
  onJoin: () => { },
};

const getCountryLogo = (country) => {
  if (!country) {
    return null;
  }

  switch (country.countryId) {
    case 1:
      return 'england';
    case 2:
      return 'france';
    case 3:
      return 'ireland';
    case 4:
      return 'italy';
    case 5:
      return 'scotland';
    case 6:
      return 'wales';
    default:
      return null;
  }
};

const mapPlayersToAvatar = (players, avatars) => {
  const mappedPlayers = avatars.map((avatar) => {
    const player = players.find((p) => p.avatarId === avatar.playerId);
    return {
      username: player ? player.username : null,
      avatar: avatar,
    };
  });

  return mappedPlayers;
};

function TeamSelector(props) {
  const players = mapPlayersToAvatar(props.players, props.country.players);

  return (
    <div id={'team-selector_' + props.teamId} className="team-selector">
      <div className="team-selector__logo">
        <div className={`team-selector__logo-country ${getCountryLogo(props.country)}`} />
      </div>
      <div className="team-selector__players">
        {
          players && players.length > 0 ?
            players.map((player) => <TeamPlayer key={uuid()} currentUser={props.currentUser} username={player.username} avatar={player.avatar} teamId={props.teamId} onJoin={props.onJoin} />)
            : <p>No players yet</p>
        }
      </div>
    </div>
  );
}

TeamSelector.propTypes = propTypes;
TeamSelector.defaultProps = defaultProps;

export default TeamSelector;
