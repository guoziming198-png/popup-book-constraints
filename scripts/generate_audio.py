"""
生成 38.2 秒 48kHz 立体声原创配乐与帧同步纸艺/机械 Foley 音效。
纯 Python 标准库实现，无第三方音频库依赖。
"""
from __future__ import annotations

import math
import os
import random
import struct
import wave

SR = 48000
DURATION = 38.2
N_SAMPLES = int(SR * DURATION)

random.seed(2026)


def clamp(x: float, lo: float = -1.0, hi: float = 1.0) -> float:
    return lo if x < lo else (hi if x > hi else x)


def add_stereo(
    buf_l: list[float],
    buf_r: list[float],
    start_sec: float,
    samples: list[float],
    gain: float = 1.0,
    pan: float = 0.0,
) -> None:
    lg = gain * math.cos((pan + 1.0) * math.pi / 4.0)
    rg = gain * math.sin((pan + 1.0) * math.pi / 4.0)
    i0 = int(start_sec * SR)
    total = len(buf_l)
    for idx, v in enumerate(samples):
        pos = i0 + idx
        if 0 <= pos < total:
            buf_l[pos] += v * lg
            buf_r[pos] += v * rg


def midi_to_hz(m: float) -> float:
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))


def synth_tone(
    freq: float,
    dur: float,
    wave_type: str = "sine",
    decay: float = 6.0,
    attack: float = 0.006,
) -> list[float]:
    n = max(1, int(dur * SR))
    out = [0.0] * n
    phase = 0.0
    two_pi = 2.0 * math.pi
    dphi = two_pi * freq / SR
    for i in range(n):
        t = i / SR
        env = math.exp(-t * decay)
        if t < attack:
            env *= t / max(attack, 1e-6)
        if t > dur - 0.015:
            env *= max(0.0, (dur - t) / 0.015)
        phase += dphi
        if wave_type == "marimba":
            val = math.sin(phase) + 0.35 * math.sin(4.0 * phase) * math.exp(-t * 24.0)
        elif wave_type == "musicbox":
            val = (
                0.75 * math.sin(phase)
                + 0.35 * math.sin(2.0 * phase) * math.exp(-t * 10.0)
                + 0.15 * math.sin(3.0 * phase) * math.exp(-t * 18.0)
            )
        elif wave_type == "epiano":
            val = (
                0.7 * math.sin(phase)
                + 0.25 * math.sin(2.0 * phase)
                + 0.12 * math.sin(3.0 * phase) * math.exp(-t * 12.0)
            )
        elif wave_type == "warm_pad":
            val = 0.65 * math.sin(phase) + 0.25 * math.sin(2.0 * phase) + 0.1 * math.sin(0.5 * phase)
            env = math.sin(math.pi * min(1.0, t / max(dur, 1e-6))) ** 0.8
        elif wave_type == "pluck":
            val = (math.sin(phase) + 0.45 * math.sin(2.0 * phase) + 0.2 * math.sin(3.0 * phase)) * math.exp(-t * 8.0)
        elif wave_type == "bass":
            val = 0.8 * math.sin(phase) + 0.25 * math.sin(2.0 * phase)
        else:
            val = math.sin(phase)
        out[i] = val * env
    return out


def synth_chirp(f0: float, f1: float, dur: float, wave_type: str = "sine", decay: float = 5.0) -> list[float]:
    n = max(1, int(dur * SR))
    out = [0.0] * n
    phase = 0.0
    two_pi = 2.0 * math.pi
    ratio = f1 / max(f0, 1.0)
    for i in range(n):
        t = i / SR
        u = t / max(dur, 1e-6)
        env = math.exp(-t * decay)
        if t < 0.004:
            env *= t / 0.004
        if t > dur - 0.012:
            env *= max(0.0, (dur - t) / 0.012)
        f = f0 * (ratio ** u)
        phase += two_pi * f / SR
        if wave_type == "tri":
            v = 2.0 * abs(2.0 * ((phase / two_pi) % 1.0) - 1.0) - 1.0
        else:
            v = math.sin(phase)
        out[i] = v * env
    return out


def synth_paper_rustle(dur: float, bright: float = 0.7, decay: float = 8.0) -> list[float]:
    n = max(1, int(dur * SR))
    out = [0.0] * n
    prev = 0.0
    for i in range(n):
        t = i / SR
        env = math.sin(math.pi * min(1.0, t / max(dur, 1e-6))) * math.exp(-t * decay * 0.4)
        r = random.uniform(-1.0, 1.0)
        hp = r - prev * bright
        prev = r
        out[i] = hp * env
    return out


def synth_whoosh(dur: float, f_center: float = 320.0) -> list[float]:
    n = max(1, int(dur * SR))
    out = [0.0] * n
    prev = 0.0
    phase = 0.0
    two_pi = 2.0 * math.pi
    for i in range(n):
        t = i / SR
        u = t / max(dur, 1e-6)
        env = math.sin(math.pi * u) ** 1.3
        r = random.uniform(-1.0, 1.0)
        lp = 0.25 * r + 0.75 * prev
        prev = lp
        phase += two_pi * (f_center * (0.6 + 0.9 * u)) / SR
        out[i] = (0.75 * lp + 0.25 * math.sin(phase)) * env
    return out


def synth_stamp_thud() -> list[float]:
    thud = synth_chirp(140.0, 38.0, 0.22, "sine", decay=11.0)
    snap = synth_paper_rustle(0.09, bright=0.85, decay=26.0)
    out = []
    for i in range(len(thud)):
        s = snap[i] if i < len(snap) else 0.0
        out.append(0.85 * thud[i] + 0.45 * s)
    return out


def synth_crank_click() -> list[float]:
    tone = synth_chirp(860.0, 420.0, 0.04, "tri", decay=45.0)
    noise = synth_paper_rustle(0.03, bright=0.9, decay=50.0)
    return [0.6 * tone[i] + (0.35 * noise[i] if i < len(noise) else 0.0) for i in range(len(tone))]


def synth_ding(midi: float, dur: float = 0.48) -> list[float]:
    f = midi_to_hz(midi)
    base = synth_tone(f, dur, "musicbox", decay=7.5, attack=0.002)
    shimmer = synth_tone(f * 2.0, dur * 0.7, "sine", decay=11.0, attack=0.002)
    return [base[i] + (0.3 * shimmer[i] if i < len(shimmer) else 0.0) for i in range(len(base))]


def main() -> None:
    buf_l = [0.0] * N_SAMPLES
    buf_r = [0.0] * N_SAMPLES

    # ==========================================================
    # 1. 音乐底层铺底（BGM：38.2 秒叙事弧线）
    # ==========================================================
    # 0.0 - 3.5s: 极简悬念拨弦 (A minor 稀疏)
    intro_notes = [(0.15, 57), (0.85, 64), (1.55, 60), (2.25, 59), (2.95, 57)]
    for t, m in intro_notes:
        add_stereo(buf_l, buf_r, t, synth_tone(midi_to_hz(m), 0.75, "pluck", decay=4.5), gain=0.14, pan=-0.1)

    # 3.5 - 8.6s: 灵动温暖马林巴 + 电钢琴对答和弦 (Fmaj7 - G6 - Em7 - Am9)
    chords_sec2 = [
        (3.55, [53, 60, 64, 69], 1.25),
        (4.80, [55, 62, 67, 71], 1.25),
        (6.05, [52, 59, 64, 67], 1.25),
        (7.30, [57, 64, 67, 72], 1.35),
    ]
    for t, notes, dur in chords_sec2:
        for idx, m in enumerate(notes):
            add_stereo(
                buf_l,
                buf_r,
                t + idx * 0.03,
                synth_tone(midi_to_hz(m), dur, "epiano", decay=2.4),
                gain=0.08,
                pan=(idx - 1.5) * 0.25,
            )

    # 8.6 - 25.6s: 立体书展开——温暖弦乐 Pad + 八音盒/马林巴主旋律
    pad_prog = [
        (8.6, [48, 55, 60, 64], 3.2),   # C
        (11.8, [53, 60, 65, 69], 3.2),  # F
        (15.0, [55, 62, 67, 71], 3.2),  # G
        (18.2, [57, 64, 69, 72], 3.4),  # Am
        (21.6, [53, 60, 65, 69], 2.0),  # F
        (23.6, [55, 62, 67, 71], 2.0),  # G
    ]
    for t, notes, dur in pad_prog:
        for idx, m in enumerate(notes):
            add_stereo(
                buf_l,
                buf_r,
                t,
                synth_tone(midi_to_hz(m), dur, "warm_pad", decay=0.8, attack=0.25),
                gain=0.055,
                pan=(idx - 1.5) * 0.28,
            )

    # 轻快八音盒主旋（每0.45s一拍）
    melody = [
        (8.8, 72), (9.25, 76), (9.7, 79), (10.15, 76), (10.6, 74), (11.05, 72),
        (11.8, 77), (12.25, 76), (12.7, 74), (13.15, 72), (13.6, 74), (14.05, 76),
        (15.0, 79), (15.45, 76), (15.9, 74), (16.35, 76), (16.8, 79), (17.25, 81),
        (18.2, 84), (18.65, 81), (19.1, 79), (19.55, 76), (20.0, 79), (20.45, 76),
        (21.6, 77), (22.05, 79), (22.5, 81), (22.95, 79), (23.4, 76), (23.85, 79), (24.3, 84),
    ]
    for idx, (t, m) in enumerate(melody):
        pan = math.sin(idx * 0.7) * 0.35
        add_stereo(buf_l, buf_r, t, synth_tone(midi_to_hz(m), 0.42, "musicbox", decay=7.0), gain=0.105, pan=pan)
        if idx % 2 == 0:
            add_stereo(buf_l, buf_r, t, synth_tone(midi_to_hz(m - 12), 0.35, "marimba", decay=8.5), gain=0.08, pan=-pan)

    # 25.6 - 30.2s: 对比张力低音过渡
    for t, m in [(25.6, 45), (26.6, 43), (27.6, 41), (28.6, 43), (29.4, 45)]:
        add_stereo(buf_l, buf_r, t, synth_tone(midi_to_hz(m), 0.95, "bass", decay=2.8), gain=0.16, pan=0.0)

    # 30.2 - 35.0s: 紧张脉冲（心跳渐强）
    for k in range(12):
        t = 30.2 + k * 0.38
        g = 0.08 + 0.008 * k
        add_stereo(buf_l, buf_r, t, synth_chirp(115.0, 48.0, 0.14, "sine", decay=14.0), gain=g, pan=0.0)
        add_stereo(buf_l, buf_r, t + 0.19, synth_tone(midi_to_hz(57 + (k % 3) * 2), 0.18, "pluck", decay=10.0), gain=0.07, pan=0.25 if k % 2 else -0.25)

    # 35.0 - 38.2s: 破茧而出辉煌温暖大调和弦 (Cmaj9 -> G/B -> Cmaj9)
    finale_chords = [
        (35.05, [48, 55, 60, 64, 67, 74, 79], 3.1),
    ]
    for t, notes, dur in finale_chords:
        for idx, m in enumerate(notes):
            add_stereo(
                buf_l,
                buf_r,
                t + idx * 0.025,
                synth_tone(midi_to_hz(m), dur, "warm_pad", decay=0.9, attack=0.12),
                gain=0.09,
                pan=(idx - 3.0) * 0.2,
            )
            add_stereo(
                buf_l,
                buf_r,
                t + idx * 0.04,
                synth_tone(midi_to_hz(m + 12), 1.6, "musicbox", decay=2.6),
                gain=0.065,
                pan=(idx - 3.0) * 0.22,
            )

    # ==========================================================
    # 2. 帧同步纸艺与机械 Foley 音效
    # ==========================================================
    # 1.0s 卡片滑入 OMNI 槽
    add_stereo(buf_l, buf_r, 0.98, synth_paper_rustle(0.32, bright=0.65, decay=9.0), gain=0.28, pan=0.15)
    # 1.4 - 2.2s 手摇曲柄咔嗒转动
    for k in range(6):
        add_stereo(buf_l, buf_r, 1.42 + k * 0.13, synth_crank_click(), gain=0.26, pan=0.35)
    # 2.3s 灰暗照片滑出
    add_stereo(buf_l, buf_r, 2.28, synth_paper_rustle(0.28, bright=0.5, decay=8.0), gain=0.24, pan=0.0)
    # 2.75s 木印章重砸
    add_stereo(buf_l, buf_r, 2.75, synth_stamp_thud(), gain=0.42, pan=0.0)

    # 3.9 - 5.7s 对话气泡依次弹出
    bubble_times = [(3.90, 67, -0.45), (4.35, 72, 0.45), (4.80, 71, -0.45), (5.25, 74, 0.45), (5.70, 76, -0.45)]
    for t, m, pan in bubble_times:
        add_stereo(buf_l, buf_r, t, synth_chirp(midi_to_hz(m - 7), midi_to_hz(m), 0.14, "sine", decay=14.0), gain=0.22, pan=pan)

    # 6.3 - 7.1s 五页彩纸顺滑叠落
    for k in range(5):
        add_stereo(buf_l, buf_r, 6.28 + k * 0.16, synth_paper_rustle(0.22, bright=0.72, decay=11.0), gain=0.22, pan=(k - 2) * 0.15)
    # 7.35s 精装封面合拢 + 7.8s 烫金流光微响
    add_stereo(buf_l, buf_r, 7.35, synth_stamp_thud(), gain=0.28, pan=0.0)
    add_stereo(buf_l, buf_r, 7.80, synth_ding(88, 0.55), gain=0.14, pan=0.2)

    # 8.8s 立体书 90° 展卷气浪
    add_stereo(buf_l, buf_r, 8.75, synth_whoosh(0.65, 260.0), gain=0.32, pan=0.0)
    # 9.5 - 10.7s 5张约束立牌翻起
    for k in range(5):
        add_stereo(buf_l, buf_r, 9.55 + k * 0.24, synth_paper_rustle(0.18, bright=0.8, decay=14.0), gain=0.20, pan=(k - 2) * 0.3)
        add_stereo(buf_l, buf_r, 9.56 + k * 0.24, synth_chirp(360 + k * 45, 580 + k * 55, 0.11, "sine", decay=16.0), gain=0.12, pan=(k - 2) * 0.3)

    # 12.2s 灯塔点亮光晕
    add_stereo(buf_l, buf_r, 12.20, synth_ding(84, 0.7), gain=0.16, pan=0.45)
    # 14.2s 手风琴胶片弹开
    add_stereo(buf_l, buf_r, 14.20, synth_whoosh(0.50, 380.0), gain=0.26, pan=-0.1)
    add_stereo(buf_l, buf_r, 14.32, synth_paper_rustle(0.35, bright=0.78, decay=9.0), gain=0.24, pan=0.1)

    # 16.2 / 16.9 / 17.6 / 18.3s 4 个时代微缩立牌弹出
    for idx, t in enumerate([16.20, 16.90, 17.60, 18.30]):
        pan = -0.45 + idx * 0.3
        add_stereo(buf_l, buf_r, t, synth_chirp(280 + idx * 40, 620 + idx * 55, 0.15, "tri", decay=13.0), gain=0.20, pan=pan)
        add_stereo(buf_l, buf_r, t, synth_paper_rustle(0.14, bright=0.82, decay=16.0), gain=0.18, pan=pan)

    # 19.5 / 20.2 / 20.9 / 21.6s 4 种风格刷色魔法扫频
    for idx, t in enumerate([19.50, 20.20, 20.90, 21.60]):
        pan = -0.45 + idx * 0.3
        add_stereo(buf_l, buf_r, t, synth_whoosh(0.32, 520.0 + idx * 80.0), gain=0.18, pan=pan)
        add_stereo(buf_l, buf_r, t + 0.08, synth_ding(76 + idx * 3, 0.42), gain=0.16, pan=pan)

    # 22.6s 留声机点亮
    add_stereo(buf_l, buf_r, 22.60, synth_ding(79, 0.55), gain=0.18, pan=-0.4)

    # 23.6 - 25.0s 5 个鲜红对勾连续清脆叮声
    for k in range(5):
        add_stereo(buf_l, buf_r, 23.60 + k * 0.32, synth_ding(79 + k * 2, 0.45), gain=0.21, pan=(k - 2) * 0.3)

    # 28.0s 鲜红立体 ≠ 重砸冲击
    add_stereo(buf_l, buf_r, 28.00, synth_stamp_thud(), gain=0.44, pan=-0.1)
    add_stereo(buf_l, buf_r, 28.02, synth_chirp(320.0, 95.0, 0.25, "tri", decay=9.0), gain=0.24, pan=-0.1)

    # 30.4 - 33.0s 漫天平庸灰片狂涌沙沙声
    for k in range(14):
        add_stereo(
            buf_l,
            buf_r,
            30.35 + k * 0.19,
            synth_paper_rustle(0.24, bright=0.72, decay=10.0),
            gain=0.16,
            pan=math.sin(k * 1.1) * 0.55,
        )

    # 33.2 - 34.7s 5张带勾约束卡依次穿透立起
    for k in range(5):
        add_stereo(buf_l, buf_r, 33.25 + k * 0.30, synth_ding(72 + k * 2, 0.45), gain=0.22, pan=(k - 2) * 0.3)

    # 35.0s 破茧掀飞震撼 Whoosh + 辉煌收束叮
    add_stereo(buf_l, buf_r, 35.00, synth_whoosh(0.85, 340.0), gain=0.45, pan=0.0)
    add_stereo(buf_l, buf_r, 35.02, synth_stamp_thud(), gain=0.35, pan=0.0)
    add_stereo(buf_l, buf_r, 35.25, synth_ding(84, 1.2), gain=0.24, pan=0.0)
    add_stereo(buf_l, buf_r, 37.20, synth_ding(88, 0.9), gain=0.14, pan=0.2)

    # 软限幅与输出 WAV
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
    os.makedirs(out_dir, exist_ok=True)
    wav_path = os.path.join(out_dir, "soundtrack_tmp.wav")

    peak = 0.0
    for i in range(N_SAMPLES):
        peak = max(peak, abs(buf_l[i]), abs(buf_r[i]))
    norm = 0.88 / max(peak, 1e-6)

    raw = bytearray(N_SAMPLES * 4)
    for i in range(N_SAMPLES):
        l_val = int(clamp(math.tanh(buf_l[i] * norm * 1.05)) * 32767.0)
        r_val = int(clamp(math.tanh(buf_r[i] * norm * 1.05)) * 32767.0)
        struct.pack_into("<hh", raw, i * 4, l_val, r_val)

    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(raw)

    print(f"Generated {wav_path}: {N_SAMPLES} samples ({DURATION}s)")


if __name__ == "__main__":
    main()
