import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, Info } from 'lucide-react';

export default function BottomNavBar() {
  const location = useLocation();

  const isFactionsActive = location.pathname.startsWith('/factions');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            location.pathname === '/' ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/factions"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isFactionsActive ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Shield size={24} />
          <span className="text-xs mt-1">Factions</span>
        </Link>

        <Link
          to="/about"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            location.pathname === '/about' ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Info size={24} />
          <span className="text-xs mt-1">About</span>
        </Link>
      </div>
    </nav>
  );
}