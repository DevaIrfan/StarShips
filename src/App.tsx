import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import FactionsPage from './components/pages/FactionsPage';
import AddStarshipPage from './components/pages/AddStarshipPage';
import DetailPage from './components/pages/DetailPage';
import AboutPage from './components/pages/AboutPage';
import BottomNavBar from './components/pages/BottomNavBar';
import EditStarshipPage from "./components/pages/EditStarshipPage";

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
          <Route path="/edit/:id" element={<EditStarshipPage />} />
        </Routes>
        <BottomNavBar />
      </div>
    </Router>
  );
}