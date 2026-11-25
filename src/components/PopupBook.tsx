import React from 'react';
import {BEATS, CONSTRAINTS, ConstraintKey} from '../timeline';
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
import {SeasideBackdrop} from './SeasideBackdrop';
import {StoryboardAccordion} from './StoryboardAccordion';
import {PropsAndAudio} from './PropsAndAudio';

interface PopupBookProps {
  frame: number;
}

const ConstraintIcon: React.FC<{type: ConstraintKey; color: string}> = ({
  type,
  color,
}) => {
  switch (type) {
    case 'world':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4.5" ry="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'time':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="4" x2="18" y2="4" />
          <line x1="6" y1="20" x2="18" y2="20" />
          <path d="M7 4 L17 20 M17 4 L7 20" />
        </svg>
      );
    case 'era':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <line x1="4" y1="11" x2="20" y2="11" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      );
    case 'style':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <path d="M5 18 L16 4 L20 7 L9 20 Z" fill={color} fillOpacity="0.16" />
        </svg>
      );
    case 'rhythm':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <path d="M10 17 V5 L18 3 V14" />
          <circle cx="8" cy="17.5" r="2.5" fill={color} />
          <circle cx="16" cy="14.5" r="2.5" fill={color} />
        </svg>
      );
  }
};

const PAGE_COLORS = [
  COLORS.cWorld,
  COLORS.cTime,
  COLORS.cEra,
  COLORS.cStyle,
  COLORS.cRhythm,
];

export const PopupBook: React.FC<PopupBookProps> = ({frame}) => {
  if (frame < BEATS.scene2Start) return null;

  const enterOp = smoothProgress(frame, BEATS.scene2Start, BEATS.scene2Start + 20);

  // 第三幕对比：书本右移缩小，第四幕风暴中回正至舞台中央并爆发盛放
  const shiftRightT = easeInOutCubic(
    smoothProgress(frame, BEATS.compareShiftStart, BEATS.compareShiftEnd),
  );
  const recenterT = easeInOutCubic(
    smoothProgress(frame, BEATS.stormStart + 10, BEATS.stormStart + 95),
  );
  const bookCenterX = lerp(960, 1270, shiftRightT * (1 - recenterT));
  const bookScale = lerp(1.0, 0.78, shiftRightT * (1 - recenterT));

  // 书本开合状态机：
  // 1) 205..425: 平铺底页
  // 2) 425..460: 合上深海蓝烫金封面
  // 3) 518..568: 90° 展卷
  // 4) 1818..1860: 风暴来袭暂合封面
  // 5) 2100..2165: 破茧而出盛大绽放
  const close1 = easeInOutCubic(
    smoothProgress(frame, BEATS.bookCloseStart, BEATS.bookCloseEnd),
  );
  const open1 = easeOutExpo(
    smoothProgress(frame, BEATS.bookOpenStart, BEATS.bookOpenEnd),
  );
  const close2 = easeInOutCubic(
    smoothProgress(frame, BEATS.bookTempCloseStart, BEATS.bookTempCloseEnd),
  );
  const open2 = easeOutExpo(
    smoothProgress(frame, BEATS.finaleBurst, BEATS.finaleSettle),
  );

  // 封面开启进度：0 = 完全平合在底座上；1 = 竖直 90° 立起背板
  const isClosedPhase = frame >= BEATS.bookCloseStart && frame < BEATS.bookOpenStart;
  const coverOpenAmt =
    frame < BEATS.bookCloseStart
      ? 0
      : isClosedPhase
        ? 1 - close1
        : frame < BEATS.bookTempCloseStart
          ? open1
          : clamp(1 - close2 + open2 * close2);

  // 平铺底板显隐（未合书前展示两页打开状态）
  const flatTopVisible = frame < BEATS.bookCloseEnd;
  const flatTopFold = close1;

  // 烫金高光扫过封面
  const sheenT = smoothProgress(frame, BEATS.goldSheenStart, BEATS.goldSheenEnd);
  const showClosedCover =
    (frame >= BEATS.bookCloseStart + 12 && frame < BEATS.bookOpenStart + 14) ||
    (frame >= BEATS.bookTempCloseStart + 12 && frame < BEATS.finaleBurst + 18);
  const closedCoverOpacity =
    frame < BEATS.bookOpenStart + 14
      ? smoothProgress(frame, BEATS.bookCloseStart + 12, BEATS.bookCloseEnd) *
        (1 - smoothProgress(frame, BEATS.bookOpenStart, BEATS.bookOpenStart + 14))
      : smoothProgress(frame, BEATS.bookTempCloseStart + 12, BEATS.bookTempCloseEnd) *
        (1 - smoothProgress(frame, BEATS.finaleBurst, BEATS.finaleBurst + 16));

  // 竖立背板显隐
  const uprightHeight = lerp(0, 415, coverOpenAmt);

  // 5 张彩页飞叠（376..430）
  const showColorPages = frame >= BEATS.pagesStackStart && frame < BEATS.bookCloseEnd;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterOp,
        pointerEvents: 'none',
      }}
    >
      {/* 统一书本坐标系容器：所有书内元素随书本平移/缩放同步联动 */}
      <div
        style={{
          position: 'absolute',
          left: bookCenterX,
          top: 0,
          width: 1920,
          height: 1080,
          transform: `translateX(-50%) scale(${bookScale})`,
          transformOrigin: '50% 560px',
        }}
      >
        {/* 书本桌面投影 */}
        <div
          style={{
            position: 'absolute',
            left: 410,
            top: 465,
            width: 1120,
            height: 295,
            borderRadius: 16,
            background:
              'radial-gradient(ellipse, rgba(8,4,1,0.72) 0%, rgba(8,4,1,0.34) 68%, transparent 86%)',
          }}
        />

        {/* 1. 书本平铺上半页（仅在第一次合拢前出现） */}
        {flatTopVisible && (
          <div
            style={{
              position: 'absolute',
              left: 440,
              top: lerp(290, 480, flatTopFold),
              width: 1040,
              height: lerp(200, 12, flatTopFold),
              backgroundColor: COLORS.bookNavy,
              borderRadius: '4px 4px 0 0',
              padding: '10px 14px 4px',
              boxSizing: 'border-box',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.paperCream,
                boxShadow: 'inset 0 -8px 18px rgba(0,0,0,0.08)',
              }}
            />
          </div>
        )}

        {/* 2. 竖立立体书背板（深海蓝边框 + SeasideBackdrop） */}
        {uprightHeight > 8 && (
          <div
            style={{
              position: 'absolute',
              left: 440,
              top: 492 - uprightHeight,
              width: 1040,
              height: uprightHeight,
              backgroundColor: COLORS.bookNavy,
              borderRadius: '5px 5px 0 0',
              padding: '12px 14px 0',
              boxSizing: 'border-box',
              boxShadow: '0 -12px 30px rgba(0,0,0,0.5), 26px 12px 34px rgba(0,0,0,0.45)',
              overflow: 'hidden',
              zIndex: 4,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.paperCream,
                overflow: 'hidden',
              }}
            >
              <SeasideBackdrop frame={frame} width={1012} height={403} />
            </div>
          </div>
        )}

        {/* 3. 书本下底页（米白硬卡纸舞台底座） */}
        <div
          style={{
            position: 'absolute',
            left: 440,
            top: 492,
            width: 1040,
            height: 242,
            backgroundColor: COLORS.bookNavy,
            borderRadius: '0 0 6px 6px',
            padding: '4px 14px 14px',
            boxSizing: 'border-box',
            boxShadow: '0 18px 34px rgba(0,0,0,0.58)',
            transform: 'perspective(900px) rotateX(14deg)',
            transformOrigin: 'top center',
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, #E8DEC8 0%, ${COLORS.paperWarm} 25%, ${COLORS.paperCream} 100%)`,
              boxShadow: 'inset 0 12px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {/* 书脊中缝压痕 */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 6,
                background: 'linear-gradient(180deg, rgba(11,53,83,0.45), transparent)',
              }}
            />
          </div>
        </div>

        {/* 4. 五页彩色卡纸叠放动画（376..460） */}
        {showColorPages &&
          PAGE_COLORS.map((col, idx) => {
            const dropT = easeOutExpo(
              smoothProgress(
                frame,
                BEATS.pagesStackStart + idx * 8,
                BEATS.pagesStackStart + idx * 8 + 20,
              ),
            );
            if (dropT <= 0.01) return null;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: 454,
                  top: 496 + idx * 4 - (1 - dropT) * 160,
                  width: 1012,
                  height: 215 - idx * 6,
                  backgroundColor: col,
                  opacity: dropT * (1 - close1),
                  boxShadow: '0 6px 14px rgba(0,0,0,0.28)',
                  transform: 'perspective(900px) rotateX(14deg)',
                  transformOrigin: 'top center',
                  zIndex: 7 + idx,
                }}
              />
            );
          })}

        {/* 5. 底部 5 枚书签条 -> 立体翻起的 5 张约束立牌 */}
        {CONSTRAINTS.map((c, idx) => {
          const xPos = 550 + idx * 205;
          const bookmarkPop = smoothSpring(
            frame,
            BEATS.pagesStackStart + 28 + idx * 5,
            {damping: 14, stiffness: 180},
          );
          // 第一次展卷翻起为立体卡片
          const cardPop1 = smoothSpring(frame, c.popFrame, {damping: 12, stiffness: 170});
          // 风暴来袭暂合，随后 5 张立牌穿透废片堆重新闪耀立起！
          const hideInStorm = smoothProgress(
            frame,
            BEATS.bookTempCloseStart,
            BEATS.bookTempCloseEnd,
          );
          const reappearPop = smoothSpring(frame, c.reappearFrame, {
            damping: 12,
            stiffness: 185,
          });
          const cardActive = clamp(cardPop1 * (1 - hideInStorm) + reappearPop * hideInStorm);

          const checkPop1 = smoothSpring(frame, c.checkFrame, {damping: 11, stiffness: 220});
          const checkVisible =
            frame >= BEATS.bookTempCloseStart ? reappearPop : checkPop1;

          if (bookmarkPop <= 0.01 && cardActive <= 0.01) return null;

          return (
            <div
              key={c.key}
              style={{
                position: 'absolute',
                left: xPos,
                top: 735,
                transform: 'translateX(-50%)',
                zIndex: frame >= c.reappearFrame ? 32 : 24,
              }}
            >
              {/* 底部彩色书签条 */}
              <div
                style={{
                  position: 'absolute',
                  left: -26,
                  top: -12,
                  width: 52,
                  height: 36 * clamp(bookmarkPop),
                  backgroundColor: c.color,
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.45)',
                }}
              />

              {/* 立体翻起的约束小立牌 */}
              {cardActive > 0.02 && (
                <div
                  style={{
                    position: 'relative',
                    width: 176,
                    height: 66,
                    backgroundColor: COLORS.paperWarm,
                    borderTop: `5px solid ${c.color}`,
                    borderRadius: 3,
                    boxShadow:
                      '0 12px 22px rgba(0,0,0,0.52), inset 0 0 0 1px #D9CEB8',
                    transform: `translateY(${lerp(24, -18, cardActive)}px) scale(${cardActive}) rotate(${(idx - 2) * 1.4}deg)`,
                    transformOrigin: 'bottom center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '0 10px',
                    boxSizing: 'border-box',
                  }}
                >
                  <ConstraintIcon type={c.key} color={c.color} />
                  <span
                    style={{
                      fontFamily: FONTS.serif,
                      fontSize: 20,
                      fontWeight: 700,
                      color: c.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.label}
                  </span>

                  {/* 右上角鲜红立体对勾 ✓ */}
                  {checkVisible > 0.02 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -10,
                        top: -16,
                        transform: `scale(${checkVisible}) rotate(6deg)`,
                        filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.42))',
                      }}
                    >
                      <svg width="34" height="32" viewBox="0 0 34 32">
                        <path
                          d="M4 17 L13 26 L30 6"
                          fill="none"
                          stroke={COLORS.paperWarm}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 17 L13 26 L30 6"
                          fill="none"
                          stroke={COLORS.alertRed}
                          strokeWidth="4.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 6. 精装深海蓝烫金封面（合拢态与暂合态呈现） */}
        {showClosedCover && closedCoverOpacity > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: 440,
              top: 492,
              width: 1040,
              height: 242,
              background: `linear-gradient(180deg, ${COLORS.bookNavy} 0%, ${COLORS.bookNavyDark} 100%)`,
              borderRadius: 6,
              boxShadow:
                '0 18px 34px rgba(0,0,0,0.62), inset 0 2px 0 rgba(255,255,255,0.16)',
              transform: 'perspective(900px) rotateX(14deg)',
              transformOrigin: 'top center',
              opacity: closedCoverOpacity,
              zIndex: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* 双层烫金线框 */}
            <div
              style={{
                position: 'absolute',
                inset: 16,
                border: `2px solid ${COLORS.bookGold}`,
                borderRadius: 3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 22,
                border: `1px solid rgba(232, 184, 75, 0.55)`,
                borderRadius: 2,
              }}
            />

            <div style={{textAlign: 'center', zIndex: 2}}>
              <div
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 58,
                  fontWeight: 800,
                  letterSpacing: '0.26em',
                  color: COLORS.bookGold,
                  textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                  paddingLeft: '0.26em',
                }}
              >
                视频生成提示词
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 22,
                  marginTop: 18,
                }}
              >
                {PAGE_COLORS.map((col, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      backgroundColor: col,
                      boxShadow: '0 0 6px rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 烫金流光高光带 */}
            {sheenT > 0 && sheenT < 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  bottom: -40,
                  left: `${lerp(-25, 125, sheenT)}%`,
                  width: 130,
                  transform: 'skewX(-24deg)',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,236,168,0.42), transparent)',
                  zIndex: 3,
                }}
              />
            )}
          </div>
        )}

        {/* 7. 书内手风琴 4 联胶片与 4 大微缩道具 */}
        <StoryboardAccordion frame={frame} />

        {/* 8. 书内纸艺小道具（黄雨衣小女孩、紫色留声机声波、红白三角旗） */}
        <PropsAndAudio frame={frame} />
      </div>
    </div>
  );
};
