import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore, type Question } from '../store/quizStore';
import QuestionCard from '../components/QuestionCard';
import { normalizeQuestionArray } from '../utils/normalizeQuestion';

const QuizPage = () => {
  const { mode, week } = useParams<{ mode: string; week?: string }>();
  const navigate = useNavigate();
  const { 
    currentQuiz, 
    initializeQuiz, 
    addAnswer,
    userSession
  } = useQuizStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const modeLabels: Record<string, string> = {
    standard: 'Rastgele Test',
    'mistake-bank': 'Yanlışlarım',
    week: 'Hafta'
  };
  
  // Load questions based on mode
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}sorular.json`);
        const rawQuestions = await response.json();
        const allQuestions = normalizeQuestionArray(rawQuestions);
        
        let questions: Question[] = [];
        
        switch (mode) {
          case 'standard':
            {
              // Rastgele test: 4 Kolay, 4 Orta, 2 Zor (topla 10 soru)
              const kolaySorular = allQuestions.filter(q => q.zorluk === 'Kolay');
              const ortaSorular = allQuestions.filter(q => q.zorluk === 'Orta');
              const zorSorular = allQuestions.filter(q => q.zorluk === 'Zor');
              
              const seciliKolay = kolaySorular
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);
              const seciliOrta = ortaSorular
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);
              const seciliZor = zorSorular
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
              
              // Tüm soruları karıştır
              questions = [...seciliKolay, ...seciliOrta, ...seciliZor]
                .sort(() => Math.random() - 0.5);
            }
            break;
            
          case 'mistake-bank':
            {
              // Yanlış bankasındaki tüm soruları getir ve karıştır
              const mistakeBankIds = userSession.mistakeBank.map(id => id.toString());
              questions = allQuestions
                .filter((q) => mistakeBankIds.includes(q.id))
                .sort(() => Math.random() - 0.5);
            }
            break;
            
          case 'week':
            if (week) {
              // Haftaya göre tüm soruları getir ve karıştır
              questions = allQuestions
                .filter((q) => q.id.startsWith(`eay_${week}_`))
                .sort(() => Math.random() - 0.5);
              
              console.log(`Hafta ${week}: ${questions.length} soru bulundu`);
            }
            break;
            
          default:
            // Default durumda rastgele 10 soru
            questions = allQuestions
              .sort(() => Math.random() - 0.5)
              .slice(0, 10);
        }
        
        initializeQuiz(questions, mode || 'standard');
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    
    // Mode veya week değiştiğinde her zaman yeni quiz yükle
    loadQuestions();
  }, [mode, week]); // mistakeBank'ı kaldırdık - sadece mode/week değişince yüklensin
  
  // Reset next button visibility when question changes
  useEffect(() => {
    setShowNextButton(false);
  }, [currentQuestionIndex]);
  
  const handleAnswer = (questionId: string, selectedIndex: number) => {
    addAnswer(questionId, selectedIndex);
    // Show next button INSTANTLY
    setShowNextButton(true);
  };
  
  const handleNext = () => {
    if (!currentQuiz) return;
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished
      navigate(`/results/${mode}`);
    }
  };
  

  
  if (!currentQuiz) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-transparent p-8">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-linear-to-r from-primary-500 to-accent-400 blur-2xl opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-accent-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <motion.span
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                📚
              </motion.span>
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <motion.p
              className="text-lg font-bold text-text-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Sorular yükleniyor...
            </motion.p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  const totalQuestions = currentQuiz.questions.length;
  const streakCount = userSession.streak.count;
  const activeMode = mode ?? currentQuiz.mode;
  let modeLabel = modeLabels[activeMode] ?? 'Quiz Modu';
  
  if (activeMode === 'week' && week) {
    modeLabel = `${week}. Hafta`;
  }
  
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <motion.div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-surface-900/90 to-surface-800/80 p-8 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ boxShadow: 'var(--shadow-xl)' }}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="text-5xl" aria-hidden>
            📭
          </span>
          <p className="max-w-md text-base leading-relaxed text-white/80">
            Bu mod için planlanan soru bulunamadı. Yeni bir test oluşturmayı dene veya ana menüye dön.
          </p>
          <motion.button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-400 to-secondary-400 px-6 py-3 text-base font-bold text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ boxShadow: 'var(--shadow-glow-primary)' }}
          >
            <span>🏠</span>
            <span>Ana Menü</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="relative flex h-full w-full flex-col overflow-hidden bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-full flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/')}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-secondary transition-all hover:scale-110"
              style={{ boxShadow: 'var(--shadow-sm)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Ana Sayfa"
            >
              <span className="text-lg">🏠</span>
            </motion.button>
            <div className="rounded-lg bg-primary-500 px-3 py-1.5">
              <span className="text-sm font-bold text-white">{currentQuestionIndex + 1}/{totalQuestions}</span>
            </div>
            <span className="text-sm font-medium text-text-secondary">{modeLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🔥</span>
            <span className="font-bold text-text-primary">{streakCount}</span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-tertiary">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-primary-500 to-accent-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="relative mt-4 flex flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              className="flex w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showNextButton && (
            <motion.button
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary-500 to-accent-400 py-4 text-lg font-black uppercase tracking-wide text-white sm:w-auto sm:self-end sm:px-12"
              style={{ boxShadow: 'var(--shadow-lg)' }}
              onClick={handleNext}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Devam' : 'Bitir'}</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? '→' : '✓'}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuizPage;