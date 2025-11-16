import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';

const ResultsPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { currentQuiz, userSession } = useQuizStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const modeLabels: Record<string, string> = {
    standard: 'Rastgele Test',
    'mistake-bank': 'Yanlışlarım',
    'smart-review': 'Akıllı Tekrar',
    custom: 'Özel Test'
  };

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate real quiz results
  const { score, correctAnswers, incorrectAnswers } = React.useMemo(() => {
    if (!currentQuiz) {
      return { score: 0, total: 0, correctAnswers: 0, incorrectAnswers: 0 };
    }

    const totalQuestions = currentQuiz.questions.length;
    let correct = 0;

    currentQuiz.questions.forEach(question => {
      const userAnswer = currentQuiz.userAnswers[question.id];
      if (userAnswer === question.dogruCevapIndex) {
        correct++;
      }
    });

    const scorePercentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    return {
      score: scorePercentage,
      total: totalQuestions,
      correctAnswers: correct,
      incorrectAnswers: totalQuestions - correct
    };
  }, [currentQuiz]);

  // Show confetti for high scores
  useEffect(() => {
    if (score > 70) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [score]);

  const handleReviewMistakes = () => {
    navigate('/quiz/mistake-bank');
  };

  const handleTryAgain = () => {
    navigate('/quiz/standard');
  };

  const handleHome = () => {
    navigate('/');
  };

  // Get message based on score
  const getResultMessage = () => {
    if (score >= 90) return "Mükemmel performans";
    if (score >= 80) return "Güçlü bir sonuç";
    if (score >= 70) return "Tutarlı ilerleme";
    if (score >= 60) return "İstikrarlı bir tempo";
    return "Ek pratik önerilir";
  };

  const streakCount = userSession.streak.count;
  const activeMode = mode ?? currentQuiz?.mode ?? 'standard';
  const modeLabel = modeLabels[activeMode] ?? 'Quiz Modu';

  return (
    <motion.div
      className="relative flex h-full w-full flex-col bg-transparent"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={260}
          colors={["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"]}
        />
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <motion.div
          className="text-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="text-7xl">{score >= 80 ? '🎉' : score >= 60 ? '😊' : '💪'}</div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="text-7xl font-black text-text-primary sm:text-8xl">{score}%</div>
          <div className="mt-3 text-xl font-bold text-text-secondary">{getResultMessage()}</div>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm">
            <span>🎯</span>
            <span className="text-text-muted">{modeLabel}</span>
          </div>
          <div className="h-4 w-px bg-text-muted/30" />
          <div className="flex items-center gap-1.5 text-sm">
            <span>🔥</span>
            <span className="font-bold text-text-primary">{streakCount}</span>
          </div>
        </div>

        <motion.div
          className="flex gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-success-400/15 px-8 py-5">
            <div className="text-4xl font-black text-success-500">{correctAnswers}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-success-500/80">Doğru</div>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-danger-400/15 px-8 py-5">
            <div className="text-4xl font-black text-danger-500">{incorrectAnswers}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-danger-500/80">Yanlış</div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 w-full max-w-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleHome}
            className="w-full rounded-2xl bg-gradient-to-r from-primary-500 to-accent-400 py-4 text-lg font-black uppercase tracking-wide text-white"
            style={{ boxShadow: 'var(--shadow-lg)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Devam Et
          </motion.button>
          <div className="flex gap-3">
            {incorrectAnswers > 0 && (
              <button
                onClick={handleReviewMistakes}
                className="flex-1 rounded-2xl bg-bg-secondary py-3 text-sm font-bold text-text-primary hover:bg-bg-tertiary"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                Tekrar Et
              </button>
            )}
            <button
              onClick={handleTryAgain}
              className="flex-1 rounded-2xl bg-bg-secondary py-3 text-sm font-bold text-text-primary hover:bg-bg-tertiary"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              Yeni Test
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;