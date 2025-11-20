import { Link } from 'react-router-dom';
import { ArrowLeft, User, Hash, Users, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            {/* Logo Template */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <img
                src="/logo.svg"   
                alt="Starships Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl mb-2">StarShips</h1>
              <p className="text-gray-400">Big Ship Go Brrr...</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl mb-4">About This Application</h2>
            <div className="bg-gray-900 p-6 rounded-lg mb-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                {/* Description placeholder - user will fill this */}
                StarShips is an encyclopedia application dedicated to documenting the starships of the Star Wars universe. 
                Browse through various vessels from different factions, learn about their specifications, armaments, and historical significance.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl mb-6">Developer Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <User className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg">Caesar Deva Irfan Putra</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="bg-purple-900/30 p-3 rounded-lg">
                <Hash className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">NIM</p>
                <p className="text-lg">21120123130062</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="bg-green-900/30 p-3 rounded-lg">
                <Users className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Group</p>
                <p className="text-lg">5</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="bg-orange-900/30 p-3 rounded-lg">
                <Clock className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Shift</p>
                <p className="text-lg">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-800 rounded-lg p-8 mt-8">
          <h2 className="text-2xl mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg mb-2 text-blue-400">🔍 Search & Filter</h3>
              <p className="text-sm text-gray-400">Search through all starships by name, faction, corporation, or class</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg mb-2 text-purple-400">🛡️ Faction Browser</h3>
              <p className="text-sm text-gray-400">Browse starships organized by their allegiance and faction</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg mb-2 text-green-400">➕ Add Starships</h3>
              <p className="text-sm text-gray-400">Contribute to the database by adding new starships</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg mb-2 text-orange-400">📊 Detailed Stats</h3>
              <p className="text-sm text-gray-400">View comprehensive specifications and combat statistics</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 mt-8 border border-gray-700">
          <h2 className="text-2xl mb-6">Technology Stack</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300">React JS</span>
            <span className="px-4 py-2 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300">JavaScript</span>
            <span className="px-4 py-2 bg-purple-900/30 border border-purple-700 rounded-lg text-purple-300">Vite</span>
            <span className="px-4 py-2 bg-cyan-900/30 border border-cyan-700 rounded-lg text-cyan-300">Tailwind CSS</span>
            <span className="px-4 py-2 bg-green-900/30 border border-green-700 rounded-lg text-green-300">PWA</span>
            <span className="px-4 py-2 bg-orange-900/30 border border-orange-700 rounded-lg text-orange-300">Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
