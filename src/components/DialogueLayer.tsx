import React from 'react';
import {BEATS} from '../timeline';
import {COLORS, FONTS, smoothProgress, smoothSpring} from '../theme';

interface DialogueLayerProps {
  frame: number;
}

interface BubbleDef {
  id: number;
  side: 'left' | 'right';
  startFrame: number;
  color: string;
  bottomOffset: number;
  xOffset: number;
  icon: 'globe' | 'hourglass' | 'calendar' | 'brush' | 'music';
}

const BUBBLES: BubbleDef[] = [
  {id: 1, side: 'left', startFrame: BEATS.bubble1, color: COLORS.cWorld, bottomOffset: 175, xOffset: 24, icon: 'globe'},
  {id: 2, side: 'right', startFrame: BEATS.bubble2, color: COLORS.cTime, bottomOffset: 175, xOffset: -24, icon: 'hourglass'},
  {id: 3, side: 'left', startFrame: BEATS.bubble3, color: COLORS.cEra, bottomOffset: 295, xOffset: 44, icon: 'calendar'},
  {id: 4, side: 'right', startFrame: BEATS.bubble4, color: COLORS.cStyle, bottomOffset: 295, xOffset: -44, icon: 'brush'},
  {id: 5, side: 'left', startFrame: BEATS.bubble5, color: COLORS.cRhythm, bottomOffset: 410, xOffset: 24, icon: 'music'},
];

const BubbleIcon: React.FC<{icon: BubbleDef['icon']}> = ({icon}) => {
  switch (icon) {
    case 'globe':
      return (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#F8F4EA" strokeWidth="2.8">
          <circle cx="24" cy="24" r="16" />
          <ellipse cx="24" cy="24" rx="8" ry="16" />
          <line x1="8" y1="24" x2="40" y2="24" />
          <path d="M11 16 Q24 20 37 16 M11 32 Q24 28 37 32" />
        </svg>
      );
    case 'hourglass':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#F8F4EA" strokeWidth="2.8" strokeLinecap="round">
          <line x1="14" y1="10" x2="34" y2="10" />
          <line x1="14" y1="38" x2="34" y2="38" />
          <path d="M16 10 L32 38 M32 10 L16 38" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#F8F4EA" strokeWidth="2.8" strokeLinecap="round">
          <rect x="10" y="13" width="28" height="24" rx="3" />
          <line x1="10" y1="21" x2="38" y2="21" />
          <line x1="18" y1="9" x2="18" y2="15" />
          <line x1="30" y1="9" x2="30" y2="15" />
          <circle cx="18" cy="28" r="1.6" fill="#F8F4EA" />
          <circle cx="24" cy="28" r="1.6" fill="#F8F4EA" />
          <circle cx="30" cy="28" r="1.6" fill="#F8F4EA" />
        </svg>
      );
    case 'brush':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#F8F4EA" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 34 L31 11 L37 16 L20 38 Z" fill="#F8F4EA" fillOpacity="0.2" />
          <path d="M12 36 C10 40 16 42 19 37" />
        </svg>
      );
    case 'music':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#F8F4EA" strokeWidth="3" strokeLinecap="round">
          <path d="M22 33 V13 L35 10 V29" />
          <circle cx="17" cy="34" r="5" fill="#F8F4EA" />
          <circle cx="30" cy="30" r="5" fill="#F8F4EA" />
        </svg>
      );
  }
};

export const DialogueLayer: React.FC<DialogueLayerProps> = ({frame}) => {
  // 205 淡入，510 淡出让位给立体书展卷
  if (frame < BEATS.scene2Start || frame > 540) return null;

  const enterOpacity = smoothProgress(frame, BEATS.scene2Start, BEATS.scene2Start + 20);
  const exitOpacity = 1 - smoothProgress(frame, 480, 526);
  const masterOpacity = enterOpacity * exitOpacity;
  if (masterOpacity <= 0.005) return null;

  const cardPop = smoothSpring(frame, BEATS.scene2Start + 4, {damping: 14, stiffness: 170});
  const bubbleShrink = 1 - smoothProgress(frame, 368, 415);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: masterOpacity,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      {/* 左侧立牌：“我” */}
      <div
        style={{
          position: 'absolute',
          left: 225,
          top: 670,
          width: 190,
          height: 120,
          transform: `translate(-50%, -50%) scale(${cardPop}) rotate(-4deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.paperWarm,
            borderRadius: 4,
            boxShadow: '0 14px 26px rgba(0,0,0,0.48), inset 0 0 0 1px #D5C8AE',
            borderBottom: `9px solid ${COLORS.cTime}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.hand,
              fontSize: 64,
              fontWeight: 700,
              color: '#1C1814',
            }}
          >
            我
          </span>
        </div>
      </div>

      {/* 右侧立牌：“✦ Gemini” */}
      <div
        style={{
          position: 'absolute',
          left: 1695,
          top: 670,
          width: 210,
          height: 120,
          transform: `translate(-50%, -50%) scale(${cardPop}) rotate(4deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.paperWarm,
            borderRadius: 4,
            boxShadow: '0 14px 26px rgba(0,0,0,0.48), inset 0 0 0 1px #D5C8AE',
            borderBottom: '9px solid #5D64D4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span style={{color: '#4B63E8', fontSize: 30}}>✦</span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 34,
              fontWeight: 700,
              color: '#201D1A',
            }}
          >
            Gemini
          </span>
        </div>
      </div>

      {/* 5 枚彩色对话气泡（丝滑弹出与柔和浮沉） */}
      {BUBBLES.map((b, idx) => {
        if (frame < b.startFrame) return null;
        const pop = smoothSpring(frame, b.startFrame, {damping: 12, stiffness: 200});
        const floatY = Math.sin(frame * 0.06 + idx * 1.4) * 5;
        const sc = pop * bubbleShrink;
        if (sc <= 0.01) return null;

        const baseX = b.side === 'left' ? 295 + b.xOffset : 1625 + b.xOffset;
        const baseY = 700 - b.bottomOffset + floatY;

        return (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: baseX,
              top: baseY,
              transform: `translate(-50%, -50%) scale(${sc})`,
              transformOrigin: b.side === 'left' ? 'bottom left' : 'bottom right',
              filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.45))',
            }}
          >
            <div
              style={{
                width: 174,
                height: 112,
                borderRadius: '50%',
                backgroundColor: b.color,
                border: `6px solid ${COLORS.paperWarm}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <BubbleIcon icon={b.icon} />
              {/* 气泡尾尖 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -16,
                  left: b.side === 'left' ? 28 : undefined,
                  right: b.side === 'right' ? 28 : undefined,
                  width: 0,
                  height: 0,
                  borderLeft: '14px solid transparent',
                  borderRight: '14px solid transparent',
                  borderTop: `22px solid ${COLORS.paperWarm}`,
                  transform: b.side === 'left' ? 'rotate(24deg)' : 'rotate(-24deg)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
