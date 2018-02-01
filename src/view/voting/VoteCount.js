import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class VoteCount extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['total', 'user']).isRequired,
  };

  getVoteCountClass = () => this.props.type === 'total' ? "voteNumber totalVotes" : "voteNumber userVote";

  render() {
    return (
      <div className="vote">
        <span className={this.getVoteCountClass()}>{this.props.count}</span>
        <span className="votedText">Voted</span>
      </div>
    );
  }
}
