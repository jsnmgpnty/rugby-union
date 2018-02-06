import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './Navigator.css';

const mapStateToProps = (state) => ({
  isGameCreated: state.isGameCreated,
  isCreatingGame: state.isCreatingGame,
  
});

class Navigator extends Component {
  render() {
    return (
      <div id='rugby-navigator'>
        
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Navigator));
export { Navigator as PlainNavigator };
