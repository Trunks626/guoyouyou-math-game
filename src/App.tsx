import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './components/HomePage';
import TeachMode from './components/TeachMode';
import PracticeMode from './components/PracticeMode';
import ProgressPage from './components/ProgressPage';

export type GameMode = 'home' | 'teach' | 'practice' | 'progress';

export interface UserProgress {
  totalStars: number;
  correctAnswers: number;
  totalQuestions: number;
  streak: number;
  bestStreak: number;
  unlockedLevels: number[];
}

const defaultProgress: UserProgress = {
  totalStars: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  streak: 0,
  bestStreak: 0,
  unlockedLevels: [1],
};

function App() {
  const [mode, setMode] = useState<GameMode>('home');
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('mathKidsProgress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('mathKidsProgress', JSON.stringify(progress));
  }, [progress]);

  const addStars = (count: number) => {
    setProgress(prev => ({ ...prev, totalStars: prev.totalStars + count }));
  };

  const recordAnswer = (correct: boolean) => {
    setProgress(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        totalQuestions: prev.totalQuestions + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  };

  return (
    <div className="min-h-screen w-full" style={{ fontFamily: "'Comic Sans MS', 'YouYuan', 'Microsoft YaHei', cursive, sans-serif" }}>
      <AnimatePresence mode="wait">
        {mode === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onNavigate={setMode} progress={progress} />
          </motion.div>
        )}
        {mode === 'teach' && (
          <motion.div
            key="teach"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <TeachMode onBack={() => setMode('home')} />
          </motion.div>
        )}
        {mode === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <PracticeMode 
              onBack={() => setMode('home')} 
              onAddStars={addStars}
              onRecordAnswer={recordAnswer}
            />
          </motion.div>
        )}
        {mode === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
          >
            <ProgressPage onBack={() => setMode('home')} progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
