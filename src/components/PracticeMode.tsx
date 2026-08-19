import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import Mascot from './Mascot';
import {
  playCorrectSound,
  playWrongSound,
  playStarSound,
  playClickSound,
  speakCorrect,
  speakWrong,
} from '../utils/audio';

interface PracticeModeProps {
  onBack: () => void;
  onAddStars: (count: number) => void;
  onRecordAnswer: (correct: boolean) => void;
}

type Difficulty = 1 | 2 | 3;

interface Question {
  a: number;
  b: number;
  operator: '+' | '-';
  answer: number;
}

function generateQuestion(difficulty: Difficulty): Question {
  const isAdd = Math.random() > 0.4;
  let a: number, b: number;

  if (difficulty === 1) {
    if (isAdd) {
      a = Math.floor(Math.random() * 6) + 1;
      b = Math.floor(Math.random() * (6 - a)) + 1;
    } else {
      a = Math.floor(Math.random() * 5) + 3;
      b = Math.floor(Math.random() * a) + 1;
    }
  } else if (difficulty === 2) {
    if (isAdd) {
      a = Math.floor(Math.random() * 8) + 1;
      b = Math.floor(Math.random() * (8 - a)) + 1;
    } else {
      a = Math.floor(Math.random() * 8) + 5;
      b = Math.floor(Math.random() * a) + 1;
    }
  } else {
    if (isAdd) {
      a = Math.floor(Math.random() * 11) + 1;
      b = Math.floor(Math.random() * (11 - a)) + 1;
    } else {
      a = Math.floor(Math.random() * 11) + 8;
      b = Math.floor(Math.random() * a) + 1;
    }
  }

  return {
    a,
    b,
    operator: isAdd ? '+' : '-',
    answer: isAdd ? a + b : a - b,
  };
}

export default function PracticeMode({ onBack, onAddStars, onRecordAnswer }: PracticeModeProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [question, setQuestion] = useState<Question>(generateQuestion(1));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mascotMood, setMascotMood] = useState<'think' | 'happy' | 'sad'>('think');
  const [mascotPose, setMascotPose] = useState<'front' | 'back'>('front');

  const startGame = (level: Difficulty) => {
    playClickSound();
    setMascotMood('think');
    setMascotPose('front');
    setDifficulty(level);
    setQuestion(generateQuestion(level));
    setScore(0);
    setLives(5);
    setShowLevelSelect(false);
    setSelectedAnswer(null);
    setShowFeedback(null);
  };

  const nextQuestion = useCallback(() => {
    setMascotMood('think');
    setMascotPose('front');
    setQuestion(generateQuestion(difficulty));
    setSelectedAnswer(null);
    setShowFeedback(null);
  }, [difficulty]);

  const handleAnswer = (answer: number) => {
    if (showFeedback || selectedAnswer !== null) return;
    playClickSound();
    setSelectedAnswer(answer);

    const correct = answer === question.answer;
    setShowFeedback(correct ? 'correct' : 'wrong');
    onRecordAnswer(correct);

    if (correct) {
      setMascotMood('happy');
      setMascotPose('front');
      playCorrectSound();
      setTimeout(() => speakCorrect(), 200);

      const newScore = score + 1;
      setScore(newScore);
      onAddStars(1);

      // 粒子效果
      const newParticles = [...Array(8)].map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * -150 - 50,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);

      // 连续答对奖励
      if (newScore % 5 === 0) {
        playStarSound();
        onAddStars(3);
      }
    } else {
      setMascotMood('sad');
      setMascotPose('back');
      playWrongSound();
      setTimeout(() => speakWrong(), 200);
      setLives(prev => prev - 1);
    }

    setTimeout(() => {
      if (!correct && lives <= 1) {
        setMascotMood('think');
        setMascotPose('front');
        setShowLevelSelect(true);
      } else {
        nextQuestion();
      }
    }, 2500);
  };

  // 生成选项
  const options = (() => {
    const answers = new Set<number>();
    answers.add(question.answer);
    while (answers.size < 4) {
      const offset = Math.floor(Math.random() * 6) - 3;
      const wrong = question.answer + offset;
      if (wrong >= 0 && wrong <= 20 && wrong !== question.answer) {
        answers.add(wrong);
      }
    }
    return Array.from(answers).sort(() => Math.random() - 0.5);
  })();

  if (showLevelSelect) {
    return (
      <div className="min-h-screen w-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playClickSound(); onBack(); }}
            className="p-2 rounded-full bg-white shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          <h2 className="text-2xl font-bold text-kid-dark">🎮 练习模式</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {/* Mascot 思考中 */}
          <Mascot pose="left" mood="think" size={100} />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-gray-600 mb-4"
          >
            选择难度开始挑战！
          </motion.p>

          {([1, 2, 3] as Difficulty[]).map((level, i) => (
            <motion.button
              key={level}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame(level)}
              className={`w-full max-w-xs p-5 rounded-2xl shadow-lg border-4 flex items-center gap-4 ${
                level === 1 ? 'bg-kid-green/20 border-kid-green' :
                level === 2 ? 'bg-kid-yellow/20 border-kid-yellow' :
                'bg-kid-pink/20 border-kid-pink'
              }`}
            >
              <div className={`text-4xl ${
                level === 1 ? 'text-kid-green' :
                level === 2 ? 'text-kid-yellow' :
                'text-kid-pink'
              }`}>
                {level === 1 ? '🌱' : level === 2 ? '🔥' : '👑'}
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-kid-dark">
                  {level === 1 ? '入门' : level === 2 ? '进阶' : '挑战'}
                </div>
                <div className="text-sm text-gray-500">
                  {level === 1 ? '10 以内加减法' : level === 2 ? '15 以内加减法' : '20 以内加减法'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { playClickSound(); setShowLevelSelect(true); }}
          className="p-2 rounded-full bg-white shadow-md"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-md">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-kid-dark">{score}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < lives ? 'text-kid-pink fill-kid-pink' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-10" />
      </div>

      {/* 题目区域 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Mascot 动态反馈 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mascotMood}-${mascotPose}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="mb-2"
          >
            <Mascot pose={mascotPose} mood={mascotMood} size={showFeedback ? 130 : 90} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${question.a}-${question.b}-${question.operator}`}
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-kid w-full max-w-md p-6"
          >
            {/* 题目 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 text-5xl font-bold text-kid-dark">
                <motion.span
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="inline-block bg-kid-yellow/30 px-4 py-2 rounded-2xl"
                >
                  {question.a}
                </motion.span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-kid-orange"
                >
                  {question.operator}
                </motion.span>
                <motion.span
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block bg-kid-blue/30 px-4 py-2 rounded-2xl"
                >
                  {question.b}
                </motion.span>
                <span className="text-kid-dark">=</span>
                <span className="text-4xl">❓</span>
              </div>
            </div>

            {/* 选项 */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, i) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === question.answer;
                const showCorrect = showFeedback === 'correct' && isCorrect;
                const showWrong = showFeedback === 'wrong' && isSelected && !isCorrect;
                const showReveal = showFeedback === 'wrong' && isCorrect;

                return (
                  <motion.button
                    key={option}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, type: 'spring' }}
                    whileHover={!showFeedback ? { scale: 1.05 } : {}}
                    whileTap={!showFeedback ? { scale: 0.95 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback !== null}
                    className={`
                      relative p-4 rounded-2xl text-3xl font-bold shadow-lg border-4 transition-all duration-200
                      ${showCorrect ? 'bg-kid-green text-white border-emerald-400' :
                        showWrong ? 'bg-kid-red text-white border-red-400' :
                        showReveal ? 'bg-kid-green/50 text-white border-emerald-300 border-dashed' :
                        isSelected ? 'bg-kid-blue text-white border-kid-blue' :
                        'bg-white text-kid-dark border-gray-200 hover:border-kid-blue'}
                    `}
                  >
                    {option}
                    {showCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 text-2xl"
                      >
                        ⭐
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 反馈 */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className={`mt-4 p-3 rounded-xl text-center font-bold text-lg ${
                    showFeedback === 'correct'
                      ? 'bg-kid-green/20 text-emerald-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {showFeedback === 'correct'
                    ? ['🎉 太棒了！', '⭐ 你真聪明！', '🌟 答对了！', '💯 满分！'][Math.floor(Math.random() * 4)]
                    : `😅 不对哦，正确答案是 ${question.answer}`}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* 粒子效果 */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed top-1/2 left-1/2 pointer-events-none text-3xl"
              style={{ zIndex: 50 }}
            >
              {['⭐', '✨', '🌟', '🎉', '💖'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
