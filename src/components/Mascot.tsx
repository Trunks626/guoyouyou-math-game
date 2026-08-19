import { motion } from 'framer-motion';

export type MascotPose = 'front' | 'left' | 'right' | 'back';
export type MascotMood = 'happy' | 'sad' | 'think' | 'idle';

interface MascotProps {
  pose?: MascotPose;
  mood?: MascotMood;
  size?: number;
  className?: string;
  animate?: boolean;
}

const poseMap: Record<MascotPose, string> = {
  front: '/郭酉酉/正面.png',
  left: '/郭酉酉/左.png',
  right: '/郭酉酉/右.png',
  back: '/郭酉酉/背.png',
};

export default function Mascot({
  pose = 'front',
  mood = 'idle',
  size = 120,
  className = '',
  animate = true,
}: MascotProps) {
  const getAnimation = () => {
    if (!animate) return {};
    switch (mood) {
      case 'happy':
        return {
          y: [0, -15, 0],
          rotate: [0, -5, 5, 0],
          scale: [1, 1.1, 1],
        };
      case 'sad':
        return {
          y: [0, 5, 0],
          rotate: [0, 3, -3, 0],
        };
      case 'think':
        return {
          y: [0, -5, 0],
          rotate: [0, 3, 0, -3, 0],
        };
      case 'idle':
      default:
        return {
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0],
        };
    }
  };

  const getTransition = () => {
    switch (mood) {
      case 'happy':
        return { duration: 0.6, repeat: Infinity };
      case 'sad':
        return { duration: 2, repeat: Infinity };
      case 'think':
        return { duration: 2.5, repeat: Infinity };
      default:
        return { duration: 3, repeat: Infinity };
    }
  };

  return (
    <motion.img
      src={poseMap[pose]}
      alt="郭酉酉"
      className={`object-contain drop-shadow-lg ${className}`}
      style={{ width: size, height: size * 1.3 }}
      initial={{ scale: 0 }}
      animate={getAnimation()}
      transition={getTransition()}
    />
  );
}
