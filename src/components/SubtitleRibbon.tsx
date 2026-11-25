import React from 'react';
import {SUBTITLE_CUES} from '../timeline';
import {COLORS, FONTS, clamp, smoothProgress} from '../theme';

interface SubtitleRibbonProps {
  frame: number;
}

export const SubtitleRibbon: React.FC<SubtitleRibbonProps> = ({frame}) => {
  const active = SUBTITLE_CUES.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  const fadeIn = smoothProgress(frame, active.start, active.start + 9);
  const fadeOut = 1 - smoothProgress(frame, active.end - 9, active.end);
  const opacity = clamp(Math.min(fadeIn, fadeOut));
  const yOffset = (1 - fadeIn) * 8;

  // 基于字符数微调手剪纸条宽度，确保视觉紧凑饱满
  const approxWidth = Math.max(360, active.text.length * 33 + 96);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 42,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div
        style={{
          position: 'relative',
          minWidth: approxWidth,
          padding: '15px 46px',
          opacity,
          transform: `translateY(${yOffset}px)`,
          filter: 'drop-shadow(0 8px 18px rgba(10, 5, 2, 0.55))',
        }}
      >
        {/* 不规则手工剪裁白纸条 SVG 背景 */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 84"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <polygon
            points="10,6 290,2 592,7 586,78 310,82 4,76"
            fill={COLORS.subtitleBg}
            stroke="#E5DEC9"
            strokeWidth="1.5"
          />
        </svg>

        <div
          style={{
            position: 'relative',
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: 34,
            lineHeight: 1.25,
            letterSpacing: '0.03em',
            color: COLORS.subtitleInk,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {active.text}
        </div>
      </div>
    </div>
  );
};
