import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import TeamPlayer from './TeamPlayer';
import './TeamSelector.scss';

const propTypes = {
  teamId: PropTypes.string.isRequired,
  country: PropTypes.shape({
    countryId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  players: PropTypes.arrayOf(PropTypes.shape({  
    username: PropTypes.string.isRequired,
    avatar: PropTypes.shape({
      playerId: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    }).isRequired,
  })),
  onJoin: PropTypes.func,
};

const defaultProps = {
  players: [],
  onJoin: () => {},
};

function TeamSelector(props) {
  return (
    <div id={'team-selector_' + props.teamId}> 
      <Button color="primary" block onClick={() => props.onJoin(props.teamId)}>Join</Button>
      <div className="team-selector__players">
        {
          props.players && props.players.length > 0 ?
            props.players.map((player) => <TeamPlayer key={player.username} username={player.username} />)
            : <p>No players yet</p>
        }
      </div>
    </div>
  );
}

TeamSelector.propTypes = propTypes;
TeamSelector.defaultProps = defaultProps;

export default TeamSelector;
