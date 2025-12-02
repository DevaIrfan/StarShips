import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OfflineIndicator } from './components/OfflineIndicator';
import { initializeOfflineSync } from './lib/supabaseClient';
import HomePage from './components/pages/HomePage';
import FactionsPage from './components/pages/FactionsPage';
import DetailPage from './components/pages/DetailPage';
import AddStarshipPage from './components/pages/AddStarshipPage';
import EditStarshipPage from './components/pages/EditStarshipPage';
import AboutPage from './components/pages/AboutPage';
import BottomNavBar from './components/pages/BottomNavBar'; // TAMBAHKAN INI

function App() {
  // Initialize offline sync once
  useEffect(() => {
    const cleanup = initializeOfflineSync();
    return cleanup; // Cleanup on unmount
  }, []);

  return (
    <Router>
      {/* Offline Indicator - akan muncul otomatis saat offline */}
      <OfflineIndicator />
      
      <div className="min-h-screen bg-gray-950">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/factions" element={<FactionsPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/add" element={<AddStarshipPage />} />
          <Route path="/edit/:id" element={<EditStarshipPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>

      {/* Bottom Navigation Bar - TAMBAHKAN INI */}
      <BottomNavBar />
    </Router>
  );
}

export default App;