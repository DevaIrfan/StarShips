import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FactionsPage from './components/FactionsPage';
import AddStarshipPage from './components/AddStarshipPage';
import DetailPage from './components/DetailPage';
import AboutPage from './components/AboutPage';
import BottomNavBar from './components/BottomNavBar';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/factions" element={<FactionsPage />} />
          <Route path="/add" element={<AddStarshipPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <BottomNavBar />
      </div>
    </Router>
  );
}