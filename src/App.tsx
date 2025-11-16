import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router basename="/vize-canavari">
      <div className="relative h-screen overflow-hidden bg-canvas-950 text-white">
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col p-4 sm:p-6">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-80"
            style={{
              inset: '-120px -180px',
              background:
                'radial-gradient(circle at 20% 15%, rgba(139, 92, 246, 0.25), transparent 60%), radial-gradient(circle at 85% 0%, rgba(59, 130, 246, 0.18), transparent 65%)',
              filter: 'blur(140px)'
            }}
          />
          <main className="relative z-10 flex flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz/:mode" element={<QuizPage />} />
              <Route path="/quiz/:mode/:week" element={<QuizPage />} />
              <Route path="/results/:mode" element={<ResultsPage />} />
            </Routes>
          </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;