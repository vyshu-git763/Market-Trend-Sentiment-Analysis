import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from './components/Navbar';
import UploadPage      from './pages/UploadPage';
import DashboardPage   from './pages/DashboardPage';
import SentimentPage   from './pages/SentimentPage';
import AspectsPage  from "./pages/AspectsPage";
import TrendsPage from "./pages/TrendsPage";
import InsightsPage from "./pages/InsightsPage";
import CorrelationPage from "./pages/CorrelationPage";

function WithNav({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/"         element={<UploadPage />} />

        
        <Route path="/dashboard"   element={<WithNav><DashboardPage /></WithNav>} />
        <Route path="/sentiment"   element={<WithNav><SentimentPage /></WithNav>} />
        <Route path="/aspects"     element={<WithNav><AspectsPage /></WithNav>} />
        <Route path="/trends"      element={<WithNav><TrendsPage /></WithNav>} />
        <Route path="/insights"    element={<WithNav><InsightsPage /></WithNav>} />
        <Route path="/correlation" element={<WithNav><CorrelationPage /></WithNav>} />


        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
