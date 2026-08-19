import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, ChevronRight, Lightbulb } from 'lucide-react';
import Mascot from './Mascot';
import {
  playStepSound,
  playCorrectSound,
  playClickSound,
  speakText,
} from '../utils/audio';

interface TeachModeProps {
  onBack: () => void;
}

const EMOJIS = ['🍎', '⭐', '🎈', '🐻', '🍪', '🚗', '🌸', '🍌', '🐰', '🎁'];

export default function TeachMode({ onBack }: TeachModeProps) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [isAdd, setIsAdd] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState(0);
  const [mascotPose, setMascotPose] = useState<'left' | 'right' | 'front'>('left');
  const [mascotMood, setMascotMood] = useState<'think' | 'happy'>('think');

  const result = isAdd ? a + b : a - b;
  const emojiA = EMOJIS[a % EMOJIS.length];
  const emojiB = EMOJIS[b % EMOJIS.length];

  const generateProblem = () => {
    playClickSound();
    setMascotMood('think');
    setMascotPose('left');
    setShowResult(false);
    setStep(0);
    const add = Math.random() > 0.3;
    setIsAdd(add);
    if (add) {
      const na = Math.floor(Math.random() * 10) + 1;
      const nb = Math.floor(Math.random() * (10 - na)) + 1;
      setA(na);
      setB(nb);
    } else {
      const na = Math.floor(Math.random() * 10) + 5;
      const nb = Math.floor(Math.random() * na) + 1;
      setA(na);
      setB(nb);
    }
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleStep = () => {
    playStepSound();
    if (step < 2) {
      const newStep = step + 1;
      setStep(newStep);
      // 切换 mascot 姿势和语音讲解
      if (newStep === 1) {
        setMascotPose('right');
        speakText(isAdd
          ? `第二组有 ${b} 个${emojiB}`
          : `要从 ${a} 个里面拿走 ${b} 个`
        );
      } else if (newStep === 2) {
        setMascotPose('front');
        speakText(isAdd
          ? `把两组合在一起数一数`
          : `看看还剩下多少个`
        );
      }
    } else {
      setShowResult(true);
      setMascotMood('happy');
      setMascotPose('front');
      playCorrectSound();
      setTimeout(() => {
        speakText(`${a} ${isAdd ? '加' : '减'} ${b} 等于 ${result}`);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { playClickSound(); onBack(); }}
          className="p-2 rounded-full bg-white shadow-md"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </motion.button>
        <h2 className="text-2xl font-bold text-kid-dark">📚 学习模式</h2>
        <div className="w-10" />
      </div>

      {/* Mascot 陪伴 */}
      <div className="flex justify-center mb-2">
        <Mascot pose={mascotPose} mood={mascotMood} size={showResult ? 110 : 80} />
      </div>

      {/* 题目卡片 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          key={`${a}-${b}-${isAdd}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-kid w-full max-w-md"
        >
          {/* 算式 */}
          <div className="text-center mb-6">
            <div className="number-display text-kid-dark mb-2">
              {a} {isAdd ? '+' : '-'} {b} = ?
            </div>
            <p className="text-gray-500 text-lg">
              {isAdd ? '把两组东西合在一起' : '从一组里拿走一些'}
            </p>
          </div>

          {/* 动画演示 */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* 第一组 */}
            <AnimatePresence>
              <motion.div
                className="flex flex-wrap justify-center gap-2 p-3 bg-kid-yellow/20 rounded-2xl w-full"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <span className="text-sm text-gray-500 w-full text-center mb-1">第一组：{a} 个</span>
                {[...Array(a)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-3xl"
                  >
                    {emojiA}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* 运算符号 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-kid-orange"
            >
              {isAdd ? '➕' : '➖'}
            </motion.div>

            {/* 第二组（减法时显示虚线框） */}
            <AnimatePresence>
              <motion.div
                className={`flex flex-wrap justify-center gap-2 p-3 rounded-2xl w-full ${
                  !isAdd && step >= 1 ? 'bg-red-100 border-2 border-dashed border-red-300' : 'bg-kid-blue/20'
                }`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm text-gray-500 w-full text-center mb-1">
                  {isAdd ? `第二组：${b} 个` : step >= 1 ? `要拿走：${b} 个` : `第二组：${b} 个`}
                </span>
                {[...Array(b)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      opacity: !isAdd && step >= 2 ? 0.3 : 1,
                    }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-3xl"
                  >
                    {emojiB}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* 等号和结果 */}
            {showResult && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-kid-dark"
                >
                  🟰
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring' }}
                  className="flex flex-wrap justify-center gap-2 p-3 bg-kid-green/20 rounded-2xl w-full"
                >
                  <span className="text-sm text-gray-500 w-full text-center mb-1">结果：{result} 个</span>
                  {[...Array(result)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: i * 0.08, type: 'spring' }}
                      className="text-3xl"
                    >
                      {isAdd ? (i < a ? emojiA : emojiB) : emojiA}
                    </motion.span>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* 步骤提示 */}
          {!showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-kid-purple/20 rounded-xl p-3 mb-4"
            >
              <Lightbulb className="w-5 h-5 text-kid-orange flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {step === 0 && '第一步：看看第一组有多少个'}
                {step === 1 && `第二步：${isAdd ? '再看第二组' : '标记要拿走的'}有多少个`}
                {step === 2 && `第三步：${isAdd ? '两组合在一起' : '剩下的就是答案'}`}
              </p>
            </motion.div>
          )}

          {/* 按钮 */}
          <div className="flex gap-3">
            {!showResult ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStep}
                className="btn-kid-blue flex-1 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                {step === 0 ? '开始演示' : step === 1 ? '下一步' : '看结果'}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateProblem}
                className="btn-kid-green flex-1 flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                下一题
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
