import React from 'react';
import {BEATS} from '../timeline';
import {
  COLORS,
  FONTS,
  clamp,
  easeInOutCubic,
  easeOutExpo,
  lerp,
  smoothProgress,
  smoothSpring,
} from '../theme';

interface OmniMachineProps {
  frame: number;
}

export const OmniMachine: React.FC<OmniMachineProps> = ({frame}) => {
  // 序幕在 0..215 居中出现，215..235 优雅淡出，1536 起在左侧回归对比！
  const isIntro = frame < 235;
  const isCompare = frame >= BEATS.compareShiftStart;
  if (!isIntro && !isCompare) return null;

  const introFadeOut = isIntro ? 1 - smoothProgress(frame, 200, 228) : 0;
  const compareIn = isCompare
    ? easeOutExpo(smoothProgress(frame, BEATS.compareShiftStart, BEATS.compareShiftEnd))
    : 0;

  // 在内容风暴阶段（1812起），OMNI 机位稍向左退让且摇晃吐卡
  const stormRecoil =
    frame >= BEATS.stormStart && frame < BEATS.finaleBurst
      ? Math.sin((frame - BEATS.stormStart) * 0.42) *
        4 *
        (1 - smoothProgress(frame, 2060, BEATS.finaleBurst))
      : 0;

  const finaleFade = isCompare ? 1 - smoothProgress(frame, 1940, 2000) : 1;
  const leaveT = isCompare ? easeInOutCubic(smoothProgress(frame, 1940, 2005)) : 0;
  const opacity = isIntro ? introFadeOut : compareIn * finaleFade;
  if (opacity <= 0.005) return null;

  const centerX = isIntro ? 960 : lerp(lerp(180, 365, compareIn), 120, leaveT);
  const centerY = isIntro ? 495 : 535;
  const boxScale = isIntro ? 1.12 : 0.85;

  // 手写卡片滑入 OMNI 顶槽动作（序幕）
  const cardInT = easeInOutCubic(
    smoothProgress(frame, BEATS.cardInsertStart, BEATS.cardInsertEnd),
  );
  const cardX = lerp(265, 0, cardInT);
  const cardY =
    cardInT < 0.55
      ? lerp(195, -245, cardInT / 0.55)
      : lerp(-245, -125, (cardInT - 0.55) / 0.45);
  const cardRotate = lerp(-6, 0, cardInT);
  const cardClipBottom = cardInT > 0.55 ? ((cardInT - 0.55) / 0.45) * 100 : 0;
  const cardVisible = isIntro && cardInT < 0.98;

  // 曲柄持续丝滑旋转（1.4s-2.25s 狂转 + 风暴阶段狂吐转）
  const introCrankAngle =
    frame >= BEATS.crankStart && frame <= BEATS.crankEnd
      ? ((frame - BEATS.crankStart) / (BEATS.crankEnd - BEATS.crankStart)) * 720
      : frame > BEATS.crankEnd && isIntro
        ? 720
        : 0;
  const stormCrankAngle =
    frame >= BEATS.stormStart && frame < BEATS.finaleBurst
      ? (frame - BEATS.stormStart) * 16
      : 0;
  const crankDeg = isIntro ? introCrankAngle : stormCrankAngle;

  // 底部出片口吐出灰暗平庸照片
  const ejectT = isIntro
    ? easeOutExpo(smoothProgress(frame, BEATS.photoEjectStart, BEATS.photoEjectEnd))
    : 1;
  const photoY = lerp(110, 215, ejectT);
  const photoOpacity = isIntro
    ? smoothProgress(frame, BEATS.photoEjectStart, BEATS.photoEjectStart + 6)
    : 1;

  // 木印章重砸与红叉显现
  const stampProgress = isIntro
    ? smoothProgress(frame, BEATS.stampImpact - 14, BEATS.stampImpact)
    : 0;
  const stampLift = isIntro
    ? smoothProgress(frame, BEATS.stampImpact + 12, BEATS.stampImpact + 26)
    : 1;
  const stampActive = isIntro && frame >= BEATS.stampImpact - 14 && stampLift < 1;
  const stampY = lerp(-240, 145, easeOutExpo(stampProgress)) - stampLift * 280;
  const stampScale = lerp(1.35, 1.0, stampProgress);
  const redCrossPop =
    (isIntro && frame >= BEATS.stampImpact) || isCompare
      ? isIntro
        ? smoothSpring(frame, BEATS.stampImpact, {damping: 12, stiffness: 220})
        : 1
      : 0;

  // 第三幕“• 平均水平”立牌弹出
  const avgTagPop = isCompare
    ? smoothSpring(frame, BEATS.avgTagPopup, {damping: 13, stiffness: 180})
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: centerX + stormRecoil,
        top: centerY,
        transform: `translate(-50%, -50%) scale(${boxScale})`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {/* 地面投影 */}
      <div
        style={{
          position: 'absolute',
          left: -210,
          top: 90,
          width: 470,
          height: 150,
          borderRadius: 24,
          background:
            'radial-gradient(ellipse, rgba(8,4,1,0.72) 0%, rgba(8,4,1,0.35) 55%, transparent 78%)',
          transform: 'skewX(-18deg)',
        }}
      />

      {/* 手写提示词卡（从右下角丝滑弧线飞入顶部槽） */}
      {cardVisible && (
        <div
          style={{
            position: 'absolute',
            left: cardX - 140,
            top: cardY - 88,
            width: 280,
            height: 176,
            backgroundColor: COLORS.paperCream,
            borderRadius: 4,
            boxShadow: '0 14px 30px rgba(0,0,0,0.52), inset 0 0 0 1px #D5C8AE',
            transform: `rotate(${cardRotate}deg)`,
            padding: '18px 20px',
            boxSizing: 'border-box',
            clipPath: `inset(0 0 ${cardClipBottom}% 0)`,
            zIndex: cardInT > 0.55 ? 2 : 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 15,
              color: '#7A7060',
              borderBottom: '1px solid #CBBFA7',
              paddingBottom: 6,
              marginBottom: 20,
            }}
          >
            一句话提示词
          </div>
          <div
            style={{
              fontFamily: FONTS.hand,
              fontSize: 25,
              fontWeight: 700,
              color: '#1C1814',
              textAlign: 'center',
              borderBottom: '1.5px solid #595045',
              paddingBottom: 8,
              whiteSpace: 'nowrap',
            }}
          >
            海边，女孩，电影感
          </div>
        </div>
      )}

      {/* OMNI 3D 立体纸盒主体 */}
      <div style={{position: 'relative', width: 390, height: 270, zIndex: 4}}>
        {/* 顶面（带透视斜切） */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: -54,
            width: 390,
            height: 62,
            background: `linear-gradient(180deg, #BDB9AF 0%, ${COLORS.omniTop} 100%)`,
            transform: 'skewX(-36deg)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 275,
              height: 12,
              backgroundColor: '#12110F',
              borderRadius: 2,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
            }}
          />
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 13,
              letterSpacing: '0.28em',
              color: '#2B2822',
              marginTop: 5,
              fontWeight: 700,
            }}
          >
            PROMPT IN
          </div>
        </div>

        {/* 右侧面 + 机械表盘 + 手摇曲柄 */}
        <div
          style={{
            position: 'absolute',
            left: 390,
            top: -27,
            width: 52,
            height: 270,
            background: `linear-gradient(90deg, ${COLORS.omniSide} 0%, #48453F 100%)`,
            transform: 'skewY(-46deg)',
            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.12)',
          }}
        >
          {/* 机械小表盘 */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 28,
              width: 28,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#EDE7DA',
              border: '2px solid #2C2924',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 2,
                height: 16,
                backgroundColor: COLORS.alertRed,
                transformOrigin: 'bottom center',
                transform: `translateY(-5px) rotate(${crankDeg * 0.5}deg)`,
              }}
            />
          </div>
        </div>

        {/* 右侧金属手摇曲柄（丝滑 60fps 旋转） */}
        <div
          style={{
            position: 'absolute',
            left: 416,
            top: 98,
            zIndex: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 10,
              backgroundColor: COLORS.crankGold,
              borderRadius: 3,
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 4,
              width: 8,
              height: 52,
              backgroundColor: COLORS.crankGold,
              borderRadius: 4,
              transformOrigin: 'top center',
              transform: `rotate(${Math.sin((crankDeg * Math.PI) / 180) * 58}deg) scaleY(${0.45 + 0.55 * Math.abs(Math.cos((crankDeg * Math.PI) / 180))})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -3,
                bottom: -10,
                width: 22,
                height: 12,
                borderRadius: 4,
                backgroundColor: COLORS.crankRed,
                boxShadow: '0 2px 5px rgba(0,0,0,0.45)',
              }}
            />
          </div>
        </div>

        {/* 正面盒子主体 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, #9B988F 0%, ${COLORS.omniBody} 65%, #7C7971 100%)`,
            boxShadow:
              'inset 0 2px 0 rgba(255,255,255,0.22), inset 0 -4px 10px rgba(0,0,0,0.28), 0 12px 26px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 12,
          }}
        >
          {/* 四角铆钉 */}
          {[
            {left: 16, top: 16},
            {right: 16, top: 16},
            {left: 16, bottom: 16},
            {right: 16, bottom: 16},
          ].map((pos, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#56534D',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
                ...pos,
              }}
            />
          ))}

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: COLORS.omniInk,
              lineHeight: 1,
            }}
          >
            OMNI
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.26em',
              color: '#2B2823',
              marginTop: 10,
              fontWeight: 700,
            }}
          >
            AI VIDEO MODEL
          </div>

          {/* 底部出片黑色长槽 */}
          <div
            style={{
              width: 280,
              height: 18,
              backgroundColor: '#12110F',
              borderRadius: 2,
              marginTop: 28,
              boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9)',
            }}
          />
        </div>
      </div>

      {/* 出片口滑出的灰暗平庸样片 + 鲜红圆圈叉 */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: photoY,
          width: 246,
          height: 122,
          backgroundColor: '#D6D2C9',
          borderRadius: 3,
          padding: 12,
          boxSizing: 'border-box',
          boxShadow: '0 8px 20px rgba(0,0,0,0.52)',
          transform: 'perspective(500px) rotateX(28deg)',
          opacity: photoOpacity,
          zIndex: 6,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 112,
            height: 92,
            background: 'linear-gradient(180deg, #9C9B96 0%, #6D6C67 60%, #8A877F 100%)',
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* 模糊孤独剪影 */}
          <div
            style={{
              position: 'absolute',
              left: 48,
              bottom: 14,
              width: 14,
              height: 36,
              borderRadius: 7,
              backgroundColor: '#484744',
              opacity: 0.75,
            }}
          />
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{height: 6, backgroundColor: '#ACA89E', borderRadius: 2}} />
          <div style={{height: 6, width: '78%', backgroundColor: '#ACA89E', borderRadius: 2}} />
          <div style={{height: 6, width: '90%', backgroundColor: '#ACA89E', borderRadius: 2}} />
        </div>

        {/* 鲜红圆圈叉 ⊗ */}
        {redCrossPop > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 26,
              top: 22,
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: `7px solid ${COLORS.alertRed}`,
              transform: `scale(${redCrossPop}) rotate(-10deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(217,54,38,0.35)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 44,
                height: 7,
                backgroundColor: COLORS.alertRed,
                borderRadius: 4,
                transform: 'rotate(45deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 44,
                height: 7,
                backgroundColor: COLORS.alertRed,
                borderRadius: 4,
                transform: 'rotate(-45deg)',
              }}
            />
          </div>
        )}
      </div>

      {/* 立体木印章砸下 */}
      {stampActive && (
        <div
          style={{
            position: 'absolute',
            left: 132,
            top: stampY,
            width: 120,
            height: 135,
            transform: `scale(${stampScale})`,
            zIndex: 14,
            pointerEvents: 'none',
          }}
        >
          {/* 木球握把 */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              margin: '0 auto',
              background: 'radial-gradient(circle at 35% 30%, #E0A24C 0%, #9E631F 75%, #6A3F0D 100%)',
              boxShadow: '0 6px 10px rgba(0,0,0,0.45)',
            }}
          />
          <div
            style={{
              width: 24,
              height: 36,
              margin: '-6px auto 0',
              background: 'linear-gradient(90deg, #9C621E 0%, #D49442 50%, #865014 100%)',
            }}
          />
          <div
            style={{
              width: 112,
              height: 34,
              margin: '-4px auto 0',
              background: 'linear-gradient(180deg, #D89844 0%, #A96E24 100%)',
              borderRadius: 4,
              boxShadow: '0 10px 18px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.28)',
            }}
          />
          <div
            style={{
              width: 108,
              height: 8,
              margin: '0 auto',
              backgroundColor: COLORS.alertRedDark,
              borderRadius: '0 0 3px 3px',
            }}
          />
        </div>
      )}

      {/* 第三幕对比：“• 平均水平” 纸质标签 */}
      {avgTagPop > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 170,
            width: 310,
            height: 82,
            backgroundColor: COLORS.paperWarm,
            borderRadius: 4,
            boxShadow: '0 10px 22px rgba(0,0,0,0.48), inset 0 0 0 1px #D8CCB4',
            transform: `scale(${avgTagPop}) rotate(-1deg)`,
            transformOrigin: 'center bottom',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            clipPath: 'polygon(6% 0%, 100% 2%, 98% 98%, 5% 96%, 0% 50%)',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#564E43',
            }}
          />
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 42,
              fontWeight: 700,
              color: '#1E1A15',
              letterSpacing: '0.08em',
            }}
          >
            平均水平
          </div>
        </div>
      )}
    </div>
  );
};
