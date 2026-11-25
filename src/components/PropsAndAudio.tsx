import React from 'react';
import {BEATS} from '../timeline';
import {
  COLORS,
  clamp,
  easeInOutCubic,
  lerp,
  smoothProgress,
  smoothSpring,
} from '../theme';

interface PropsAndAudioProps {
  frame: number;
  renderNotEqual?: boolean;
}

const WAVE_BARS = Array.from({length: 25}, (_, i) => i);

export const NotEqualBadge: React.FC<{frame: number}> = ({frame}) => {
  const nePop = smoothSpring(frame, BEATS.notEqualImpact, {damping: 11, stiffness: 230});
  const neHide = smoothProgress(frame, BEATS.stormStart, BEATS.stormStart + 25);
  const neVis = clamp(nePop * (1 - neHide));
  if (neVis <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 692,
        top: 545,
        transform: `translate(-50%, -50%) scale(${neVis}) rotate(-4deg)`,
        filter: 'drop-shadow(0 16px 24px rgba(10,4,1,0.58))',
        pointerEvents: 'none',
        zIndex: 28,
      }}
    >
      <svg width="144" height="134" viewBox="0 0 150 140">
        <g stroke={COLORS.paperWarm} strokeWidth="24" strokeLinecap="round">
          <line x1="28" y1="50" x2="122" y2="50" />
          <line x1="28" y1="90" x2="122" y2="90" />
          <line x1="98" y1="22" x2="52" y2="118" />
        </g>
        <g stroke={COLORS.alertRedDark} strokeWidth="16" strokeLinecap="round" transform="translate(3,4)">
          <line x1="28" y1="50" x2="122" y2="50" />
          <line x1="28" y1="90" x2="122" y2="90" />
          <line x1="98" y1="22" x2="52" y2="118" />
        </g>
        <g stroke={COLORS.alertRed} strokeWidth="15" strokeLinecap="round">
          <line x1="28" y1="50" x2="122" y2="50" />
          <line x1="28" y1="90" x2="122" y2="90" />
          <line x1="98" y1="22" x2="52" y2="118" />
        </g>
      </svg>
    </div>
  );
};

export const PropsAndAudio: React.FC<PropsAndAudioProps> = ({frame}) => {
  // 在立体书展开期（684..1812）以及大结局盛开期（2100..2292）显示
  const tempHide = smoothProgress(frame, BEATS.bookTempCloseStart, BEATS.bookTempCloseEnd);
  const finaleShow = smoothProgress(frame, BEATS.finaleBurst, BEATS.finaleSettle);
  const stageActive = clamp(1 - tempHide + finaleShow * tempHide);

  // 1. 黄雨衣小女孩立牌（768弹出，862丝滑滑步至最右侧）
  const girlPop = smoothSpring(frame, BEATS.girlPopup, {damping: 13, stiffness: 165});
  const slideT = easeInOutCubic(
    smoothProgress(frame, BEATS.girlSlideRight, BEATS.girlSlideRight + 42),
  );
  const girlX = lerp(1150, 1410, slideT);
  const girlY = lerp(575, 588, slideT);
  const girlBob = Math.sin(frame * 0.07) * 2.5;

  // 2. 紫色留声机与实时 60fps 律动声波（1352 弹出）
  const gramPop = smoothSpring(frame, BEATS.gramophonePopup, {damping: 12, stiffness: 170});

  // 3. 红白剪辑三角旗（1368 弹出）
  const flagPop = smoothSpring(frame, BEATS.flagPopup, {damping: 12, stiffness: 190});
  const flagWave = Math.sin(frame * 0.08) * 5;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20}}>
      {/* 黄雨衣小女孩立牌 */}
      {girlPop > 0.01 && stageActive > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: girlX,
            top: girlY + girlBob,
            transform: `translate(-50%, -100%) scale(${girlPop * stageActive})`,
            transformOrigin: 'bottom center',
            filter: 'drop-shadow(12px 14px 12px rgba(10,5,1,0.48))',
          }}
        >
          <svg width="112" height="175" viewBox="0 0 112 175">
            {/* 白纸剪裁轮廓边 */}
            <path
              d="M56 12 C78 12 86 28 84 52 L92 122 L76 126 L76 164 L36 164 L36 126 L20 122 L28 52 C26 28 34 12 56 12 Z"
              fill={COLORS.paperWarm}
            />
            {/* 黑色齐刘海波波头 */}
            <path d="M34 46 C34 20 78 20 78 46 L78 58 L34 58 Z" fill="#1F1A17" />
            {/* 脸部与腮红 */}
            <rect x="42" y="34" width="28" height="22" rx="8" fill="#F2D7BD" />
            <rect x="38" y="28" width="36" height="10" rx="4" fill="#1F1A17" />
            <circle cx="49" cy="44" r="2.2" fill="#1F1A17" />
            <circle cx="63" cy="44" r="2.2" fill="#1F1A17" />
            {/* 红围巾 */}
            <rect x="39" y="55" width="34" height="11" rx="5" fill={COLORS.raincoatRed} />
            {/* 亮黄雨衣 + 两颗小扣 */}
            <path d="M32 65 L80 65 L86 122 L26 122 Z" fill={COLORS.raincoatYellow} />
            <circle cx="56" cy="84" r="3" fill="#8C6715" />
            <circle cx="56" cy="100" r="3" fill="#8C6715" />
            {/* 深蓝长裤与小红靴 */}
            <rect x="41" y="122" width="11" height="24" fill="#1B3C59" />
            <rect x="60" y="122" width="11" height="24" fill="#1B3C59" />
            <rect x="39" y="146" width="14" height="10" rx="3" fill={COLORS.raincoatRed} />
            <rect x="59" y="146" width="14" height="10" rx="3" fill={COLORS.raincoatRed} />
          </svg>
        </div>
      )}

      {/* 紫色大喇叭留声机 + 60fps 声波柱 */}
      {gramPop > 0.01 && stageActive > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 515,
            top: 635,
            transform: `translate(-50%, -100%) scale(${gramPop * stageActive})`,
            transformOrigin: 'bottom center',
            filter: 'drop-shadow(8px 12px 12px rgba(10,5,1,0.48))',
          }}
        >
          {/* 60fps 律动声波柱 */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -42,
              display: 'flex',
              alignItems: 'center',
              gap: 3.5,
              height: 44,
              padding: '3px 7px',
              backgroundColor: 'rgba(247, 241, 227, 0.9)',
              borderRadius: 12,
              boxShadow: '0 4px 10px rgba(0,0,0,0.32)',
            }}
          >
            {WAVE_BARS.map((i) => {
              const amp =
                0.28 +
                0.72 *
                  Math.abs(
                    Math.sin(frame * 0.16 + i * 0.65) *
                      Math.cos(frame * 0.07 - i * 0.28),
                  );
              return (
                <div
                  key={i}
                  style={{
                    width: 3.2,
                    height: 6 + amp * 26,
                    borderRadius: 2,
                    backgroundColor: COLORS.cRhythm,
                  }}
                />
              );
            })}
          </div>

          <svg width="112" height="106" viewBox="0 0 112 106">
            {/* 木质底座 */}
            <rect x="18" y="80" width="66" height="20" rx="3" fill="#5D3717" />
            <rect x="22" y="74" width="58" height="7" rx="2" fill="#8C592B" />
            {/* 紫金大喇叭 */}
            <path d="M52 74 L52 54 L26 24 C46 10 88 18 96 42 C98 56 80 68 58 62 Z" fill={COLORS.cRhythm} />
            <ellipse
              cx="84"
              cy="40"
              rx="13"
              ry="24"
              transform="rotate(-18 84 40)"
              fill="#4E1A48"
              stroke="#C577BA"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      )}

      {/* 海面红白剪辑三角旗 */}
      {flagPop > 0.01 && stageActive > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 1268,
            top: 410,
            transform: `translate(-50%, -100%) scale(${flagPop * stageActive})`,
            transformOrigin: 'bottom center',
            filter: 'drop-shadow(4px 8px 8px rgba(0,0,0,0.4))',
          }}
        >
          <svg width="56" height="78" viewBox="0 0 56 78">
            <rect x="6" y="8" width="4" height="68" rx="2" fill="#E8DFCA" />
            <polygon
              points={`10,10 52,${22 + flagWave} 10,36`}
              fill={COLORS.alertRed}
              stroke={COLORS.paperWarm}
              strokeWidth="2.5"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
