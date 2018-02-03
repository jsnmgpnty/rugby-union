import React from 'react';
import PropTypes from 'prop-types';
import { BarLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';

import './Spinner.css';

const propTypes = {
  isLoading: PropTypes.bool,
  hideContent: PropTypes.bool,
  children: PropTypes.any,
  blur: PropTypes.number,
};

const defaultProps = {
  isLoading: false,
  hideContent: true,
  children: null,
  blur: 2,
};

function Spinner(props) {
  const message = (
    <BarLoader loading={props.isLoading} />
  );

  return (
    <div className="spinner-block">
      <Loader
        show={props.isLoading}
        message={message}
        disableDefaultStyles
        hideContentOnLoad={props.hideContent}
        contentBlur={props.contentBlur}
      >
        {
          !props.isLoading && props.children
        }
      </Loader>
    </div>
  );
}

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;

export default Spinner
