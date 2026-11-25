# 立体书：约束越多，作品越能脱颖而出（Remotion 导演版）

基于 **Remotion 4 + React + TypeScript** 实现的 1920×1080、60fps 手工纸艺立体书动画短片。全程采用连续物理弹簧（`spring`）与电影级贝塞尔运镜曲线（拒绝抽帧定格），结合高倍微距特写、乒乓对话摇镜、手风琴分镜轨道跟拍与自研 48kHz 立体声配乐/Foley 音效，呈现“跨模态与多维度约束如何让 AI 视频脱颖而出”的视觉叙事。

## 核心亮点

- **全 60fps 丝滑动画与活态环境细节**：无任何抽帧顿挫；包含灯塔体积探照灯光束扫动、双层海岸波浪错峰涌动、夜空微星闪烁、蒸汽小火车飘烟、悬浮无人机、留声机实时 25 柱律动声波与飘浮暖光微尘。
- **导演级特写摄像机系统（`src/camera.ts`）**：最高 `2.05×` 微距特写，涵盖手写提示词卡开篇、OMNI 手摇曲柄狂转、木印章重砸震动、`我 vs Gemini` 乒乓对话摇镜、蓝金烫金封面流光、四联胶片与微缩纸艺立牌逐格跟拍、荷兰角废片风暴压迫与破茧拉远。
- **纯程序化矢量纸艺建模**：无外部素材包依赖，所有立牌、胶片、4 种艺术风格刷色蜕变（剪影 / 网点 / 像素 / 霓虹）与海滨夜景立体书均由 SVG 与 CSS3D 精密构筑。
- **内置原创配乐与帧同步音效（`scripts/generate_audio.py`）**：纯 Python 标准库合成 38.2 秒 48kHz 立体声配乐及翻页、曲柄、印章、冒泡、扫色与爆裂音效，已预先编码至 `public/audio/soundtrack.mp3`。

## 环境要求

- Node.js >= 20
- npm
- Python >= 3.8 & FFmpeg（仅重新生成音轨时需使用）

## 快速开始

```bash
# 安装依赖
npm install

# TypeScript 类型检查
npm run typecheck

# 启动 Remotion Studio 实时预览
npm run dev

# 渲染完整 1920x1080 60fps MP4 成片
npm run build
```

如需重新合成音轨并压制 MP3：

```bash
python scripts/generate_audio.py
ffmpeg -y -i public/audio/soundtrack_tmp.wav -b:a 192k public/audio/soundtrack.mp3
```

## 目录结构

```text
├── public/audio/soundtrack.mp3        # 原创 48kHz 立体声配乐与 Foley 音效
├── scripts/generate_audio.py          # 音轨合成脚本（纯 Python 标准库）
├── src/
│   ├── components/
│   │   ├── DialogueLayer.tsx          # “我 vs Gemini” 对话立牌与五色气泡
│   │   ├── OmniMachine.tsx            # OMNI 纸盒机器、曲柄、印章与平均水平标签
│   │   ├── PaperStorm.tsx             # 内容泛滥平庸废片风暴与破茧散落效果
│   │   ├── PopupBook.tsx              # 蓝金精装立体书主体与五大约束立牌
│   │   ├── PropsAndAudio.tsx          # 黄雨衣女孩、紫色留声机声波、红旗与 ≠ 符号
│   │   ├── SeasideBackdrop.tsx        # 海滨满月、小屋、灯塔与双层海浪剪纸背景
│   │   ├── StoryboardAccordion.tsx    # 四联胶片折页、四时代立牌与四风格刷色
│   │   ├── SubtitleRibbon.tsx         # 底部手剪白纸条字幕
│   │   └── WoodenStage.tsx            # 胡桃木桌面、聚光灯与漂浮暖光微尘
│   ├── camera.ts                      # 导演运镜轨迹与冲击微震系统
│   ├── index.ts                       # Remotion 入口注册
│   ├── PopupBookVideo.tsx             # 主合成时间线与透视摄像机舞台
│   ├── Root.tsx                       # Composition 配置（1920x1080 @ 60fps）
│   ├── theme.ts                       # 纸艺色彩体系、字体栈与缓动工具
│   └── timeline.ts                    # 节拍帧表、约束元数据与字幕时间轴
├── package.json
├── package-lock.json
├── remotion.config.ts
└── tsconfig.json
```
