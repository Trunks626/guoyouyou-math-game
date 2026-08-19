import { motion } from 'framer-motion';
import { ArrowLeft, Star, Target, Zap, Award, TrendingUp } from 'lucide-react';
import Mascot from './Mascot';
import type { UserProgress } from '../App';

interface ProgressPageProps {
  onBack: () => void;
  progress: UserProgress;
}

export default function ProgressPage({ onBack, progress }: ProgressPageProps) {
  const accuracy = progress.totalQuestions > 0
    ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
    : 0;

  const getLevelTitle = () => {
    if (progress.totalStars >= 50) return '数学大师 🏆';
    if (progress.totalStars >= 30) return '计算达人 🌟';
    if (progress.totalStars >= 15) return '数学小将 ⭐';
    if (progress.totalStars >= 5) return '学习新手 🌱';
    return '初学者 👶';
  };

  const achievements = [
    { icon: '🌟', title: '初次尝试', desc: '完成第一道题', unlocked: progress.totalQuestions >= 1 },
    { icon: '⭐', title: '初露锋芒', desc: '累计获得 5 颗星', unlocked: progress.totalStars >= 5 },
    { icon: '🔥', title: '连对高手', desc: '连续答对 5 题', unlocked: progress.bestStreak >= 5 },
    { icon: '🎯', title: '百发百中', desc: '正确率达到 80%', unlocked: accuracy >= 80 },
    { icon: '👑', title: '数学之星', desc: '累计获得 30 颗星', unlocked: progress.totalStars >= 30 },
    { icon: '🏆', title: '数学大师', desc: '累计获得 50 颗星', unlocked: progress.totalStars >= 50 },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 rounded-full bg-white shadow-md"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </motion.button>
        <h2 className="text-2xl font-bold text-kid-dark">🏆 我的成就</h2>
        <div className="w-10" />
      </div>

      {/* Mascot 庆祝 */}
      <div className="flex justify-center mb-2">
        <Mascot pose="front" mood="happy" size={100} />
      </div>

      {/* 总览卡片 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-kid mb-4 border-kid-yellow"
      >
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{getLevelTitle().split(' ')[1]}</div>
          <h3 className="text-2xl font-bold text-kid-dark">{getLevelTitle().split(' ')[0]}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-kid-yellow/20 rounded-xl p-3 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-kid-dark">{progress.totalStars}</div>
            <div className="text-xs text-gray-500">总星星</div>
          </div>
          <div className="bg-kid-blue/20 rounded-xl p-3 text-center">
            <Target className="w-6 h-6 text-kid-blue mx-auto mb-1" />
            <div className="text-2xl font-bold text-kid-dark">{accuracy}%</div>
            <div className="text-xs text-gray-500">正确率</div>
          </div>
          <div className="bg-kid-green/20 rounded-xl p-3 text-center">
            <Zap className="w-6 h-6 text-kid-green mx-auto mb-1" />
            <div className="text-2xl font-bold text-kid-dark">{progress.bestStreak}</div>
            <div className="text-xs text-gray-500">最高连对</div>
          </div>
          <div className="bg-kid-pink/20 rounded-xl p-3 text-center">
            <TrendingUp className="w-6 h-6 text-kid-pink mx-auto mb-1" />
            <div className="text-2xl font-bold text-kid-dark">{progress.totalQuestions}</div>
            <div className="text-xs text-gray-500">总题数</div>
          </div>
        </div>
      </motion.div>

      {/* 成就列表 */}
      <h3 className="text-xl font-bold text-kid-dark mb-3 flex items-center gap-2">
        <Award className="w-6 h-6 text-kid-orange" />
        成就徽章
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.title}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-3 border-2 ${
              ach.unlocked
                ? 'bg-white border-kid-yellow shadow-lg'
                : 'bg-gray-100 border-gray-200 opacity-60'
            }`}
          >
            <div className={`text-3xl mb-1 ${ach.unlocked ? '' : 'grayscale'}`}>{ach.icon}</div>
            <div className="text-sm font-bold text-kid-dark">{ach.title}</div>
            <div className="text-xs text-gray-500">{ach.desc}</div>
            {ach.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-1 text-xs text-kid-green font-bold"
              >
                ✓ 已解锁
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
