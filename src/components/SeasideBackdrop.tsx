import React from 'react';
import {BEATS} from '../timeline';
import {COLORS, easeOutExpo, smoothProgress, smoothSpring} from '../theme';

interface SeasideBackdropProps {
  frame: number;
  width: number;
  height: number;
}

const STARS = Array.from({length: 34}, (_, i) => {
  const s1 = Math.sin(i * 19.31 + 2.7) * 43758.5453;
  const s2 = Math.sin(i * 41.73 + 5.1) * 43758.5453;
  return {
    x: 40 + (s1 - Math.floor(s1)) * 960,
    y: 22 + (s2 - Math.floor(s2)) * 165,
    r: 1.2 + ((i * 7) % 3) * 0.7,
    phase: i * 0.85,
  };
});

const HOUSES = [
  {x: 68, w: 38, h: 48, roof: '#D93A2A', wins: [1, 1, 1, 1]},
  {x: 112, w: 42, h: 58, roof: '#DF9428', wins: [1, 1, 1, 1]},
  {x: 160, w: 46, h: 66, roof: '#136D5C', wins: [1, 1, 1, 1, 1, 1]},
  {x: 214, w: 42, h: 54, roof: '#C9382C', wins: [1, 1, 1, 1]},
  {x: 262, w: 44, h: 46, roof: '#7D2F73', wins: [1, 1, 1, 1]},
  {x: 312, w: 42, h: 52, roof: '#DF9428', wins: [1, 1, 1, 1]},
];

export const SeasideBackdrop: React.FC<SeasideBackdropProps> = ({
  frame,
  width,
  height,
}) => {
  const scenePop = smoothProgress(frame, BEATS.seasidePopup - 20, BEATS.seasidePopup + 28);
  const moonPop = smoothSpring(frame, BEATS.seasidePopup - 12, {damping: 14, stiffness: 130});
  const housePop = smoothSpring(frame, BEATS.seasidePopup + 6, {damping: 14, stiffness: 140});
  const lighthousePop = smoothSpring(frame, BEATS.seasidePopup + 18, {damping: 13, stiffness: 140});
  const beamOn = easeOutExpo(smoothProgress(frame, BEATS.lighthouseGlow - 10, BEATS.lighthouseGlow + 26));

  // 60fps 持续丝滑海浪呼吸与灯塔探照灯光束摆动
  const waveOffset1 = Math.sin(frame * 0.045) * 14;
  const waveOffset2 = Math.cos(frame * 0.038 + 1.2) * 18;
  const beamSweep = -8 + Math.sin(frame * 0.032) * 9;

  if (scenePop <= 0.01) return null;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        opacity: scenePop,
        background: `linear-gradient(180deg, ${COLORS.skyNightTop} 0%, ${COLORS.skyNightMid} 42%, ${COLORS.skyNightLow} 58%, ${COLORS.horizonGlow} 66%, ${COLORS.seaDeep} 67%, #072838 100%)`,
      }}
    >
      {/* 闪烁微星 */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 1040 430"
        preserveAspectRatio="none"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7DA" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#FCE8AE" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FCE8AE" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beamGrad" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#FFF2AF" stopOpacity="0.82" />
            <stop offset="45%" stopColor="#FCE49C" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#FCE49C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {STARS.map((s, idx) => {
          const op = 0.28 + 0.62 * (0.5 + 0.5 * Math.sin(frame * 0.055 + s.phase));
          return <circle key={idx} cx={s.x} cy={s.y} r={s.r} fill="#F5EED8" opacity={op} />;
        })}

        {/* 远山双层剪影 */}
        <path
          d="M0 245 L110 205 L235 232 L355 182 L475 218 L605 186 L730 228 L860 198 L1040 240 L1040 280 L0 280 Z"
          fill={COLORS.mountainBack}
          opacity={0.78}
        />
        <path
          d="M0 260 L150 225 L290 250 L440 214 L575 245 L700 218 L840 252 L1040 232 L1040 280 L0 280 Z"
          fill={COLORS.mountainFront}
        />

        {/* 剪纸满月与环形山质感 */}
        <g transform={`translate(285, 118) scale(${moonPop})`}>
          <circle cx="0" cy="0" r="106" fill="url(#moonGlow)" />
          <circle
            cx="0"
            cy="0"
            r="68"
            fill={COLORS.moonCream}
            style={{filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))'}}
          />
          <circle cx="-18" cy="-16" r="14" fill={COLORS.moonCrater} opacity="0.65" />
          <circle cx="22" cy="14" r="11" fill={COLORS.moonCrater} opacity="0.55" />
          <circle cx="-4" cy="24" r="7" fill={COLORS.moonCrater} opacity="0.5" />
          <circle cx="26" cy="-22" r="5" fill={COLORS.moonCrater} opacity="0.45" />
        </g>

        {/* 海面深蓝底与月光倒影横线 */}
        <rect x="0" y="276" width="1040" height="154" fill={COLORS.seaDeep} />
        {Array.from({length: 11}, (_, i) => {
          const ry = 285 + i * 10;
          const rw = 52 - i * 2.5 + Math.sin(frame * 0.06 + i) * 7;
          return (
            <rect
              key={i}
              x={285 - rw / 2 + Math.sin(frame * 0.05 + i * 0.7) * 4}
              y={ry}
              width={Math.max(12, rw)}
              height={3.2}
              rx={1.5}
              fill={COLORS.moonCream}
              opacity={0.75 - i * 0.05}
            />
          );
        })}

        {/* 远海微光细波纹 */}
        {[
          {x: 110, y: 312, w: 68},
          {x: 420, y: 302, w: 92},
          {x: 560, y: 328, w: 76},
          {x: 680, y: 298, w: 58},
        ].map((r, i) => (
          <rect
            key={i}
            x={r.x + Math.sin(frame * 0.03 + i) * 12}
            y={r.y}
            width={r.w}
            height={2.5}
            rx={1.2}
            fill="#579092"
            opacity={0.45}
          />
        ))}

        {/* 6 栋暖黄亮窗彩色海滨小屋 */}
        <g transform={`translate(0, ${(1 - housePop) * 90})`} opacity={housePop}>
          {HOUSES.map((h, idx) => {
            const topY = 276 - h.h;
            return (
              <g key={idx}>
                <rect x={h.x} y={topY} width={h.w} height={h.h} fill={COLORS.paperWarm} stroke="#D5C8AE" strokeWidth="1" />
                <polygon
                  points={`${h.x - 4},${topY} ${h.x + h.w / 2},${topY - 22} ${h.x + h.w + 4},${topY}`}
                  fill={h.roof}
                />
                {/* 暖光小窗 */}
                {h.wins.map((_, wi) => {
                  const col = wi % 2;
                  const row = Math.floor(wi / 2);
                  return (
                    <rect
                      key={wi}
                      x={h.x + 8 + col * (h.w - 22)}
                      y={topY + 10 + row * 14}
                      width={8}
                      height={9}
                      rx={1}
                      fill="#F7BF4F"
                      opacity={0.85 + 0.15 * Math.sin(frame * 0.08 + idx + wi)}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* 右侧悬崖 + 红白条纹灯塔 + 体积探照灯光束 */}
        <g transform={`translate(0, ${(1 - lighthousePop) * 120})`} opacity={lighthousePop}>
          {/* 悬崖绿草顶与黑岩主体 */}
          <path d="M742 260 Q865 232 1040 248 L1040 278 L742 278 Z" fill={COLORS.grassGreen} />
          <path
            d="M735 270 L768 258 L890 250 L1040 260 L1040 430 L725 430 L720 335 Z"
            fill={COLORS.cliffDark}
          />

          {/* 塔身 */}
          <polygon points="866,252 882,115 928,115 944,252" fill={COLORS.lighthouseWhite} />
          {/* 红色横向条纹 */}
          <polygon points="870,224 940,224 937,200 873,200" fill={COLORS.lighthouseRed} />
          <polygon points="875,176 935,176 932,152 878,152" fill={COLORS.lighthouseRed} />
          <polygon points="880,128 930,128 928,115 882,115" fill={COLORS.lighthouseRed} />

          {/* 底座平台与发光灯室 */}
          <rect x="875" y="106" width="60" height="8" rx="2" fill="#231D18" />
          <rect
            x="884"
            y="80"
            width="42"
            height="26"
            fill="#FBE178"
            opacity={0.55 + 0.45 * beamOn}
          />
          <polygon points="878,80 905,58 932,80" fill={COLORS.lighthouseRed} />
          <circle cx="905" cy="92" r={36 * beamOn} fill="url(#moonGlow)" />

          {/* 持续 60fps 扫动的体积探照灯光束 */}
          {beamOn > 0.02 && (
            <g
              transform={`translate(884, 92) rotate(${beamSweep})`}
              opacity={beamOn}
            >
              <polygon points="0,-11 -390,-58 -390,46 0,11" fill="url(#beamGrad)" />
            </g>
          )}
        </g>

        {/* 前景双层青绿海浪（60fps 丝滑错峰涌动） */}
        <g transform={`translate(${waveOffset1}, 0)`}>
          {Array.from({length: 14}, (_, i) => {
            const cx = -40 + i * 86;
            return (
              <g key={i}>
                <circle cx={cx} cy={386} r={34} fill={COLORS.seaFoam} />
                <circle cx={cx} cy={392} r={30} fill={COLORS.seaWave} />
              </g>
            );
          })}
        </g>
        <g transform={`translate(${waveOffset2}, 0)`}>
          {Array.from({length: 14}, (_, i) => {
            const cx = -15 + i * 86;
            return <circle key={i} cx={cx} cy={412} r={28} fill="#104952" />;
          })}
        </g>
      </svg>

      {/* 底部前沿浅黄沙滩剪纸带与绿草丛 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 36,
          background: `linear-gradient(180deg, ${COLORS.sandWarm} 0%, #B38A50 100%)`,
          borderTop: '2px solid #DFB97E',
        }}
      >
        {[82, 165, 340, 480, 620, 745, 895, 965].map((gx, i) => (
          <svg
            key={i}
            width="28"
            height="22"
            viewBox="0 0 28 22"
            style={{position: 'absolute', left: gx, top: -10}}
          >
            <path
              d="M14 22 L6 4 M14 22 L14 2 M14 22 L22 5"
              stroke={COLORS.grassGreen}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>
    </div>
  );
};
