import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import ModeButton from '../components/ModeButton';
import StreakIndicator from '../components/StreakIndicator';

const HomePage = () => {
  const { userSession } = useQuizStore();
  const mistakeBankCount = userSession.mistakeBank.length;

  const today = new Date().toISOString().split('T')[0];
  const reviewCount = Object.values(userSession.reviewSchedule).filter(
    item => new Date(item.dueDate).toISOString().split('T')[0] <= today
  ).length;

  const totalQuestionsStudied = Object.keys(userSession.reviewSchedule).length;
  const levelBreak = 25;
  const currentLevel = totalQuestionsStudied > 0 ? Math.floor(totalQuestionsStudied / levelBreak) + 1 : 1;
  const nextLevelMilestone = currentLevel * levelBreak;
  const progressToNextLevel = totalQuestionsStudied > 0 ? Math.min(1, totalQuestionsStudied / nextLevelMilestone) : 0;
  const questionsToNextLevel = Math.max(0, nextLevelMilestone - totalQuestionsStudied);

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="header">
        <StreakIndicator count={userSession.streak.count} />
      </div>

      <motion.div
        className="home-hero"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <img src="/logo.png" alt="Vize Canavarı Logo" className="home-logo" />
        <h1 className="app-title">Vize Canavarı</h1>
        <p className="app-tagline">
          Serini koru, hata bankanı temizle ve akıllı tekrar ile vizelere hazır ol.
        </p>
      </motion.div>

      {totalQuestionsStudied > 0 && (
        <motion.div
          className="study-stats"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="study-stat-line">
            <span aria-hidden="true" className="study-stat-icon">📚</span>
            <div className="study-stat-copy">
              <span className="study-stat-emphasis">{totalQuestionsStudied}</span> soru çözüldü
            </div>
          </div>
          <div className="study-progress" aria-hidden="true">
            <div className="study-progress-bar">
              <div className="study-progress-fill" style={{ width: `${Math.max(progressToNextLevel * 100, 8)}%` }} />
            </div>
            <span className="study-progress-label">
              Seviye {currentLevel} · {questionsToNextLevel === 0 ? 'Yeni seviye açıldı!' : `${questionsToNextLevel} soru sonra seviye atla`}
            </span>
          </div>
        </motion.div>
      )}

      <motion.div
        className="mode-buttons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ModeButton to="/quiz/standard" title="🎲 Rastgele Test" />
        <ModeButton
          to="/quiz/mistake-bank"
          title="❌ Yanlışlarım"
          disabled={mistakeBankCount === 0}
        />
        <ModeButton
          to="/quiz/smart-review"
          title="🧠 Akıllı Tekrar"
          badge={reviewCount}
          disabled={reviewCount === 0}
        />
        <ModeButton to="/quiz/custom" title="⚙️ Özel Test" />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;