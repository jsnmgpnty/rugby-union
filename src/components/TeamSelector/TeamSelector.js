import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import TeamPlayer from './TeamPlayer';
import './TeamSelector.scss';

const propTypes = {
  currentUser: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  country: PropTypes.shape({
    countryId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  players: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    playerId: PropTypes.string.isRequired,
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
  return country.name.toLowerCase();
};

const mapPlayersToAvatar = (players, avatars) => {
  const mappedPlayers = avatars.map((avatar) => {
    const player = players.find((p) => p.playerId === avatar.playerId);
    return {
      user: player ? { userId: player.userId, username: player.username } : null,
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
            players.map((player) =>
              <TeamPlayer
                key={uuid()}
                currentUser={props.currentUser}
                user={player.user}
                avatar={player.avatar}
                teamId={props.teamId} onSelect={props.onJoin}
              />)
            : <p>No players yet</p>
        }
      </div>
    </div>
  );
}

TeamSelector.propTypes = propTypes;
TeamSelector.defaultProps = defaultProps;

export default TeamSelector;
