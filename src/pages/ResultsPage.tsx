import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import ModeButton from '../components/ModeButton';

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
  const { score, total, correctAnswers, incorrectAnswers } = React.useMemo(() => {
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

  // Calculate percentage for the donut chart
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Get message based on score
  const getResultMessage = () => {
    if (score >= 90) return "Mükemmel performans";
    if (score >= 80) return "Güçlü bir sonuç";
    if (score >= 70) return "Tutarlı ilerleme";
    if (score >= 60) return "İstikrarlı bir tempo";
    return "Ek pratik önerilir";
  };

  // Get color based on score
  const getScoreColor = () => {
    if (score >= 80) return "var(--primary)";
    if (score >= 60) return "var(--secondary)";
    return "var(--accent)";
  };

  const getFollowUpAction = () => {
    if (incorrectAnswers === 0) {
      return 'Harika! Temponu korumak için yeni bir rastgele test başlat ve serine ekstra enerji kat.';
    }
    if (incorrectAnswers <= 3) {
      return 'Yanlışlarını sıcak sıcak temizle: Mistake Bank modu ile bu soruları tekrar çözerek serini büyüt.';
    }
    return 'En çok zorlandığın konuları Mistake Bank ve Akıllı Tekrar ile hedefe odaklayarak güçlen.';
  };

  const streakCount = userSession.streak.count;
  const activeMode = mode ?? currentQuiz?.mode ?? 'standard';
  const modeLabel = modeLabels[activeMode] ?? 'Quiz Modu';
  const followUpMessage = getFollowUpAction();

  return (
    <motion.div 
      className="results-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={260}
          colors={["#6366F1", "#0EA5E9", "#F97316", "#F43F5E", "#22C55E"]}
        />
      )}

      <motion.h1
        className="results-title"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Test Sonuçları
      </motion.h1>

      {/* Score Donut */}
      <motion.div 
        className="score-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
      >
        <div className="score-donut">
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="score-value">
            <div>{score}%</div>
            <div className="score-label">Başarı</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="hud-grid result-hud"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
      >
        <div className="hud-card">
          <span className="hud-label">Mod</span>
          <span className="hud-value">{modeLabel}</span>
        </div>
        <div className="hud-card">
          <span className="hud-label">Seri</span>
          <span className="hud-value">{streakCount} 🔥</span>
        </div>
        <div className="hud-card">
          <span className="hud-label">Yanlış</span>
          <span className="hud-value">{incorrectAnswers}</span>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div 
        className="results-summary"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Özet</h2>
        <p className="result-message">{getResultMessage()}</p>
        <p>
          {total} sorudan {correctAnswers} tanesini doğru bildin.
        </p>
        <p className="result-tip">{followUpMessage}</p>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value correct">{correctAnswers}</div>
            <div className="stat-label">Doğru</div>
          </div>
          <div className="stat-item">
            <div className="stat-value incorrect">{incorrectAnswers}</div>
            <div className="stat-label">Yanlış</div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div 
        className="result-buttons"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {incorrectAnswers > 0 && (
          <ModeButton
            onClick={handleReviewMistakes}
            title="Yanlışları Tekrar Et"
          />
        )}
        <ModeButton
          onClick={handleTryAgain}
          title="Yeni Rastgele Test"
        />
        <ModeButton
          onClick={handleHome}
          title="Ana Menü"
        />
      </motion.div>
    </motion.div>
  );
};

export default ResultsPage;