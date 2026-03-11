import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from './components/Navbar';
import UploadPage      from './pages/UploadPage';
import DashboardPage   from './pages/DashboardPage';
import SentimentPage   from './pages/SentimentPage';
import { AspectsPage, TrendsPage, InsightsPage, CorrelationPage } from './pages/OtherPages';

// Pages that show the navbar
function WithNav({ children }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Upload — no navbar */}
        <Route path="/"         element={<UploadPage />} />

        {/* All results pages — with navbar */}
        <Route path="/dashboard"   element={<WithNav><DashboardPage /></WithNav>} />
        <Route path="/sentiment"   element={<WithNav><SentimentPage /></WithNav>} />
        <Route path="/aspects"     element={<WithNav><AspectsPage /></WithNav>} />
        <Route path="/trends"      element={<WithNav><TrendsPage /></WithNav>} />
        <Route path="/insights"    element={<WithNav><InsightsPage /></WithNav>} />
        <Route path="/correlation" element={<WithNav><CorrelationPage /></WithNav>} />


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
