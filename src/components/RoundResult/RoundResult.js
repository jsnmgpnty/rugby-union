import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import { Country } from 'components';
import './RoundResult.scss';

const propTypes = {
    isAttackingTeam: PropTypes.bool.isRequired,
    isTackled: PropTypes.bool.isRequired,
    teams: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    gameScore: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
}

const getRoundResult = (isAttackingTeam, isTackled) => {
    let result = "You lost this round!";
    let message = "Your team was tackled!";
    if (!isAttackingTeam && !isTackled) {
        message = "You were not able to tackle the attacking team!";
    } else if (isAttackingTeam && !isTackled) {
        result = "You won this round!";
        message = "You were not tackled";
    } else if (!isAttackingTeam && isTackled) {
        result = "You won this round!";
        message = "You successfully tackled the attacking team";
    }
    return { result, message }
}

const getTeamScore = (team, gameScore) => {
    const displayGameScore = gameScore.find(a => a.teamId === team.teamId);
    return displayGameScore ? gameScore.score : 0;
};

function RoundResult(props) {
    const isAttackingTeam = props.winningTeam;
    const isTackled = props
    const teams = props.teams;
    const gameScore = props.gameScore;

    return (<div className="splash-screen">
        <div className="splash-screen__overlay"></div>
        <div className="splash-screen__contents">
            <h2>{ getRoundResult(isAttackingTeam, isTackled).result } </h2>
            <h3> { getRoundResult(isAttackingTeam, isTackled).message } </h3>
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
        </div>
    </div>)
}

RoundResult.propTypes = propTypes;

export default RoundResult;
