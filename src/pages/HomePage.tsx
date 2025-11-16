import React from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import ModeButton from '../components/ModeButton';

const HomePage = () => {
  const { userSession } = useQuizStore();
  const mistakeBankCount = userSession.mistakeBank.length;

  const totalQuestionsStudied = Object.keys(userSession.reviewSchedule).length;
  const levelBreak = 25;
  const currentLevel = totalQuestionsStudied > 0 ? Math.floor(totalQuestionsStudied / levelBreak) + 1 : 1;

  return (
    <motion.section
      className="relative flex h-full w-full flex-col overflow-y-auto rounded-3xl bg-linear-to-br from-gray-50 via-white to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Simple header */}
      <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/SelcukOzdemir23/vize-canavari"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="GitHub"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/muserref-selcuk-ozdemir/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="LinkedIn"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
        <p className="hidden text-xs text-gray-500 sm:block">
          Müşerref Selçuk Özdemir
        </p>
      </header>

      {/* Hero section - compact */}
      <div className="flex flex-col items-center gap-4 border-b border-gray-200 bg-white px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/logo.png"
              alt="Vize Canavarı"
              className="h-16 w-16 rounded-xl sm:h-20 sm:w-20"
            />
          </motion.div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Vize Canavarı
            </h1>
            {totalQuestionsStudied > 0 && (
              <motion.div
                className="mt-1 flex flex-col items-center gap-1 text-xs sm:flex-row sm:gap-3 sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="font-semibold text-primary-600">{totalQuestionsStudied} soru çözüldü</span>
                <span className="hidden text-gray-400 sm:inline">•</span>
                <span className="font-semibold text-primary-600">Seviye {currentLevel}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main content - centered and prominent */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <WeekSelector mistakeBankCount={mistakeBankCount} />
      </div>
    </motion.section>
  );
};

interface WeekSelectorProps {
  mistakeBankCount: number;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ mistakeBankCount }) => {
  const [weeks, setWeeks] = React.useState<Array<{ week: number; count: number }>>([]);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    fetch('/sorular.json')
      .then(res => res.json())
      .then(questions => {
        const weekMap = new Map<number, number>();
        questions.forEach((q: any) => {
          const match = q.id?.match(/^eay_(\d+)_/);
          if (match) {
            const weekNum = parseInt(match[1]);
            weekMap.set(weekNum, (weekMap.get(weekNum) || 0) + 1);
          }
        });
        const weekList = Array.from(weekMap.entries())
          .map(([week, count]) => ({ week, count }))
          .sort((a, b) => a.week - b.week);
        setWeeks(weekList);
      });
  }, []);

  const weekEmojis = ['📘', '📗', '📙', '📚', '📕', '📔', '📓', '📒'];
  const weekDescriptions: Record<number, string> = {
    1: 'Bilimin temelleri',
    3: 'Paradigma & Değişkenler',
    4: 'Hipotez & Konu seçimi',
    5: 'Evren & Örnekleme',
    7: 'Amaçlı Örnekleme'
  };

  return (
    <>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Quick actions - Prominent */}
        <motion.div
          className="rounded-2xl border-2 border-primary-200 bg-white p-4 shadow-lg sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 text-center text-lg font-bold text-gray-900 sm:mb-5 sm:text-xl">🎯 Hızlı Başlat</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ModeButton to="/quiz/standard" title="🎲 Rastgele Test" description="Tüm haftalardan 10 soru" />
            <ModeButton
              to="/quiz/mistake-bank"
              title="❌ Yanlışlarım"
              description={mistakeBankCount > 0 ? `${mistakeBankCount} hata` : "Hata bankası boş"}
              disabled={mistakeBankCount === 0}
              badge={mistakeBankCount}
            />
          </div>
        </motion.div>

        {/* Week selector - Prominent */}
        <motion.div
          className="rounded-2xl border-2 border-primary-200 bg-white p-4 shadow-lg sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:mb-5 sm:flex-row sm:gap-3">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">📚 Haftalara Göre</h2>
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700 sm:px-3 sm:py-1 sm:text-sm">
              {weeks.length} hafta
            </span>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="group flex w-full items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-linear-to-r from-gray-50 to-white px-4 py-3 text-left transition-all hover:border-primary-300 hover:shadow-md sm:gap-4 sm:px-6 sm:py-4"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-xl shadow-md sm:h-14 sm:w-14 sm:text-2xl">
                📅
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 sm:text-base">Hafta Seçin</span>
                <span className="text-xs text-gray-600 sm:text-sm">Belirli bir haftadan soru çöz</span>
              </div>
            </div>
            <svg className="h-6 w-6 text-primary-500 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>

      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 sm:max-h-[80vh] sm:p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 sm:mb-5 sm:pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Hafta Seçin</h2>
                <p className="hidden text-sm text-gray-500 sm:block">Çalışmak istediğiniz haftayı seçin</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {weeks.map(({ week, count }) => (
                <ModeButton
                  key={week}
                  to={`/quiz/week/${week}`}
                  title={`${weekEmojis[(week - 1) % weekEmojis.length]} ${week}. Hafta`}
                  description={weekDescriptions[week] || `${count} soru`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default HomePage;