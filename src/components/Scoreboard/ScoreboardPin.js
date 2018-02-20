import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

import './ScoreboardPin.scss';

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isTouchdown: PropTypes.bool.isRequired,
  isTackled: PropTypes.bool.isRequired,
  turnNumber: PropTypes.number.isRequired,
  roundNumber: PropTypes.number.isRequired,
};

const getPosition = (isTouchdown, turnNumber, width, height) => {
  if (isTouchdown) {
    return { x: spring((width / 2) - 20), y: spring(height / 6.5) };
  }

  switch (turnNumber) {
    case 2:
      return { x: spring(width / 5), y: spring(height / 1.6) };
    case 3:
      return { x: spring(width / 1.55), y: spring(height / 1.88) };
    case 4:
      return { x: spring(width / 3.5), y: spring(height / 2.4) };
    case 5:
      return { x: spring(width / 1.84), y: spring(height / 3.35) };
    case 6:
      return { x: spring(width / 3), y: spring(height / 3.8) };
    default:
      return { x: spring((width / 2) - 20), y: spring(height - 40) };
  }
}

const isTry = (isTouchdown) => {
  return isTouchdown ? 'is-active' : null;
}

const isTackled = (isTackled) => {
  return isTackled ? 'is-tackled' : null;
}

function ScoreboardPin(props) {
  const defaultPosition = getPosition(props.isTouchdown, 1, props.width, props.height);
  const defaultStyle = { x: defaultPosition.x.val, y: defaultPosition.y.val };

  return (
    <div className="scoreboard-pin-canvas">
      <Motion defaultStyle={defaultStyle} style={getPosition(props.isTouchdown, props.turnNumber, props.width, props.height)}>
        {
          style => (
            <div className={`scoreboard-pin ${isTackled(props.isTackled)}`} style={{
              WebkitTransform: `translate3d(${style.x}px, ${style.y}px, 0)`,
              transform: `translate3d(${style.x}px, ${style.y}px, 0)`,
            }}>
              <div className={`try ${isTry(props.isTouchdown)}`} />
            </div>
          )
        }
      </Motion>
    </div>
  );
};

ScoreboardPin.propTypes = propTypes;

export default ScoreboardPin;
