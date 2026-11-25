import React from 'react';
import {BEATS} from '../timeline';
import {
  COLORS,
  FONTS,
  clamp,
  easeOutCubic,
  easeOutExpo,
  smoothProgress,
  smoothSpring,
} from '../theme';

interface StoryboardAccordionProps {
  frame: number;
}

interface ShotPanel {
  id: number;
  title: string;
  year: string;
  styleName: string;
  propStart: number;
  styleStart: number;
}

const PANELS: ShotPanel[] = [
  {id: 1, title: '镜头 1', year: '1925', styleName: '剪影', propStart: BEATS.propTrain, styleStart: BEATS.styleSilhouette},
  {id: 2, title: '镜头 2', year: '1965', styleName: '网点', propStart: BEATS.propRocket, styleStart: BEATS.styleHalftone},
  {id: 3, title: '镜头 3', year: '1995', styleName: '像素', propStart: BEATS.propComputer, styleStart: BEATS.stylePixel},
  {id: 4, title: '镜头 4', year: '2035', styleName: '霓虹', propStart: BEATS.propDrone, styleStart: BEATS.styleNeon},
];

// 线稿底图（时间跨度阶段先展示素描草图）
const SketchIllustration: React.FC<{panelId: number}> = ({panelId}) => {
  switch (panelId) {
    case 1:
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <rect width="180" height="118" fill="#EFE8D8" />
          <line x1="0" y1="86" x2="180" y2="86" stroke="#7A7060" strokeWidth="1.2" />
          <circle cx="144" cy="42" r="14" fill="none" stroke="#8C806D" strokeWidth="1.2" />
          <path d="M24 86 L24 38 M20 42 L28 42" stroke="#6B6254" strokeWidth="1.4" />
          <path d="M98 86 L106 72 L154 72 L162 86 Z" fill="none" stroke="#5A5245" strokeWidth="1.4" />
          <rect x="118" y="60" width="12" height="12" fill="none" stroke="#5A5245" strokeWidth="1.2" />
          <path d="M122 57 C110 47, 94 45, 76 34" fill="none" stroke="#8C806D" strokeDasharray="3 3" strokeWidth="1.3" />
          <path d="M12 98 Q48 94 84 99 T168 97" fill="none" stroke="#9B8E7A" strokeWidth="1" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <rect width="180" height="118" fill="#EFE8D8" />
          <path d="M0 95 L180 86 L180 118 L0 118 Z" fill="#E6DEC8" stroke="#8B7F6C" strokeWidth="1" />
          <rect x="16" y="76" width="26" height="20" fill="none" stroke="#6E6556" strokeWidth="1.3" />
          <polygon points="14,76 29,63 44,76" fill="none" stroke="#6E6556" strokeWidth="1.3" />
          <circle cx="58" cy="84" r="4" fill="none" stroke="#5A5245" strokeWidth="1.2" />
          <rect x="54" y="88" width="8" height="14" fill="none" stroke="#5A5245" strokeWidth="1.2" />
          <path d="M84 92 Q108 55 142 36" fill="none" stroke="#7A7060" strokeDasharray="4 3" strokeWidth="1.4" />
          <circle cx="146" cy="34" r="9" fill="none" stroke="#5A5245" strokeWidth="1.3" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <rect width="180" height="118" fill="#EFE8D8" />
          <line x1="0" y1="90" x2="180" y2="90" stroke="#7A7060" strokeWidth="1.2" />
          <circle cx="136" cy="36" r="15" fill="none" stroke="#8C806D" strokeWidth="1.2" />
          {[96, 108, 122, 136, 150, 162].map((bx, i) => (
            <rect
              key={i}
              x={bx}
              y={54 + ((i * 7) % 18)}
              width={10}
              height={36 - ((i * 7) % 18)}
              fill="none"
              stroke="#6B6254"
              strokeWidth="1.1"
            />
          ))}
          <circle cx="46" cy="82" r="4" fill="none" stroke="#5A5245" strokeWidth="1.2" />
          <rect x="42" y="86" width="8" height="14" fill="none" stroke="#5A5245" strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <rect width="180" height="118" fill="#EFE8D8" />
          <line x1="0" y1="88" x2="180" y2="88" stroke="#7A7060" strokeWidth="1.2" />
          {[96, 122, 148].map((wx, i) => (
            <g key={i}>
              <line x1={wx} y1="88" x2={wx} y2="48" stroke="#5E5548" strokeWidth="1.4" />
              <line x1={wx} y1="48" x2={wx - 12} y2="38" stroke="#5E5548" strokeWidth="1.2" />
              <line x1={wx} y1="48" x2={wx + 12} y2="38" stroke="#5E5548" strokeWidth="1.2" />
              <line x1={wx} y1="48" x2={wx} y2="62" stroke="#5E5548" strokeWidth="1.2" />
            </g>
          ))}
          <path d="M22 24 L38 24 M30 24 L30 30" stroke="#5E5548" strokeWidth="1.3" />
          <circle cx="48" cy="84" r="4" fill="none" stroke="#5A5245" strokeWidth="1.2" />
          <rect x="44" y="88" width="8" height="14" fill="none" stroke="#5A5245" strokeWidth="1.2" />
        </svg>
      );
  }
};

// 四种电影风格刷色成品图
const StyledIllustration: React.FC<{panelId: number; frame: number}> = ({
  panelId,
  frame,
}) => {
  switch (panelId) {
    case 1: // 剪影
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <defs>
            <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9A3B12" />
              <stop offset="65%" stopColor="#E6882B" />
              <stop offset="100%" stopColor="#F5BD58" />
            </linearGradient>
          </defs>
          <rect width="180" height="86" fill="url(#sunsetGrad)" />
          <rect y="86" width="180" height="32" fill="#2A1708" />
          <circle cx="144" cy="44" r="14" fill="#FFF2B8" opacity="0.92" />
          <path d="M24 86 L24 38 M20 42 L28 42" stroke="#140B04" strokeWidth="2.4" />
          <path d="M98 86 L106 71 L156 71 L164 86 Z" fill="#140B04" />
          <rect x="119" y="59" width="11" height="12" fill="#140B04" />
          <circle cx={112 - ((frame * 0.4) % 18)} cy={52 - ((frame * 0.25) % 10)} r="4.5" fill="#140B04" opacity="0.7" />
          <circle cx={96 - ((frame * 0.4) % 18)} cy={45 - ((frame * 0.25) % 10)} r="6" fill="#140B04" opacity="0.55" />
        </svg>
      );
    case 2: // 网点（波普漫画半调圆点）
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <defs>
            <pattern id="halftone" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.4" fill="#1B7C88" opacity="0.32" />
            </pattern>
          </defs>
          <rect width="180" height="72" fill="#46B8C4" />
          <rect width="180" height="72" fill="url(#halftone)" />
          <rect y="72" width="180" height="28" fill="#1B649E" />
          <path d="M0 98 L180 86 L180 118 L0 118 Z" fill="#EAC148" />
          <rect x="16" y="74" width="26" height="20" fill="#F6F2E4" stroke="#18222B" strokeWidth="1.5" />
          <polygon points="13,74 29,61 45,74" fill="#E34C38" stroke="#18222B" strokeWidth="1.5" />
          <circle cx="58" cy="84" r="4" fill="#1C1A17" />
          <rect x="54" y="88" width="8" height="14" rx="2" fill="#F0C838" />
          <path d="M84 92 Q108 55 142 36" fill="none" stroke="#FFF4D0" strokeWidth="2.8" />
          <circle cx="146" cy="34" r="10" fill="#E53E2D" stroke="#18222B" strokeWidth="1.6" />
        </svg>
      );
    case 3: // 像素
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <rect width="180" height="74" fill="#3B82D6" />
          <rect y="74" width="180" height="26" fill="#194B8C" />
          <path d="M0 98 L180 88 L180 118 L0 118 Z" fill="#E5B842" />
          {/* 8-bit 像素太阳 */}
          <rect x="128" y="20" width="24" height="24" fill="#FFE680" />
          <rect x="124" y="24" width="32" height="16" fill="#FFE680" />
          {/* 像素楼群 */}
          {[
            {x: 92, y: 52, w: 12, h: 32, c: '#E6D6B8'},
            {x: 106, y: 44, w: 14, h: 40, c: '#F5EAD0'},
            {x: 122, y: 56, w: 12, h: 28, c: '#D8C7A8'},
            {x: 136, y: 40, w: 16, h: 44, c: '#F5EAD0'},
            {x: 154, y: 50, w: 14, h: 34, c: '#E6D6B8'},
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
              <rect x={b.x + 3} y={b.y + 6} width={3} height={3} fill="#F29F3D" />
              <rect x={b.x + 3} y={b.y + 14} width={3} height={3} fill="#F29F3D" />
            </g>
          ))}
          {/* 像素黄衣女孩 */}
          <rect x="44" y="80" width="6" height="6" fill="#1B1917" />
          <rect x="42" y="86" width="10" height="12" fill="#F2C830" />
        </svg>
      );
    default: // 霓虹
      return (
        <svg viewBox="0 0 180 118" width="100%" height="100%">
          <rect width="180" height="118" fill="#140726" />
          <ellipse cx="144" cy="36" rx="18" ry="18" fill="none" stroke="#FF2EB6" strokeWidth="2.2" />
          {/* 霓虹海面激光网格 */}
          <line x1="0" y1="86" x2="180" y2="86" stroke="#00F5D4" strokeWidth="1.8" />
          <line x1="0" y1="98" x2="180" y2="98" stroke="#9B4DFF" strokeWidth="1" opacity="0.7" />
          <line x1="0" y1="110" x2="180" y2="110" stroke="#9B4DFF" strokeWidth="1" opacity="0.5" />
          {/* 旋转霓虹风车 */}
          {[96, 122, 148].map((wx, i) => (
            <g key={i}>
              <line x1={wx} y1="86" x2={wx} y2="48" stroke="#00F5D4" strokeWidth="2.2" />
              <g transform={`translate(${wx}, 48) rotate(${frame * 1.4 + i * 35})`}>
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#39FFB6" strokeWidth="2" />
                <line x1="0" y1="0" x2="14" y2="9" stroke="#39FFB6" strokeWidth="2" />
                <line x1="0" y1="0" x2="-14" y2="9" stroke="#39FFB6" strokeWidth="2" />
              </g>
            </g>
          ))}
          {/* 霓虹无人机光点 */}
          <rect x="20" y="22" width="20" height="4" rx="2" fill="#FF3BC8" />
          {/* 女孩剪影发光边 */}
          <circle cx="48" cy="84" r="4.5" fill="#FF2EB6" />
          <rect x="44" y="88" width="8" height="14" rx="2" fill="#FFE658" />
        </svg>
      );
  }
};

// 胶片前方 4 个白边纸艺立体微缩道具（带 60fps 活态呼吸/蒸汽/扫描）
const EraMiniProp: React.FC<{panelId: number; frame: number; pop: number}> = ({
  panelId,
  frame,
  pop,
}) => {
  if (pop <= 0.01) return null;
  const scaleY = clamp(pop);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: -44,
        transform: `translateX(-50%) scale(${scaleY})`,
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 12px 14px rgba(10,5,1,0.52))',
        zIndex: 14,
      }}
    >
      {panelId === 1 && (
        // 1925 黑金复古蒸汽小火车 + 60fps 上升白色蒸汽
        <svg width="118" height="84" viewBox="0 0 118 84">
          {/* 活态蒸汽球 */}
          {[0, 1, 2].map((i) => {
            const cycle = ((frame * 0.025 + i * 0.33) % 1);
            return (
              <circle
                key={i}
                cx={24 + cycle * 24}
                cy={24 - cycle * 18}
                r={7 + cycle * 5}
                fill="#F8F3E6"
                opacity={(1 - cycle) * 0.85}
              />
            );
          })}
          {/* 白纸剪裁外框 */}
          <rect x="12" y="26" width="94" height="44" rx="8" fill={COLORS.paperWarm} />
          {/* 火车车体 */}
          <rect x="18" y="38" width="54" height="22" rx="3" fill="#1D1A16" />
          <rect x="64" y="30" width="34" height="30" rx="3" fill="#2A241E" />
          <rect x="24" y="28" width="12" height="12" fill="#D4A138" />
          <rect x="18" y="44" width="54" height="4" fill="#D4A138" />
          <rect x="72" y="36" width="18" height="12" fill="#F2C85B" />
          {[28, 48, 70, 88].map((wx, i) => (
            <circle key={i} cx={wx} cy="64" r="7" fill="#1D1A16" stroke="#D4A138" strokeWidth="2.2" />
          ))}
        </svg>
      )}

      {panelId === 2 && (
        // 1965 红白太空火箭 + 60fps 尾焰微脉动
        <svg width="86" height="96" viewBox="0 0 86 96">
          <path d="M43 4 C64 26 66 56 58 76 L28 76 C20 56 22 26 43 4 Z" fill={COLORS.paperWarm} />
          <polygon points="24,62 8,82 28,76" fill={COLORS.paperWarm} />
          <polygon points="62,62 78,82 58,76" fill={COLORS.paperWarm} />
          {/* 尾焰呼吸 */}
          <polygon
            points={`35,78 51,78 43,${89 + Math.sin(frame * 0.35) * 4}`}
            fill="#F39C2E"
          />
          <path d="M43 10 C58 28 60 54 54 72 L32 72 C26 54 28 28 43 10 Z" fill="#F4EDE0" />
          <path d="M43 10 C50 18 54 24 55 29 L31 29 C32 24 36 18 43 10 Z" fill="#CC3928" />
          <polygon points="27,60 12,78 30,72" fill="#CC3928" />
          <polygon points="59,60 74,78 56,72" fill="#CC3928" />
          <circle cx="43" cy="44" r="8" fill="#1F5899" stroke="#D4D0C8" strokeWidth="2" />
        </svg>
      )}

      {panelId === 3 && (
        // 1995 米白复古 CRT 电脑 + 60fps 绿屏代码扫描
        <svg width="104" height="84" viewBox="0 0 104 84">
          <rect x="10" y="10" width="84" height="54" rx="7" fill={COLORS.paperWarm} />
          <rect x="4" y="64" width="96" height="14" rx="4" fill={COLORS.paperWarm} />
          <rect x="16" y="15" width="72" height="44" rx="4" fill="#D5CCB8" />
          <rect x="22" y="21" width="60" height="32" rx="2" fill="#0F2A1A" />
          {/* 荧光绿代码行脉冲 */}
          {[0, 1, 2].map((row) => {
            const w = 18 + ((Math.sin(frame * 0.1 + row * 1.9) * 0.5 + 0.5) * 28);
            return (
              <rect
                key={row}
                x="28"
                y={27 + row * 8}
                width={w}
                height="3.5"
                rx="1.5"
                fill="#52EB7C"
              />
            );
          })}
          <rect x="10" y="67" width="84" height="7" rx="2" fill="#C9C0AC" />
        </svg>
      )}

      {panelId === 4 && (
        // 2035 未来悬浮双旋翼无人机（60fps 悬浮呼吸 + 旋翼光晕）
        <div style={{transform: `translateY(${Math.sin(frame * 0.08) * 5}px)`}}>
          <svg width="112" height="84" viewBox="0 0 112 84">
            <rect x="53" y="34" width="6" height="46" rx="3" fill="#B5B0A6" />
            <rect x="14" y="24" width="84" height="14" rx="7" fill={COLORS.paperWarm} />
            <ellipse
              cx="26"
              cy="22"
              rx="18"
              ry="4.5"
              fill="#4FE3DC"
              opacity={0.6 + 0.3 * Math.sin(frame * 0.45)}
            />
            <ellipse
              cx="86"
              cy="22"
              rx="18"
              ry="4.5"
              fill="#4FE3DC"
              opacity={0.6 + 0.3 * Math.cos(frame * 0.45)}
            />
            <rect x="34" y="27" width="44" height="9" rx="4.5" fill="#D6D2C9" />
            <circle cx="56" cy="36" r="4" fill="#D93626" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const StoryboardAccordion: React.FC<StoryboardAccordionProps> = ({
  frame,
}) => {
  if (frame < BEATS.accordionStart) return null;

  // 整体折页展开进度（848..942 丝滑从左向右展开）
  const unfoldT = easeOutExpo(
    smoothProgress(frame, BEATS.accordionStart, BEATS.accordionEnd),
  );

  // 30.2s 暂合时手风琴优雅折回，35.0s 破茧而出再盛大展开
  const tempFold = smoothProgress(frame, BEATS.bookTempCloseStart, BEATS.bookTempCloseEnd);
  const finaleReopen = easeOutExpo(smoothProgress(frame, BEATS.finaleBurst, BEATS.finaleSettle));
  const activeOpen = clamp(unfoldT * (1 - tempFold + finaleReopen * tempFold));
  if (activeOpen <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 960,
        top: 525,
        transform: `translate(-50%, -50%) scaleX(${lerpScaleX(activeOpen)}) scaleY(${0.7 + 0.3 * activeOpen})`,
        opacity: clamp(activeOpen * 1.4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 12,
        pointerEvents: 'none',
      }}
    >
      {PANELS.map((p, idx) => {
        // 折页轻度 Z 字交替微倾斜，制造真实立体折纸感
        const skewDeg = (idx % 2 === 0 ? -2.2 : 2.2) * activeOpen;
        const propPop = smoothSpring(frame, p.propStart, {damping: 12, stiffness: 170});
        const styleWipe = easeOutCubic(
          smoothProgress(frame, p.styleStart, p.styleStart + 36),
        );
        const tagFlip = smoothSpring(frame, p.styleStart + 6, {damping: 13, stiffness: 180});

        return (
          <div
            key={p.id}
            style={{
              position: 'relative',
              width: 196,
              height: 182,
              marginLeft: idx === 0 ? 0 : -2,
              backgroundColor: '#F3ECE0',
              boxShadow:
                '0 12px 24px rgba(10,5,1,0.38), inset 0 0 0 1px #D5CAB4',
              transform: `skewY(${skewDeg}deg)`,
              display: 'flex',
              flexDirection: 'column',
              padding: '6px 8px',
              boxSizing: 'border-box',
            }}
          >
            {/* 顶部深蓝风格标签（剪影/网点/像素/霓虹） */}
            {tagFlip > 0.01 && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: -30,
                  transform: `translateX(-50%) scaleY(${clamp(tagFlip)})`,
                  transformOrigin: 'bottom center',
                  backgroundColor: COLORS.cStyle,
                  color: '#F8F4EA',
                  fontFamily: FONTS.sans,
                  fontSize: 16,
                  fontWeight: 700,
                  padding: '4px 20px',
                  borderRadius: '3px 3px 0 0',
                  boxShadow: '0 -3px 8px rgba(0,0,0,0.28)',
                  letterSpacing: '0.12em',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.styleName}
              </div>
            )}

            {/* 顶部电影胶片齿孔 */}
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 2px 3px'}}>
              {Array.from({length: 11}, (_, k) => (
                <div
                  key={k}
                  style={{
                    width: 8,
                    height: 6,
                    borderRadius: 1,
                    backgroundColor: '#989082',
                    opacity: 0.75,
                  }}
                />
              ))}
            </div>

            {/* 镜头编号与年份标题行 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '0 4px 4px',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#2B251F',
                }}
              >
                {p.title}
              </span>
              <span
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.alertRed,
                  lineHeight: 1,
                }}
              >
                {p.year}
              </span>
            </div>

            {/* 中央分镜画幅：底层线稿 + 丝滑扫色蜕变遮罩 */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                border: '1.5px solid #4A433A',
                overflow: 'hidden',
              }}
            >
              <div style={{position: 'absolute', inset: 0}}>
                <SketchIllustration panelId={p.id} />
              </div>

              {styleWipe > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: `inset(0 ${(1 - styleWipe) * 100}% 0 0)`,
                  }}
                >
                  <StyledIllustration panelId={p.id} frame={frame} />
                </div>
              )}

              {/* 刷色魔法扫光边缘 */}
              {styleWipe > 0 && styleWipe < 0.98 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${styleWipe * 100}%`,
                    width: 10,
                    transform: 'translateX(-50%)',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,244,180,0.95), transparent)',
                  }}
                />
              )}
            </div>

            {/* 底部电影胶片齿孔 */}
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '4px 2px 0'}}>
              {Array.from({length: 11}, (_, k) => (
                <div
                  key={k}
                  style={{
                    width: 8,
                    height: 6,
                    borderRadius: 1,
                    backgroundColor: '#989082',
                    opacity: 0.75,
                  }}
                />
              ))}
            </div>

            {/* 时代微缩纸艺立牌 */}
            <EraMiniProp panelId={p.id} frame={frame} pop={propPop} />
          </div>
        );
      })}
    </div>
  );
};

function lerpScaleX(t: number): number {
  return 0.14 + 0.86 * t;
}
