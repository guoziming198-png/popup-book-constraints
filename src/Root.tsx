import React from 'react';
import {Composition} from 'remotion';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './theme';
import {PopupBookVideo} from './PopupBookVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PopupBookConstraints"
      component={PopupBookVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
