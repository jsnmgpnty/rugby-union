import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge, Form, FormGroup, Input } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import './Join.scss';
import { setUser, login } from 'actions/user';
import { setCurrentPage, resetNavRedirects } from 'actions/navigation';
import { getActiveGames } from 'actions/game';
import pageNames from 'lib/pageNames';
import { Spinner, ButtonSound } from 'components';

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.join)),
  resetNavRedirects: () => dispatch(resetNavRedirects()),
  login: (username) => dispatch(login(username)),
  getActiveGames: () => dispatch(getActiveGames()),
});

const mapStateToProps = state => ({
  activeGames: state.game.activeGames,
  isGetActiveGamesBusy: state.game.isGetActiveGamesBusy,
  getActiveGamesError: state.game.getActiveGamesError,
  ...state.user,
});

class Join extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      isUsernameValid: false,
      isUsernamePristine: true,
      isCreatingGame: false,
    };
  }

  async componentDidMount() {
    reactLocalStorage.setObject('user', null);
    this.props.setCurrentPage(pageNames.join);
    this.props.resetNavRedirects();
    this.getActiveGames();
  }

  getActiveGames() {
    const { isGetActiveGamesBusy, getActiveGames } = this.props;
    if (isGetActiveGamesBusy) {
      return;
    }

    getActiveGames();
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
    const { login } = this.props;

    this.setState({ isCreatingGame });
    login(username);
  }

  render() {
    const {
      user,
      activeGames,
      getActiveGamesError,
      isGetActiveGamesBusy,
    } = this.props;

    const { isUsernameValid, isCreatingGame } = this.state;

    return (
      <div className="join-view">
        <Spinner isLoading={isGetActiveGamesBusy}>
          <div className="join-view__hero" />
          <div className="join-view__title">
            <h2>Six Nations</h2>
            <h4>Touchdown</h4>
          </div>
          <Form>
            <FormGroup>
              <Input
                className={getActiveGamesError && 'has-error'}
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
                  activeGames && activeGames.length > 0 && <Badge color="danger" pill>{activeGames.length}</Badge>
                }
              </span>
            </ButtonSound>
            {
              user && !isCreatingGame && <Redirect to="/" key="join-lobby" />
            }
            {
              user && isCreatingGame && <Redirect to="/create" key="join-create-game" />
            }
          </Form>
        </Spinner>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Join));
export { Join as PlainJoin };
