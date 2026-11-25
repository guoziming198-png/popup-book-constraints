import React from 'react';
import {COLORS, HEIGHT, WIDTH} from '../theme';

interface WoodenStageProps {
  frame: number;
  spotX: number;
  spotY: number;
  spotIntensity: number;
}

// 28 颗 60fps 持续漂浮闪烁的温暖光尘粒子（确定性伪随机分布）
const DUST_MOTES = Array.from({length: 28}, (_, i) => {
  const s1 = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  const s2 = Math.sin(i * 78.233 + 1.9231) * 43758.5453;
  const s3 = Math.sin(i * 39.421 + 9.7112) * 43758.5453;
  const r1 = s1 - Math.floor(s1);
  const r2 = s2 - Math.floor(s2);
  const r3 = s3 - Math.floor(s3);
  return {
    id: i,
    baseX: 120 + r1 * (WIDTH - 240),
    baseY: 80 + r2 * (HEIGHT - 160),
    radius: 1.8 + r3 * 2.8,
    speedX: 0.008 + r1 * 0.012,
    speedY: 0.012 + r2 * 0.015,
    phase: r3 * Math.PI * 2,
  };
});

export const WoodenStage: React.FC<WoodenStageProps> = ({
  frame,
  spotX,
  spotY,
  spotIntensity,
}) => {
  // 外扩画布 1600px，保证任意高倍特写或荷兰角旋转时边缘绝无黑底穿帮
  const overscan = 1600;
  const stageW = WIDTH + overscan * 2;
  const stageH = HEIGHT + overscan * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: -overscan,
        top: -overscan,
        width: stageW,
        height: stageH,
        background: `radial-gradient(ellipse at ${spotX + overscan}px ${spotY + overscan}px, ${COLORS.woodWarm} 0%, ${COLORS.woodMid} 24%, ${COLORS.woodDark} 62%, #130B05 100%)`,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* 细腻胡桃木纵向/横向木纹 */}
      <svg
        width={stageW}
        height={stageH}
        viewBox={`0 0 ${stageW} ${stageH}`}
        style={{position: 'absolute', inset: 0, opacity: 0.24}}
      >
        <defs>
          <pattern
            id="woodGrainPattern"
            width="640"
            height="180"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 18 Q160 12 320 20 T640 16 M0 46 Q180 54 360 44 T640 50 M0 82 Q140 76 310 85 T640 80 M0 118 Q200 126 420 116 T640 122 M0 154 Q160 148 340 156 T640 152"
              fill="none"
              stroke="#120A04"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M0 31 Q220 26 420 34 T640 30 M0 98 Q170 103 390 95 T640 100 M0 137 Q210 131 440 139 T640 135"
              fill="none"
              stroke="#7A532C"
              strokeWidth="1.2"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width={stageW} height={stageH} fill="url(#woodGrainPattern)" />
      </svg>

      {/* 动态跟随导演焦点的暖色桌灯聚光光晕 */}
      <div
        style={{
          position: 'absolute',
          left: spotX + overscan - 720,
          top: spotY + overscan - 540,
          width: 1440,
          height: 1080,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 206, 132, ${0.22 * spotIntensity}) 0%, rgba(212, 136, 56, ${0.1 * spotIntensity}) 42%, transparent 72%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* 60fps 持续飘浮的温暖微尘粒子 */}
      {DUST_MOTES.map((m) => {
        const dx = Math.sin(frame * m.speedX + m.phase) * 34;
        const dy = ((frame * m.speedY * 22 + m.baseY) % (HEIGHT + 160)) - 80;
        const flicker = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(frame * 0.05 + m.phase * 2));
        return (
          <div
            key={m.id}
            style={{
              position: 'absolute',
              left: m.baseX + overscan + dx,
              top: overscan + dy,
              width: m.radius * 2,
              height: m.radius * 2,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFF3CC 0%, rgba(255,214,128,0) 72%)',
              opacity: flicker * spotIntensity,
            }}
          />
        );
      })}
    </div>
  );
};
