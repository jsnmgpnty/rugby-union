import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import Sound from 'react-sound';

import clickSound from '../../assets/snd-button-click.mp3';

class ButtonSound extends PureComponent {
  button = null;

  state = {
    soundPlaying: Sound.status.STOPPED,
  };

  playSound = () => {
    this.setState({ soundPlaying: Sound.status.PLAYING }, this.props.onClick);
  }

  onSoundEnd = () => {
    this.setState({ soundPlaying: Sound.status.STOPPED })
  }

  render() {
    return (
      <Fragment>
        <Button {...this.props} onClick={this.playSound}>
          {this.props.children}
        </Button>
        {
          this.state.soundPlaying === Sound.status.PLAYING && <Sound
            url={clickSound}
            playStatus={Sound.status.PLAYING}
            onFinishedPlaying={this.onSoundEnd}
          />
        }

      </Fragment>
    )
  }
}

export default ButtonSound;
