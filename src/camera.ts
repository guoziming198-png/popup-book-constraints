import {Easing} from 'remotion';
import {lerp} from './theme';

export interface CameraState {
  focusX: number;
  focusY: number;
  scale: number;
  rotateDeg: number;
  tiltXDeg: number;
  shakeX: number;
  shakeY: number;
  spotX: number;
  spotY: number;
  spotIntensity: number;
}

interface CameraWaypoint {
  frame: number;
  focusX: number;
  focusY: number;
  scale: number;
  rotateDeg: number;
  tiltXDeg: number;
  spotX: number;
  spotY: number;
  spotIntensity: number;
}

// 电影感导演机位轨迹（60fps, 0..2292）
// 高频使用微距特写（最高 2.08x）、乒乓摇镜、轨道横移、荷兰角与冲击拉远
const WAYPOINTS: CameraWaypoint[] = [
  // 序幕：微距吸睛特写右下角手写提示词卡 "海边，女孩，电影感"
  {frame: 0, focusX: 1210, focusY: 685, scale: 1.94, rotateDeg: -1.8, tiltXDeg: 2.0, spotX: 1180, spotY: 670, spotIntensity: 1.0},
  {frame: 52, focusX: 1185, focusY: 670, scale: 1.88, rotateDeg: -1.4, tiltXDeg: 1.6, spotX: 1160, spotY: 650, spotIntensity: 1.0},

  // 跟拍卡片飞入 OMNI 顶部 PROMPT IN 槽
  {frame: 84, focusX: 960, focusY: 390, scale: 1.64, rotateDeg: 0.4, tiltXDeg: 1.0, spotX: 960, spotY: 420, spotIntensity: 1.05},

  // 迅速右推：极特写黄色手摇曲柄狂转与表盘
  {frame: 118, focusX: 1215, focusY: 455, scale: 2.05, rotateDeg: 1.5, tiltXDeg: 1.5, spotX: 1160, spotY: 460, spotIntensity: 1.1},
  {frame: 138, focusX: 1200, focusY: 470, scale: 1.96, rotateDeg: 1.2, tiltXDeg: 1.2, spotX: 1140, spotY: 470, spotIntensity: 1.05},

  // 下摇紧盯出片槽与木印章重砸红叉
  {frame: 162, focusX: 955, focusY: 685, scale: 1.92, rotateDeg: -0.9, tiltXDeg: 0.8, spotX: 955, spotY: 640, spotIntensity: 1.1},
  {frame: 202, focusX: 955, focusY: 675, scale: 1.84, rotateDeg: -0.6, tiltXDeg: 0.5, spotX: 955, spotY: 630, spotIntensity: 1.0},

  // 转场进入：我 vs Gemini 对话舞台
  {frame: 228, focusX: 960, focusY: 540, scale: 1.08, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 500, spotIntensity: 1.0},

  // 乒乓特写摇镜：左“我” -> 右“Gemini” -> 左“我”
  {frame: 252, focusX: 830, focusY: 530, scale: 1.24, rotateDeg: -1.1, tiltXDeg: 0.8, spotX: 740, spotY: 510, spotIntensity: 1.05},
  {frame: 282, focusX: 1090, focusY: 525, scale: 1.24, rotateDeg: 1.1, tiltXDeg: 0.8, spotX: 1180, spotY: 510, spotIntensity: 1.05},
  {frame: 312, focusX: 840, focusY: 495, scale: 1.22, rotateDeg: -0.9, tiltXDeg: 0.6, spotX: 760, spotY: 490, spotIntensity: 1.05},
  {frame: 344, focusX: 1080, focusY: 490, scale: 1.22, rotateDeg: 0.9, tiltXDeg: 0.6, spotX: 1160, spotY: 490, spotIntensity: 1.05},
  {frame: 372, focusX: 960, focusY: 530, scale: 1.14, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 520, spotIntensity: 1.0},

  // 五页飞叠后推入烫金书封《视频生成提示词》微距特写
  {frame: 425, focusX: 960, focusY: 575, scale: 1.24, rotateDeg: 0, tiltXDeg: 1.0, spotX: 960, spotY: 560, spotIntensity: 1.05},
  {frame: 465, focusX: 960, focusY: 605, scale: 1.72, rotateDeg: -0.8, tiltXDeg: 2.2, spotX: 960, spotY: 590, spotIntensity: 1.18},
  {frame: 512, focusX: 960, focusY: 600, scale: 1.68, rotateDeg: 0.6, tiltXDeg: 2.0, spotX: 1020, spotY: 585, spotIntensity: 1.18},

  // 立体书 90° 展卷 + 低角度特写 5 张约束立牌弹起
  {frame: 558, focusX: 960, focusY: 530, scale: 1.15, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 480, spotIntensity: 1.05},
  {frame: 605, focusX: 960, focusY: 745, scale: 1.54, rotateDeg: 0, tiltXDeg: 1.5, spotX: 960, spotY: 730, spotIntensity: 1.12},
  {frame: 668, focusX: 960, focusY: 650, scale: 1.22, rotateDeg: 0, tiltXDeg: 0.6, spotX: 960, spotY: 560, spotIntensity: 1.05},

  // 海滨世界观巡礼：满月小屋特写 -> 红白灯塔体积光束特写 -> 黄雨衣小女孩特写
  {frame: 705, focusX: 735, focusY: 345, scale: 1.66, rotateDeg: -0.9, tiltXDeg: 0.5, spotX: 760, spotY: 340, spotIntensity: 1.1},
  {frame: 758, focusX: 1225, focusY: 325, scale: 1.78, rotateDeg: 1.0, tiltXDeg: 0.5, spotX: 1240, spotY: 310, spotIntensity: 1.15},
  {frame: 818, focusX: 1205, focusY: 575, scale: 1.68, rotateDeg: 0.4, tiltXDeg: 0.8, spotX: 1180, spotY: 550, spotIntensity: 1.1},

  // 拉远完整欣赏四联手风琴胶片弹开
  {frame: 855, focusX: 960, focusY: 545, scale: 1.20, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 510, spotIntensity: 1.05},
  {frame: 950, focusX: 960, focusY: 545, scale: 1.24, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 510, spotIntensity: 1.05},

  // 时代背景：微距轨道车逐格特写 1925火车 -> 1965火箭 -> 1995电脑 -> 2035无人机
  {frame: 985, focusX: 675, focusY: 560, scale: 1.92, rotateDeg: -1.1, tiltXDeg: 1.2, spotX: 675, spotY: 545, spotIntensity: 1.14},
  {frame: 1028, focusX: 865, focusY: 560, scale: 1.92, rotateDeg: -0.4, tiltXDeg: 1.2, spotX: 865, spotY: 545, spotIntensity: 1.14},
  {frame: 1070, focusX: 1055, focusY: 560, scale: 1.92, rotateDeg: 0.4, tiltXDeg: 1.2, spotX: 1055, spotY: 545, spotIntensity: 1.14},
  {frame: 1114, focusX: 1245, focusY: 560, scale: 1.92, rotateDeg: 1.1, tiltXDeg: 1.2, spotX: 1245, spotY: 545, spotIntensity: 1.14},
  {frame: 1152, focusX: 1210, focusY: 545, scale: 1.72, rotateDeg: 0.6, tiltXDeg: 0.8, spotX: 1180, spotY: 530, spotIntensity: 1.1},

  // 画面风格：四风格扫色连击特写（微调Y居中，留足底部字幕呼吸空间）
  {frame: 1180, focusX: 690, focusY: 465, scale: 1.70, rotateDeg: -0.9, tiltXDeg: 0.8, spotX: 690, spotY: 465, spotIntensity: 1.15},
  {frame: 1222, focusX: 875, focusY: 465, scale: 1.70, rotateDeg: -0.3, tiltXDeg: 0.8, spotX: 875, spotY: 465, spotIntensity: 1.15},
  {frame: 1264, focusX: 1060, focusY: 465, scale: 1.70, rotateDeg: 0.3, tiltXDeg: 0.8, spotX: 1060, spotY: 465, spotIntensity: 1.15},
  {frame: 1308, focusX: 1245, focusY: 465, scale: 1.70, rotateDeg: 0.9, tiltXDeg: 0.8, spotX: 1245, spotY: 465, spotIntensity: 1.15},

  // 节奏声音：先左推极特写紫色留声机与声波，后拉全景五红勾闪耀
  {frame: 1365, focusX: 550, focusY: 625, scale: 1.90, rotateDeg: -1.4, tiltXDeg: 1.2, spotX: 545, spotY: 600, spotIntensity: 1.16},
  {frame: 1410, focusX: 600, focusY: 610, scale: 1.74, rotateDeg: -0.8, tiltXDeg: 0.8, spotX: 590, spotY: 590, spotIntensity: 1.12},
  {frame: 1455, focusX: 960, focusY: 580, scale: 1.16, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 550, spotIntensity: 1.08},
  {frame: 1530, focusX: 960, focusY: 575, scale: 1.14, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 540, spotIntensity: 1.05},

  // 跨模态对比：先给左侧 OMNI 平均水平特写，再拉宽至完整左右对峙 + ≠ 重击推进
  {frame: 1568, focusX: 400, focusY: 540, scale: 1.54, rotateDeg: -1.2, tiltXDeg: 0.8, spotX: 400, spotY: 520, spotIntensity: 0.95},
  {frame: 1625, focusX: 930, focusY: 530, scale: 1.02, rotateDeg: 0, tiltXDeg: 0, spotX: 950, spotY: 510, spotIntensity: 1.02},
  {frame: 1678, focusX: 935, focusY: 535, scale: 1.0, rotateDeg: 0, tiltXDeg: 0, spotX: 940, spotY: 520, spotIntensity: 1.05},
  {frame: 1705, focusX: 895, focusY: 540, scale: 1.12, rotateDeg: 0.5, tiltXDeg: 0.4, spotX: 880, spotY: 530, spotIntensity: 1.12},
  {frame: 1806, focusX: 945, focusY: 535, scale: 1.02, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 520, spotIntensity: 1.02},

  // 内容泛滥纸片风暴：荷兰角压迫感 -> 聚焦书底 5 张带勾约束牌穿透立起
  {frame: 1855, focusX: 880, focusY: 540, scale: 1.12, rotateDeg: -2.6, tiltXDeg: 0.6, spotX: 780, spotY: 500, spotIntensity: 0.88},
  {frame: 1945, focusX: 960, focusY: 560, scale: 1.18, rotateDeg: -2.2, tiltXDeg: 1.0, spotX: 960, spotY: 540, spotIntensity: 0.92},
  {frame: 1995, focusX: 960, focusY: 755, scale: 1.70, rotateDeg: 0, tiltXDeg: 1.8, spotX: 960, spotY: 730, spotIntensity: 1.18},
  {frame: 2088, focusX: 960, focusY: 745, scale: 1.66, rotateDeg: 0, tiltXDeg: 1.5, spotX: 960, spotY: 720, spotIntensity: 1.2},

  // 终极高潮：立体书爆发掀飞废片，震撼拉远至英雄全景 + 微呼吸升腾收尾
  {frame: 2116, focusX: 960, focusY: 555, scale: 1.40, rotateDeg: 0, tiltXDeg: 0.5, spotX: 960, spotY: 500, spotIntensity: 1.25},
  {frame: 2180, focusX: 960, focusY: 535, scale: 1.04, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 480, spotIntensity: 1.18},
  {frame: 2292, focusX: 960, focusY: 528, scale: 1.06, rotateDeg: 0, tiltXDeg: 0, spotX: 960, spotY: 465, spotIntensity: 1.2},
];

const cubicInOut = Easing.inOut(Easing.cubic);

function decayShake(
  frame: number,
  start: number,
  dur: number,
  amp: number,
): {sx: number; sy: number} {
  if (frame < start || frame > start + dur) return {sx: 0, sy: 0};
  const u = (frame - start) / dur;
  const env = (1 - u) * (1 - u);
  return {
    sx: Math.sin(frame * 1.85) * amp * env,
    sy: Math.cos(frame * 2.35) * amp * env,
  };
}

export function getCameraState(frame: number): CameraState {
  let a = WAYPOINTS[0];
  let b = WAYPOINTS[WAYPOINTS.length - 1];
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (frame >= WAYPOINTS[i].frame && frame <= WAYPOINTS[i + 1].frame) {
      a = WAYPOINTS[i];
      b = WAYPOINTS[i + 1];
      break;
    }
  }

  const span = Math.max(1, b.frame - a.frame);
  const rawT = Math.max(0, Math.min(1, (frame - a.frame) / span));
  const t = cubicInOut(rawT);

  const focusX = lerp(a.focusX, b.focusX, t);
  const focusY = lerp(a.focusY, b.focusY, t);
  const scale = lerp(a.scale, b.scale, t);
  const rotateDeg = lerp(a.rotateDeg, b.rotateDeg, t);
  const tiltXDeg = lerp(a.tiltXDeg, b.tiltXDeg, t);
  const spotX = lerp(a.spotX, b.spotX, t);
  const spotY = lerp(a.spotY, b.spotY, t);
  const spotIntensity = lerp(a.spotIntensity, b.spotIntensity, t);

  let shakeX = 0;
  let shakeY = 0;

  const impacts = [
    {s: 165, d: 24, amp: 11},  // 木印章重砸红叉
    {s: 456, d: 18, amp: 5},   // 蓝金精装合拢
    {s: 1680, d: 26, amp: 12}, // 鲜红 ≠ 砸落
    {s: 2100, d: 30, amp: 13}, // 立体书爆发掀翻废片
  ];
  for (const imp of impacts) {
    const {sx, sy} = decayShake(frame, imp.s, imp.d, imp.amp);
    shakeX += sx;
    shakeY += sy;
  }

  // 极其克制的手持呼吸感（无顿挫抽帧）
  shakeX += Math.sin(frame * 0.045) * 1.4;
  shakeY += Math.cos(frame * 0.055) * 1.1;

  return {
    focusX,
    focusY,
    scale,
    rotateDeg,
    tiltXDeg,
    shakeX,
    shakeY,
    spotX,
    spotY,
    spotIntensity,
  };
}
