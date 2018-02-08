import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Form, Col, Row, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './GameCreate.scss';
import pageNames from 'lib/pageNames';
import { setCurrentPage } from 'actions/navigation';

const mapStateToProps = state => ({
	countries: state.countries,
	user: state.user,
});

const mapDispatchToProps = dispatch => ({
	setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameCreate)),
});

class GameCreate extends Component {
	static propTypes = {
		setCurrentPage: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		
		this.addNewRow = this.addNewRow.bind(this);
		this.state = {
		  rules:[]
		}
    }
	
	addNewRow(e){
		if(this.state.rules.length > 1){
			this.state.rules.shift();
		}
		
		const updated = this.state.rules.slice(0,2);
		updated.push(e);
		this.setState({rules:updated});
		};
	}

	componentDidMount () {
		const {
			setCurrentPage,
		} = this.props;

		setCurrentPage();
	}

	render() {
		const { countries, user } = this.props;
		
		const divStyle = (country) => {
			const imageBG = {
				// backgroundColor: '#00AEEF',
				backgroundImage: 'url('+require('../../assets/teams/' + country + '_off.png')+')',
				backgroundSize: 'contain',
				backgroundRepeat: 'no-repeat',
				position: 'relative'
			}
			
			return imageBG;
		}
		
		
		console.log(this.state.rules);
		
		return (
				<div>
					<div className="gamecreate-header">
						<h2>Create Game</h2>
						<p>Select 2 teams</p>
					</div>
					<div className="teamlist-div">
						{
						countries && countries.length > 0 && countries.map((country) => 
							<div className="team-div" style={divStyle(country.name)} onClick={() => this.addNewRow(country.countryId)}>
								<label className="team-name">{country.name}</label>
								<img src={require('../../assets/teams/'+ country.name +'_icon.png')} />
							</div>
							)
						}
					</div>
				</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameCreate));
