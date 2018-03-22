import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge, Button, Form, FormGroup, Input } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import './Join.scss';
import { setUser } from 'actions/user';
import { setCurrentPage } from 'actions/navigation';
import pageNames from 'lib/pageNames';
import gameApi from 'services/GameApi';
import { initializeSession } from 'services/SocketClient';
import { Spinner, ButtonSound } from 'components';

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.join)),
});

class Join extends Component {
  static propTypes = {
    setUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      isLoading: false,
      isSuccessSignIn: false,
      isCreatingGame: false,
      errorMessage: null,
      isUsernameValid: false,
      isUsernamePristine: true,
      games: [],
    };
  }

  async componentDidMount() {
    reactLocalStorage.setObject('user', null);
    this.props.setCurrentPage(pageNames.join);
    await this.getActiveGames();
  }

  async getActiveGames() {
    const { isBusy } = this.state;
    if (isBusy) {
      return;
    }

    this.setState({ isBusy: true });

    try {
      const games = await gameApi.getGames();
      this.setState({ games, isBusy: false });
    } catch (error) {
      this.setState({ isBusy: false });
      console.log(error);
    }
  }

  handleNameChange = (event) => {
    if (!this.state.isUsernamePristine) {
      this.validateUsername(event);
    }

    const username = event.target.value;
    if (username.length >= 2) {
      this.setState({ username, isUsernameValid: true });
    } else {
      this.setState({ username, isUsernameValid: false });
    }
  }

  validateUsername = (event) => {
    if (event.target.value.length < 2) {
      this.setState({ isUsernameValid: false, errorMessage: 'Invalid username length', isUsernamePristine: false });
    } else {
      this.setState({ isUsernameValid: true, errorMessage: null, isUsernamePristine: false });
    }
  }

  async signInUser(isCreatingGame) {
    const { username } = this.state;
    
    this.setState({ isLoading: true, username, isCreatingGame });

    try {
      const result = await gameApi.login(username);
      if (result) {
        if (!result.isSuccess) {
          this.setState({
            errorMessage: result.message,
            isSuccessSignIn: false,
            isLoading: false,
          });
          return;
        }

        if (result.data) {
          initializeSession(result.data);
          this.props.setUser(result.data);
          reactLocalStorage.setObject('user', result.data);
          this.setState({
            errorMessage: null,
            isSuccessSignIn: true,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      this.setState({
        errorMessage: error,
        isSuccessSignIn: false,
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      isSuccessSignIn,
      errorMessage,
      isCreatingGame,
      isUsernameValid,
      games,
    } = this.state;

    return (
      <div className="join-view">
        <Spinner isLoading={isLoading}>
          <div className="join-view__hero" />
          <div className="join-view__title">
            <h2>Six Nations</h2>
            <h4>Touchdown</h4>
          </div>
          <Form>
            <FormGroup>
              <Input
                className={errorMessage && 'has-error'}
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                onBlur={this.validateUsername}
                onChange={this.handleNameChange}
              />
            </FormGroup>
            <ButtonSound
              color="success"
              disabled={!isUsernameValid}
              onClick={(e) => this.signInUser(true)}>
              <span className="create" />
              <span className="btn-text-content">Create Game</span>
            </ButtonSound>
            <ButtonSound
              color="primary"
              disabled={!isUsernameValid}
              onClick={(e) => this.signInUser(false)}>
              <span className="join" />
              <span className="btn-text-content">
                Join Game
                {
                  games && games.length > 0 && <Badge color="danger" pill>{games.length}</Badge>
                }
              </span>
            </ButtonSound>
            {
              isSuccessSignIn && isCreatingGame && <Redirect to="/create" key="join-create" />
            }
            {
              isSuccessSignIn && !isCreatingGame && <Redirect to="/" key="join-lobby" />
            }
          </Form>
        </Spinner>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Join));
export { Join as PlainJoin };
