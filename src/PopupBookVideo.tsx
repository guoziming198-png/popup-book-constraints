import React from 'react';
import {Audio, staticFile, useCurrentFrame} from 'remotion';
import {getCameraState} from './camera';
import {HEIGHT, WIDTH} from './theme';
import {WoodenStage} from './components/WoodenStage';
import {OmniMachine} from './components/OmniMachine';
import {DialogueLayer} from './components/DialogueLayer';
import {PopupBook} from './components/PopupBook';
import {NotEqualBadge} from './components/PropsAndAudio';
import {PaperStorm} from './components/PaperStorm';
import {SubtitleRibbon} from './components/SubtitleRibbon';

export const PopupBookVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = getCameraState(frame);

  // 将导演焦点的世界坐标映射到画布中心，并施加平滑缩放、倾斜与冲击微震
  const tx = WIDTH / 2 - cam.focusX + cam.shakeX;
  const ty = HEIGHT / 2 - cam.focusY + cam.shakeY;

  return (
    <div
      style={{
        position: 'relative',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: '#130B05',
        overflow: 'hidden',
      }}
    >
      {/* 原创 48kHz 立体声配乐与 Foley 音效 */}
      <Audio src={staticFile('audio/soundtrack.mp3')} />

      {/* 导演三维透视摄像机世界容器 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px`,
          transform: `perspective(1600px) rotateX(${cam.tiltXDeg}deg) scale(${cam.scale}) rotate(${cam.rotateDeg}deg) translate3d(${tx}px, ${ty}px, 0)`,
          willChange: 'transform',
        }}
      >
        <WoodenStage
          frame={frame}
          spotX={cam.spotX}
          spotY={cam.spotY}
          spotIntensity={cam.spotIntensity}
        />

        <OmniMachine frame={frame} />
        <DialogueLayer frame={frame} />
        <PopupBook frame={frame} />
        <NotEqualBadge frame={frame} />
        <PaperStorm frame={frame} />
      </div>

      {/* 电影感四周柔焦暗角 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 56%, rgba(8, 4, 1, 0.56) 100%)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />

      {/* 屏幕底部安全区手工剪纸白条字幕 */}
      <SubtitleRibbon frame={frame} />
    </div>
  );
};
