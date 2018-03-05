import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import './FullDialog.scss';

const propTypes = {
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func.isRequired,
};

const defaultProps = {
  buttonText: 'Close',
};

function FullDialog(props) {
  return (
    <div className="full-dialog">
      <div className="full-dialog__overlay"></div>
      <div className="full-dialog__contents">
        {
          props.children
        }
        <a className="full-dialog__contents-footer" onClick={props.onButtonClick}>
          {
            props.buttonText || 'Close'
          }
        </a>
      </div>
    </div>
  )
};

FullDialog.propTypes = propTypes;
FullDialog.defaultProps = defaultProps;

export default FullDialog;
