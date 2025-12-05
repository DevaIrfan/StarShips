import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Hash, Users, Clock, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { starshipsApi } from '../../services/starshipsApi';
import { Starship } from '../../types/starship';

export default function AboutPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const [allShips, setAllShips] = useState<Starship[]>([]);
  const [favShips, setFavShips] = useState<Starship[]>([]);

  useEffect(() => {
    loadData();
  }, [favorites]);

  const loadData = async () => {
    const data = await starshipsApi.getAllStarships();
    setAllShips(data);

    const filtered = data.filter((s: Starship) =>
      favorites.includes(s.id.toString())
    );
    setFavShips(filtered);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* ABOUT */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="Starships Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">StarShips</h1>
              <p className="text-gray-400 font-medium">Big Ship Go Brrr...</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">About This Application</h2>
            <div className="bg-gray-900 p-6 rounded-lg mb-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                StarShips is an encyclopedia application dedicated to
                documenting the starships of the Star Wars universe. Browse
                through various vessels from different factions, learn about
                their specifications, armaments, and historical significance.
              </p>
            </div>
          </div>
        </div>

        {/* DEVELOPER INFO */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Developer Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <User className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Name</p>
                <p className="text-lg font-semibold text-white">Caesar Deva Irfan Putra</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
              <div className="bg-purple-900/30 p-3 rounded-lg">
                <Hash className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">NIM</p>
                <p className="text-lg font-semibold text-white">21120123130062</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
              <div className="bg-green-900/30 p-3 rounded-lg">
                <Users className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Group</p>
                <p className="text-lg font-semibold text-white">5</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
              <div className="bg-orange-900/30 p-3 rounded-lg">
                <Clock className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Shift</p>
                <p className="text-lg font-semibold text-white">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAVORITES SECTION */}
        <div className="bg-gray-800 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="text-red-400" size={28} />
            Favorite Starships
          </h2>

          {favShips.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400 font-medium">You have no favorite starships yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Click the heart icon on any starship to add it to your favorites!
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4">
                You have <span className="text-white font-semibold">{favShips.length}</span> favorite{' '}
                {favShips.length === 1 ? 'starship' : 'starships'}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {favShips.map((ship) => (
                  <div
                    key={ship.id}
                    onClick={() => navigate(`/detail/${ship.id}`)}
                    className="bg-gray-900 cursor-pointer hover:bg-gray-850 hover:ring-2 hover:ring-blue-500 transition-all p-4 rounded-lg border border-gray-700 group"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={ship.image ?? ""}
                        alt={ship.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {ship.name}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">{ship.faction}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}