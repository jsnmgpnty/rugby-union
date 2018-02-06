import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Country from './Country';
import './BoundedCountry.scss';

export default class BoundedCountry extends PureComponent {
  render() {
    return (
      <div className="country-bounds">
        <Country />
      </div>
    );
  }
}
