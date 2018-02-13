import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({
    user: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
  })).isRequired,
  passBallTo: PropTypes.object.isRequired,
  onPassBall: PropTypes.string.isRequired,
};

function BallHandlerVote(props) {
  return (
    <div id="ball-handler-vote">
      
    </div>
  )
}

BallHandlerVote.propTypes = propTypes;

export default BallHandlerVote;
