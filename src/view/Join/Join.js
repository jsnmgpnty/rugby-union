import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import './Join.scss';
import { setUser } from 'actions/user';
import { onUserCreate, onUserCreated } from 'services/SocketClient.js'
import { Spinner } from 'components';

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
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
		};
	}

	componentDidMount() {
		onUserCreated(this.handleUserCreated);
	}

	handleUserCreated = (data) => {
		if (data.error) {
			this.setState({
				errorMessage: data.error,
				isLoading: false,
				isSuccessSignIn: false,
			});
		} else {
			this.props.setUser(data);
			reactLocalStorage.setObject('user', data);
			this.setState({
				errorMessage: null,
				isLoading: false,
				isSuccessSignIn: true,
			});
		}
	};

	handleNameChange = (event) => {
		if (!this.state.isUsernamePristine) {
			this.validateUsername(event);
		}
		this.setState({ username: event.target.value });
	}

	validateUsername = (event) => {
		if (event.target.value.length < 6) {
			this.setState({ isUsernameValid: false, errorMessage: 'Invalid username length', isUsernamePristine: false });
		} else {
			this.setState({ isUsernameValid: true, errorMessage: null, isUsernamePristine: false });
		}
	}

	signInUser = (isCreatingGame) => {
		const { username } = this.state;
		this.setState({ isLoading: true, username, isCreatingGame }, onUserCreate(username));
	}

	render() {
		const {
			isLoading,
			isSuccessSignIn,
			errorMessage,
			isCreatingGame,
			isUsernameValid,
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
						<Button
							color="success"
							disabled={!isUsernameValid}
							onClick={(e) => this.signInUser(true)}>
							<span className="create" />
							<span className="btn-text-content">Create Game</span>
						</Button>
						<Button
							color="primary"
							disabled={!isUsernameValid}
							onClick={(e) => this.signInUser(false)}>
							<span className="join" />
							<span className="btn-text-content">Join Game</span>
						</Button>
						{
							isSuccessSignIn && isCreatingGame && <Redirect to="/create" />
						}
						{
							isSuccessSignIn && !isCreatingGame && <Redirect to="/" />
						}
					</Form>
				</Spinner>
			</div>
		);
	}
}

export default withRouter(connect(null, mapDispatchToProps)(Join));
export { Join as PlainJoin };