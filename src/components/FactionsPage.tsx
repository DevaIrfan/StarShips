import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { starshipsApi } from '../services/starshipsApi';
import { Starship } from '../types/starship';

import StarshipCard from './StarshipCard';
import { ImageWithFallback } from './figma/ImageWithFallback';


export default function FactionsPage() {
  const factions = ['Rebel Alliance', 'Galactic Empire', 'Galactic Republic', 'CIS'];
  const [selectedFaction, setSelectedFaction] = useState<string>('Rebel Alliance');
  const [starships, setStarships] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStarships();
  }, [selectedFaction]);

  const loadStarships = async () => {
    setLoading(true);
    const data = await starshipsApi.getStarshipsByFaction(selectedFaction);
    setStarships(data);
    setLoading(false);
  };

  const getFactionDescription = (faction: string) => {
    switch (faction) {
      case 'Rebel Alliance':
        return 'The Rebel Alliance fought against the tyranny of the Galactic Empire, using guerrilla tactics and starfighter superiority.';
      case 'Galactic Empire':
        return 'The Galactic Empire ruled the galaxy through fear and military might, deploying massive fleets of capital ships and TIE fighters.';
      case 'Galactic Republic':
        return 'The Galactic Republic defended democracy across the galaxy during the Clone Wars with advanced capital ships and Jedi starfighters.';
      case 'CIS':
        return 'The Confederacy of Independent Systems (CIS) challenged the Republic with droid armies and automated warships during the Clone Wars.';
      default:
        return '';
    }
  };

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

  const getFactionLogo = (faction: string) => {
  switch (faction) {
    case 'Rebel Alliance':
      return '/factions/rebel.svg';
    case 'Galactic Empire':
      return '/factions/empire.svg';
    case 'Galactic Republic':
      return '/factions/republic.svg';
    case 'CIS':
      return '/factions/cis.svg';
    default:
      return '/factions/default.png'; 
  }
};


  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl mb-6">Factions</h1>

        {/* Faction Selector Slide */}
        <div className="mb-8 bg-gray-800/50 rounded-lg p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {factions.map((faction) => (
              <button
                key={faction}
                onClick={() => setSelectedFaction(faction)}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  selectedFaction === faction
                    ? `bg-gradient-to-r ${getFactionColor(faction)} text-white shadow-lg scale-105`
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="mb-3 flex justify-center">
                  <ImageWithFallback 
                    src={getFactionLogo(faction)}
                    alt={`${faction} logo`}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="text-sm">{faction}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Faction Info */}
        <div className={`bg-gradient-to-r ${getFactionColor(selectedFaction)} p-8 rounded-lg mb-8 flex items-center gap-6`}>
          <div className="flex-shrink-0">
            <ImageWithFallback 
              src={getFactionLogo(selectedFaction)}
              alt={`${selectedFaction} logo`}
              className="w-24 h-24 object-contain"
            />
          </div>
          <div>
            <h2 className="text-3xl mb-3">{selectedFaction}</h2>
            <p className="text-gray-200">{getFactionDescription(selectedFaction)}</p>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : starships.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No starships found for this faction</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starships.map((starship) => (
              <StarshipCard key={starship.id} starship={starship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}