import React from 'react';
import PropTypes from 'prop-types';
import { BarLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';

import './Spinner.scss';

const propTypes = {
  isLoading: PropTypes.bool,
  hideContent: PropTypes.bool,
  children: PropTypes.any,
  blur: PropTypes.number,
};

const defaultProps = {
  isLoading: false,
  hideContent: false,
  children: null,
  blur: 2,
};

const showContent = (props) => {
  if (props.isLoading) {
    if (props.hideContent) {
      return null;
    }

    return props.children;
  }

  return props.children;
}

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
          showContent(props)
        }
      </Loader>
    </div>
  );
}

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;

export default Spinner
