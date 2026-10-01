import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ApplicationPage } from './pages/ApplicationPage';
import { DecisionPage } from './pages/DecisionPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ThanksPage } from './pages/ThanksPage';
import { ResultsPage } from './pages/ResultsPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ApplicationPage />} />
          <Route path="/decision" element={<DecisionPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/thanks" element={<ThanksPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
