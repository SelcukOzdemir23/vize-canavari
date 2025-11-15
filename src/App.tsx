import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import CustomQuizPage from './pages/CustomQuizPage';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <main className="app-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz/:mode" element={<QuizPage />} />
              <Route path="/results/:mode" element={<ResultsPage />} />
              <Route path="/quiz/custom" element={<CustomQuizPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;