import React from 'react';
import PropTypes from 'prop-types';

import { Country } from 'components';
import './RoundResult.scss';

const propTypes = {
  isRoundWinner: PropTypes.bool.isRequired,
  isTackled: PropTypes.bool.isRequired,
  isTouchdown: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  gameScore: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

const getRoundResult = (isRoundWinner, isTackled, isTouchdown) => {
  let result = "You lost this round!";
  let message = "Your team was tackled!";

  if (isRoundWinner && isTouchdown) {
    result = "You won this round!";
    message = "You were not tackled";
  }

  if (isRoundWinner && isTackled) {
    result = "You won this round!";
    message = "You successfully tackled the attacking team";
  }

  if (!isRoundWinner && isTouchdown) {
    message = "You were not able to tackle the attacking team!";
  }

  if (!isRoundWinner && isTackled) {
    message = "You were not able to try!";
  }

  return { result, message }
};

const getTeamScore = (team, gameScore) => {
  const displayGameScore = gameScore.find(a => a.teamId === team.teamId);
  return displayGameScore ? gameScore.score : 0;
};

function RoundResult(props) {
  const isRoundWinner = props.isRoundWinner;
  const isTackled = props.isTackled;
  const isTouchdown = props.isTouchdown;
  const teams = props.teams;
  const gameScore = props.gameScore;

  return (<div className="splash-screen">
    <div className="splash-screen__overlay"></div>
    <div className="splash-screen__contents">
      <h2>{getRoundResult(isRoundWinner, isTackled, isTouchdown).result}</h2>
      <h3>{getRoundResult(isRoundWinner, isTackled, isTouchdown).message}</h3>
      <div className="score-view__header">
        {
          teams.map(team => (
            <div className="per-team" key={team.teamId}>
              <Country country={team.country} />
              <div className="team-score">
                Score
                <p>{getTeamScore(team, gameScore)}</p>
              </div>
            </div>
          ))
        }
      </div>
      <a className="footer-block" onClick={props.onButtonClick}>
        Ready for next round
      </a>
    </div>
  </div>)
};

RoundResult.propTypes = propTypes;

export default RoundResult;
