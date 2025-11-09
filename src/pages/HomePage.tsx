import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import ModeButton from '../components/ModeButton';
import StreakIndicator from '../components/StreakIndicator';

const HomePage = () => {
  const { userSession } = useQuizStore();
  const mistakeBankCount = userSession.mistakeBank.length;
  
  // Count items due for review
  const today = new Date().toISOString().split('T')[0];
  const reviewCount = Object.values(userSession.reviewSchedule).filter(
    item => new Date(item.dueDate).toISOString().split('T')[0] <= today
  ).length;

  // Calculate total questions studied
  const totalQuestionsStudied = Object.keys(userSession.reviewSchedule).length;

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header">
        <StreakIndicator count={userSession.streak.count} />
      </div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ marginBottom: '1rem' }}
      >
        <img 
          src="/logo.png" 
          alt="Vize Canavarı Logo" 
          style={{ width: 'clamp(6rem, 15vw, 10rem)', height: 'clamp(6rem, 15vw, 10rem)', margin: '0 auto', display: 'block', filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))' }}
        />
      </motion.div>

      <motion.h1 
        className="app-title"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300,
          damping: 15
        }}
      >
        Vize Canavarı
      </motion.h1>
      
      {totalQuestionsStudied > 0 && (
        <motion.div 
          className="study-stats"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>📚</span>
            <span>Şu ana kadar <strong style={{ color: '#6366f1' }}>{totalQuestionsStudied}</strong> soru çalışıldı</span>
          </p>
        </motion.div>
      )}
      
      <motion.div 
        className="mode-buttons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
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
      
      <motion.div 
        className="learning-tips"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3>💡 Öğrenme İpuçları</h3>
        <ul className="tips-list">
          <li>Günlük tekrar, bilgiyi kalıcı hale getirir</li>
          <li>Yanlış yaptığın soruları tekrar çöz</li>
          <li>Zorlandığın konulara odaklan</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;