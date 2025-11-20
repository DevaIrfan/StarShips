import { Link } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';
import { starshipsApi } from '../services/starshipsApi';
import { Starship } from '../types/starship';

interface StarshipCardProps {
  starship: Starship;
}

export default function StarshipCard({ starship }: StarshipCardProps) {
  const getFactionColor = (faction: string) => {
    switch (faction) {
      case 'Rebel Alliance':
        return 'from-red-600 to-orange-600';
      case 'Galactic Empire':
        return 'from-gray-700 to-gray-900';
      case 'Galactic Republic':
        return 'from-blue-600 to-cyan-600';
      case 'CIS':
        return 'from-blue-800 to-blue-950';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <Link to={`/detail/${starship.id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all transform hover:scale-105 cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={starship.image ?? ""}
            alt={starship.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className={`absolute top-0 right-0 bg-gradient-to-br ${getFactionColor(starship.faction ?? "")} px-3 py-1 text-xs rounded-bl-lg`}>
            {starship.faction}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="mb-2">{starship.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{starship.shipClass}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-blue-400">
              <Shield size={16} />
              <span>{starship.shieldPoints}</span>
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <Heart size={16} />
              <span>{starship.hullPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
