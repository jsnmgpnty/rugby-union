import React from 'react';
import PropTypes from 'prop-types';
import './Country.scss';

const propTypes = {
  country: PropTypes.object,
};

function Country(props) {
  return <div className={`country team-attack ${props.country.name.toLowerCase()}`}></div>;
}

Country.propTypes = propTypes;

export default Country;
