import {COLORS} from './theme';

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export const SUBTITLE_CUES: SubtitleCue[] = [
  {start: 0, end: 210, text: '我通常不会给Omni模型直接写提示词'},
  {start: 210, end: 372, text: '而是反复和 Gemini 对话'},
  {start: 372, end: 516, text: '产生一套视频生成提示词'},
  {start: 516, end: 684, text: '例如我会从不同的角度进行约束'},
  {start: 684, end: 840, text: '例如世界观和故事背景层面'},
  {start: 840, end: 960, text: '这条片子的时间跨度'},
  {start: 960, end: 1152, text: '每个镜头都有哪些特殊的时代背景'},
  {start: 1152, end: 1250, text: '不同的镜头分别应用'},
  {start: 1250, end: 1344, text: '什么样的画面风格'},
  {start: 1344, end: 1445, text: '同时剪辑节奏和声音'},
  {start: 1445, end: 1536, text: '设计也会一同定义'},
  {start: 1536, end: 1670, text: '跨模态的约束往往能让AI'},
  {start: 1670, end: 1812, text: '产出不同于平均水平的内容'},
  {start: 1812, end: 1960, text: '在内容不再稀缺的今天'},
  {start: 1960, end: 2100, text: '足够多的约束意味着独特性'},
  {start: 2100, end: 2292, text: '也能让一条视频脱颖而出'},
];

export type ConstraintKey = 'world' | 'time' | 'era' | 'style' | 'rhythm';

export interface ConstraintMeta {
  key: ConstraintKey;
  label: string;
  color: string;
  checkFrame: number;
  popFrame: number;
  reappearFrame: number;
}

export const CONSTRAINTS: ConstraintMeta[] = [
  {
    key: 'world',
    label: '世界观·故事',
    color: COLORS.cWorld,
    popFrame: 572,
    checkFrame: 1416,
    reappearFrame: 1995,
  },
  {
    key: 'time',
    label: '时间跨度',
    color: COLORS.cTime,
    popFrame: 586,
    checkFrame: 1435,
    reappearFrame: 2013,
  },
  {
    key: 'era',
    label: '时代背景',
    color: COLORS.cEra,
    popFrame: 600,
    checkFrame: 1454,
    reappearFrame: 2031,
  },
  {
    key: 'style',
    label: '画面风格',
    color: COLORS.cStyle,
    popFrame: 614,
    checkFrame: 1473,
    reappearFrame: 2049,
  },
  {
    key: 'rhythm',
    label: '节奏·声音',
    color: COLORS.cRhythm,
    popFrame: 628,
    checkFrame: 1492,
    reappearFrame: 2067,
  },
];

// 核心节拍帧表（60fps）
export const BEATS = {
  // 序幕：OMNI 单提示词失败
  cardInsertStart: 56,
  cardInsertEnd: 88,
  crankStart: 88,
  crankEnd: 136,
  photoEjectStart: 136,
  photoEjectEnd: 158,
  stampImpact: 165,
  scene1FadeOut: 205,

  // 第一幕：我 vs Gemini 对话 & 书本合拢
  scene2Start: 205,
  bubble1: 234, // 绿-世界观 (我)
  bubble2: 261, // 黄-时间 (Gemini)
  bubble3: 288, // 红-时代 (我)
  bubble4: 315, // 蓝-风格 (Gemini)
  bubble5: 342, // 紫-节奏 (我)
  pagesStackStart: 376,
  bookCloseStart: 425,
  bookCloseEnd: 460,
  goldSheenStart: 462,
  goldSheenEnd: 510,

  // 第二幕：立体书 90° 展卷与五维约束建构
  bookOpenStart: 518,
  bookOpenEnd: 568,
  seasidePopup: 684,
  lighthouseGlow: 730,
  girlPopup: 768,
  girlSlideRight: 862,
  accordionStart: 848,
  accordionEnd: 942,

  // 时代背景：4 个微缩纸艺立牌依次弹出
  propTrain: 972,
  propRocket: 1014,
  propComputer: 1056,
  propDrone: 1098,

  // 画面风格：4 风格流畅扫色
  styleSilhouette: 1170,
  styleHalftone: 1212,
  stylePixel: 1254,
  styleNeon: 1296,

  // 节奏与声音
  gramophonePopup: 1352,
  flagPopup: 1368,

  // 第三幕：左右对比（平均水平 ≠ 立体书）
  compareShiftStart: 1536,
  compareShiftEnd: 1595,
  avgTagPopup: 1620,
  notEqualImpact: 1680,

  // 第四幕：内容泛滥纸片风暴 -> 约束破茧而出
  stormStart: 1812,
  bookTempCloseStart: 1818,
  bookTempCloseEnd: 1860,
  stormPeak: 1965,
  finaleBurst: 2100,
  finaleSettle: 2165,
} as const;
