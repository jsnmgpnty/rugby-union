import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import AppRoutes from './routes';
import { setCountries } from 'actions/countries';
import { setUser } from 'actions/user';
import gameApi from 'services/GameApi';
import { initializeSession } from 'services/SocketClient';
import { Navigator, Spinner } from 'components';

import './App.scss';

const mapDispatchToProps = dispatch => ({
  setCountries: countries => dispatch(setCountries(countries)),
  setUser: user => dispatch(setUser(user)),
});

const mapStateToProps = state => ({
  isPageLoading: state.navigation.isPageLoading,
  currentPage: state.navigation.currentPage,
});

class App extends Component {
  static propTypes = {
    setCountries: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
  };

  state = {
    user: null,
    activeGame: null,
    hasInitialized: false,
  };

  async componentDidMount() {
    await this.getCountries();

    const user = reactLocalStorage.getObject('user');
    if (user && user.userId && user.username) {
      initializeSession(user);
      this.props.setUser(user);
    }

    this.setState({ hasInitialized: true });
  }

  async getCountries() {
    try {
      const countries = await gameApi.getCountries();
      this.props.setCountries(countries);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      isPageLoading,
    } = this.props;

    return (
      <div className="App">
        <div className="rugby-main">
          <div className="rugby-content">
            <Spinner isLoading={isPageLoading}>
              {
                this.state.hasInitialized && <AppRoutes />
              }
            </Spinner>
          </div>
          <div className="rugby-nav">
            <Navigator />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
export { App as PlainApp };
