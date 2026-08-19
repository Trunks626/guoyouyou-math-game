// ==================== Web Audio API 音效生成 ====================

let audioCtx: AudioContext | null = null;
let bgmOscillators: OscillatorNode[] = [];
let bgmGain: GainNode | null = null;
let isBgmPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/** 播放正确音效 - 欢快上升音阶 */
export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch {
    // 静默失败，不影响游戏体验
  }
}

/** 播放错误音效 - 低沉下降音 */
export function playWrongSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // 静默失败
  }
}

/** 播放点击音效 - 短促清脆 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // 静默失败
  }
}

/** 播放星星音效 - 闪亮效果 */
export function playStarSound() {
  try {
    const ctx = getAudioContext();
    const notes = [880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.2);
    });
  } catch {
    // 静默失败
  }
}

/** 播放步骤推进音效 */
export function playStepSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // 静默失败
  }
}

// ==================== 中文语音合成 ====================

const ENCOURAGEMENT_CORRECT = [
  '郭敬书，你真聪明！',
  '郭敬书，你太棒了！',
  '郭敬书，答对啦，继续加油！',
  '郭敬书，好厉害呀！',
  '郭敬书，你真是个数学小天才！',
  '郭敬书，棒极了！',
  '郭敬书，太厉害了！',
  '郭敬书，你做得真好！',
];

const ENCOURAGEMENT_WRONG = [
  '郭敬书，做错了请再接再厉，不要气馁！',
  '郭敬书，没关系，再试一次！',
  '郭敬书，加油！你可以的！',
  '郭敬书，别灰心，学习就是不断尝试！',
  '郭敬书，错了也没关系，记住正确答案就好！',
];

let speechEnabled = true;

export function setSpeechEnabled(enabled: boolean) {
  speechEnabled = enabled;
}

export function getSpeechEnabled(): boolean {
  return speechEnabled;
}

/** 语音朗读 - 答对鼓励 */
export function speakCorrect() {
  if (!speechEnabled) return;
  try {
    const text = ENCOURAGEMENT_CORRECT[Math.floor(Math.random() * ENCOURAGEMENT_CORRECT.length)];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // 浏览器不支持语音合成
  }
}

/** 语音朗读 - 答错鼓励 */
export function speakWrong() {
  if (!speechEnabled) return;
  try {
    const text = ENCOURAGEMENT_WRONG[Math.floor(Math.random() * ENCOURAGEMENT_WRONG.length)];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // 浏览器不支持语音合成
  }
}

/** 语音朗读 - 任意文本 */
export function speakText(text: string) {
  if (!speechEnabled) return;
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // 浏览器不支持语音合成
  }
}

// ==================== 背景音乐 ====================

/** 播放轻快背景音乐 */
export function startBackgroundMusic() {
  if (isBgmPlaying) return;
  try {
    const ctx = getAudioContext();
    isBgmPlaying = true;

    // 创建主音量控制
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.03, ctx.currentTime);
    masterGain.connect(ctx.destination);
    bgmGain = masterGain;

    // 简单的和弦循环
    const chordProgression = [
      [523.25, 659.25, 783.99],  // C major
      [440.00, 554.37, 659.25],  // F major
      [493.88, 622.25, 739.99],  // G major
      [523.25, 659.25, 783.99],  // C major
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!isBgmPlaying) return;
      const currentGain = bgmGain;
      if (!currentGain) return;

      const chord = chordProgression[chordIndex];
      chordIndex = (chordIndex + 1) % chordProgression.length;

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
        osc.connect(noteGain);
        noteGain.connect(currentGain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.5);
        bgmOscillators.push(osc);
      });

      // 每 2.8 秒播放下一个和弦
      setTimeout(() => {
        if (isBgmPlaying) playChord();
      }, 2800);
    };

    playChord();
  } catch {
    isBgmPlaying = false;
  }
}

/** 停止背景音乐 */
export function stopBackgroundMusic() {
  isBgmPlaying = false;
  bgmOscillators.forEach(osc => {
    try { osc.stop(); } catch {}
  });
  bgmOscillators = [];
  if (bgmGain) {
    try {
      bgmGain.gain.linearRampToValueAtTime(0, (audioCtx?.currentTime || 0) + 0.5);
    } catch {}
  }
}

export function isBackgroundMusicPlaying(): boolean {
  return isBgmPlaying;
}
