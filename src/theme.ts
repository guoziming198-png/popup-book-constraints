import {Easing, spring} from 'remotion';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 60;
export const DURATION_IN_FRAMES = 2292; // 38.2s @ 60fps

export const COLORS = {
  // 胡桃木桌面与光影
  woodDark: '#26180B',
  woodMid: '#3F2915',
  woodWarm: '#5D3E1F',
  woodHighlight: '#7C542B',

  // 书本与纸艺材质
  bookNavy: '#0B3553',
  bookNavyDark: '#07243A',
  bookGold: '#E8B84B',
  bookGoldBright: '#FFD97D',
  paperCream: '#EFE4CD',
  paperWhite: '#F7F1E3',
  paperWarm: '#FAF4E8',
  paperEdge: '#D8CCB4',
  paperGray: '#C8C5BE',
  paperGrayDark: '#8E8B84',

  // OMNI 机器
  omniBody: '#8E8B83',
  omniTop: '#ACA99F',
  omniSide: '#64615B',
  omniInk: '#1A1916',
  crankGold: '#D9A630',
  crankRed: '#C83B28',

  // 五大约束主题色
  cWorld: '#0D7A67',
  cTime: '#D89014',
  cEra: '#D94226',
  cStyle: '#1D569E',
  cRhythm: '#7D2F73',

  // 夜景与海景剪纸
  skyNightTop: '#072A2E',
  skyNightMid: '#0F4649',
  skyNightLow: '#1D6362',
  horizonGlow: '#DF9E63',
  moonCream: '#ECE3C8',
  moonCrater: '#DCD0B0',
  mountainBack: '#3C6565',
  mountainFront: '#284B4D',
  seaDeep: '#0B3A4C',
  seaWave: '#155D63',
  seaFoam: '#79B6AA',
  sandWarm: '#C69D63',
  grassGreen: '#4E8E3E',
  cliffDark: '#25170D',
  lighthouseRed: '#C93A2B',
  lighthouseWhite: '#F4EDE0',
  beamYellow: '#FCE99F',

  // 强调色与字幕
  alertRed: '#D93626',
  alertRedDark: '#9A2117',
  raincoatYellow: '#ECC22B',
  raincoatRed: '#C83424',
  subtitleBg: '#F6F1E5',
  subtitleInk: '#1E1A16',
} as const;

export const FONTS = {
  sans: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif',
  serif: '"STSong", "SimSun", "Noto Serif SC", Georgia, serif',
  hand: '"STKaiti", "KaiTi", "FZSTK", cursive',
  mono: '"Consolas", "Courier New", monospace',
} as const;

export const clamp = (v: number, lo = 0, hi = 1): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothProgress = (frame: number, start: number, end: number): number =>
  clamp((frame - start) / Math.max(1, end - start), 0, 1);

export const easeOutExpo = (t: number): number => {
  const x = clamp(t);
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export const easeInOutCubic = Easing.inOut(Easing.cubic);
export const easeOutCubic = Easing.out(Easing.cubic);

export function smoothSpring(
  frame: number,
  startFrame: number,
  config: {damping?: number; stiffness?: number; mass?: number} = {},
): number {
  if (frame < startFrame) return 0;
  return spring({
    frame: frame - startFrame,
    fps: FPS,
    config: {
      damping: config.damping ?? 14,
      stiffness: config.stiffness ?? 150,
      mass: config.mass ?? 0.9,
    },
  });
}
