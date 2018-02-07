import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import pageNames from 'lib/pageNames';
import './Navigator.scss';

const mapStateToProps = (state) => ({
  isCreatingGame: state.navigation.isCreatingGame,
  isTeamsSelectedOnCreateGame: state.navigation.isTeamsSelectedOnCreateGame,
  isGameSelectedOnLobby: state.navigation.isGameSelectedOnLobby,
  isDeleteEnabledOnLobby: state.navigation.isDeleteEnabledOnLobby,
  isGameWaitingForPlayers: state.navigation.isGameWaitingForPlayers,
  isGameReadyToStart: state.navigation.isGameReadyToStart,
  currentPage: state.navigation.currentPage,
});

class Navigator extends Component {
  render() {
    const {
      isCreatingGame,
      isTeamsSelectedOnCreateGame,
      isGameSelectedOnLobby,
      isDeleteEnabledOnLobby,
      isGameWaitingForPlayers,
      isGameReadyToStart,
      currentPage,
    } = this.props;

    console.log(this.props);

    return (
      <div id='rugby-navigator'>
        <div className='rugby-navigator__top'>
          {
            currentPage !== pageNames.join &&
            <Button
              color="info"
            >
              <span className="back" />
              <span className="btn-text-content">Back</span>
            </Button>
          }
        </div>
        <div className='rugby-navigator__bottom'>
          {
            currentPage === pageNames.gameCreate &&
            <Button
              color="success"
            >
              <span className="create" />
              <span className="btn-text-content">Create</span>
            </Button>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Navigator));
export { Navigator as PlainNavigator };
