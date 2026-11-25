import React from 'react';
import {BEATS} from '../timeline';
import {COLORS, clamp, easeOutExpo, lerp, smoothProgress} from '../theme';

interface PaperStormProps {
  frame: number;
}

interface StormCard {
  id: number;
  targetX: number;
  targetY: number;
  rot: number;
  startDelay: number;
  burstAngle: number;
  burstDist: number;
  scale: number;
}

// 36 张确定性随机分布的平庸废片卡片
const CARDS: StormCard[] = Array.from({length: 36}, (_, i) => {
  const r1 = Math.sin(i * 12.9898 + 1.23) * 43758.5453;
  const r2 = Math.sin(i * 78.233 + 4.56) * 43758.5453;
  const r3 = Math.sin(i * 45.164 + 7.89) * 43758.5453;
  const u1 = r1 - Math.floor(r1);
  const u2 = r2 - Math.floor(r2);
  const u3 = r3 - Math.floor(r3);

  // 均匀覆盖中景书封和四周桌面
  const tx = 260 + u1 * 1420;
  const ty = 310 + u2 * 520;
  const dx = tx - 960;
  const dy = ty - 540;
  const angle = Math.atan2(dy, dx);

  return {
    id: i,
    targetX: tx,
    targetY: ty,
    rot: (u3 - 0.5) * 68,
    startDelay: i * 4.2,
    burstAngle: angle,
    burstDist: 820 + u1 * 380,
    scale: 0.85 + u2 * 0.25,
  };
});

export const PaperStorm: React.FC<PaperStormProps> = ({frame}) => {
  if (frame < BEATS.stormStart) return null;

  const burstT = easeOutExpo(
    smoothProgress(frame, BEATS.finaleBurst, BEATS.finaleSettle + 15),
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: burstT > 0.25 ? 2 : 25,
      }}
    >
      {CARDS.map((c) => {
        const flyT = easeOutExpo(
          smoothProgress(
            frame,
            BEATS.stormStart + c.startDelay,
            BEATS.stormStart + c.startDelay + 36,
          ),
        );
        if (flyT <= 0.01) return null;

        // 抛物线弧度：从左侧 OMNI 机器口狂涌飞向桌面
        const arcLift = Math.sin(flyT * Math.PI) * 180;
        let x = lerp(380, c.targetX, flyT);
        let y = lerp(520, c.targetY, flyT) - arcLift;
        let rot = lerp(-35, c.rot, flyT);
        let opacity = clamp(flyT * 1.5);

        // 35.0s 立体书爆发：把书本区域的卡片彻底推开至四周桌面外围，衬托中央立体书
        const inBookZone =
          c.targetX > 360 && c.targetX < 1560 && c.targetY > 150 && c.targetY < 860;

        if (burstT > 0) {
          if (inBookZone) {
            const push = burstT * c.burstDist;
            x += Math.cos(c.burstAngle) * push;
            y += Math.sin(c.burstAngle) * push;
            rot += c.burstAngle * 48 * burstT;
          } else {
            x += Math.cos(c.burstAngle) * (160 * burstT);
            y += Math.sin(c.burstAngle) * (110 * burstT);
          }
          opacity *= 0.88;
        }

        return (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 146,
              height: 92,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${c.scale})`,
              backgroundColor: '#CAC6BE',
              borderRadius: 2,
              boxShadow: '0 6px 14px rgba(0,0,0,0.42), inset 0 0 0 1px #ACA89E',
              padding: 8,
              boxSizing: 'border-box',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              opacity,
            }}
          >
            <div
              style={{
                width: 66,
                height: 74,
                backgroundColor: '#8B8983',
                borderRadius: 1,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  bottom: 10,
                  width: 10,
                  height: 24,
                  borderRadius: 5,
                  backgroundColor: '#62605B',
                }}
              />
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
              <div style={{height: 4, backgroundColor: '#9E9B94'}} />
              <div style={{height: 4, width: '75%', backgroundColor: '#9E9B94'}} />
              <div style={{height: 4, width: '88%', backgroundColor: '#9E9B94'}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
