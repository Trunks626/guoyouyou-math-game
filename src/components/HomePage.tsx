import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, Trophy, Star, Sparkles, Volume2, VolumeX } from 'lucide-react';
import type { GameMode, UserProgress } from '../App';
import Mascot from './Mascot';
import {
  startBackgroundMusic,
  stopBackgroundMusic,
  setSpeechEnabled,
  getSpeechEnabled,
  playClickSound,
} from '../utils/audio';

interface HomePageProps {
  onNavigate: (mode: GameMode) => void;
  progress: UserProgress;
}

export default function HomePage({ onNavigate, progress }: HomePageProps) {
  const [bgmOn, setBgmOn] = useState(false);
  const [speechOn, setSpeechOn] = useState(getSpeechEnabled());
  const [mascotPose, setMascotPose] = useState<'front' | 'left' | 'right' | 'back'>('front');

  useEffect(() => {
    // 首页 mascot 轮流展示不同角度
    const interval = setInterval(() => {
      setMascotPose(prev => {
        const poses: Array<'front' | 'left' | 'right' | 'back'> = ['front', 'left', 'right', 'back'];
        const nextIndex = (poses.indexOf(prev) + 1) % poses.length;
        return poses[nextIndex];
      });
    }, 3000);
    return () => {
      clearInterval(interval);
      stopBackgroundMusic();
    };
  }, []);

  const toggleBgm = () => {
    playClickSound();
    if (bgmOn) {
      stopBackgroundMusic();
      setBgmOn(false);
    } else {
      startBackgroundMusic();
      setBgmOn(true);
    }
  };

  const toggleSpeech = () => {
    playClickSound();
    const newVal = !speechOn;
    setSpeechEnabled(newVal);
    setSpeechOn(newVal);
  };

  const handleNavigate = (mode: GameMode) => {
    playClickSound();
    onNavigate(mode);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 浮动装饰 */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-30 pointer-events-none"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {['⭐', '🍎', '🎈', '🌈', '🎨', '🎵', '🌟', '🎪'][i]}
        </motion.div>
      ))}

      {/* 音效设置按钮 */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSpeech}
          className={`p-2 rounded-full shadow-md ${speechOn ? 'bg-kid-blue text-white' : 'bg-white text-gray-400'}`}
          title={speechOn ? '语音鼓励已开启' : '语音鼓励已关闭'}
        >
          {speechOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleBgm}
          className={`p-2 rounded-full shadow-md ${bgmOn ? 'bg-kid-pink text-white' : 'bg-white text-gray-400'}`}
          title={bgmOn ? '背景音乐已开启' : '背景音乐已关闭'}
        >
          {bgmOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mascot 区域 */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-0 relative"
      >
        <Mascot pose={mascotPose} mood="idle" size={140} />
      </motion.div>

      {/* 标题 */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-kid-dark text-shadow-kid mb-2"
      >
        郭酉酉学算术
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-600 mb-8"
      >
        快乐学习 20 以内加减法！
      </motion.p>

      {/* 星星展示 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg border-2 border-kid-yellow mb-8"
      >
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        <span className="text-xl font-bold text-kid-dark">{progress.totalStars}</span>
        <span className="text-sm text-gray-500">颗星星</span>
      </motion.div>

      {/* 按钮 */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate('teach')}
          className="btn-kid-primary flex items-center justify-center gap-3"
        >
          <BookOpen className="w-6 h-6" />
          <span>📚 学习模式</span>
          <Sparkles className="w-5 h-5" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate('practice')}
          className="btn-kid-blue flex items-center justify-center gap-3"
        >
          <Gamepad2 className="w-6 h-6" />
          <span>🎮 练习模式</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate('progress')}
          className="btn-kid-green flex items-center justify-center gap-3"
        >
          <Trophy className="w-6 h-6" />
          <span>🏆 我的成就</span>
        </motion.button>
      </div>

      {/* 底部提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-gray-400"
      >
        适合 4-8 岁小朋友 · 边玩边学
      </motion.p>
    </div>
  );
}
