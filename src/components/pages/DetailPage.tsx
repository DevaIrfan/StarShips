import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Building2, Layers, Crosshair } from 'lucide-react';
import { starshipsApi } from '../../services/starshipsApi';
import { Starship } from '../../types/starship';
import { useFavorites } from '../../hooks/useFavorites';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [starship, setStarship] = useState<Starship | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadStarship();
  }, [id]);

  const loadStarship = async () => {
    if (id) {
      setLoading(true);
      const data = await starshipsApi.getStarshipById(id);
      setStarship(data);
      setLoading(false);
    }
  };

  const getFactionColor = (faction: string | null) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 font-medium">Loading starship details...</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${starship?.name}?`)) return;

    try {
      await starshipsApi.deleteStarship(String(starship?.id));
      alert("Starship deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete starship");
    }
  };

  if (!starship) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto text-center py-16">
          <p className="text-gray-400 text-xl font-medium mb-4">Starship not found</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="flex gap-3">
            <Link
              to={`/edit/${starship.id}`}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold transition-colors shadow-lg hover:shadow-blue-500/50">
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-semibold transition-colors shadow-lg hover:shadow-red-500/50">
              Delete
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-96 md:h-auto">
              {/* Favorite button - LEFT SIDE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(starship.id.toString());
                }}
                className="absolute top-4 left-4 z-50 p-2 cursor-pointer hover:scale-110 transition-transform"
              >
                {isFavorite(starship.id.toString()) ? (
                  <Heart
                    size={35}
                    strokeWidth={2.5}
                    className="text-red-500 drop-shadow-md transition-transform duration-200 scale-110"
                    fill="red"
                  />
                ) : (
                  <Heart
                    size={35}
                    strokeWidth={2.5}
                    className="text-white drop-shadow-md transition-transform duration-200"
                    fill="white"
                  />
                )}
              </button>

              {/* Faction badge - RIGHT SIDE */}
              <div
                className={`absolute top-4 right-4 bg-gradient-to-br ${getFactionColor(
                  starship.faction
                )} px-4 py-2 rounded-lg shadow-lg`}
              >
                <span className="text-sm text-white font-semibold">{starship.faction}</span>
              </div>

              {/* Image */}
              <img
                src={starship.image ?? ""}
                alt={starship.name}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Info */}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{starship.name}</h1>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 className="text-blue-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Corporation</p>
                    <p className="text-gray-200 font-medium">{starship.corporation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Layers className="text-purple-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Ship Class</p>
                    <p className="text-gray-200 font-medium">{starship.shipClass}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-blue-400" size={20} />
                    <span className="text-sm text-gray-400 font-medium">Shield Points</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{starship.shieldPoints ?? 0}</p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="text-red-400" size={20} />
                    <span className="text-sm text-gray-400 font-medium">Hull Points</span>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{starship.hullPoints ?? 0}</p>
                </div>
              </div>

              {/* Total Combat Power */}
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-4 rounded-lg border border-yellow-700">
                <p className="text-sm text-yellow-300 font-semibold mb-1">Total Combat Power</p>
                <p className="text-3xl font-bold text-yellow-400">{(starship.shieldPoints ?? 0) + (starship.hullPoints ?? 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-gray-300 leading-relaxed">{starship.description}</p>
        </div>

        {/* Armaments */}
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Crosshair className="text-red-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Armaments</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {(starship.armaments ?? '')
              .split(',')
              .filter(a => a.trim() !== '')
              .map((arm, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-500 hover:bg-gray-850 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-red-900/30 p-2 rounded-lg mt-1">
                      <Crosshair className="text-red-400" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Weapon #{index + 1}</p>
                      <p className="text-gray-200 font-medium">{arm.trim()}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}