import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { starshipsApi } from '../../services/starshipsApi';
import { Starship } from '../../types/starship';

import StarshipCard from './StarshipCard';

export default function HomePage() {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [filteredStarships, setFilteredStarships] = useState<Starship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    loadStarships();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, starships]);

  const loadStarships = async () => {
    setLoading(true);
    const data = await starshipsApi.getAllStarships();
    setStarships(data);
    setFilteredStarships(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setFilteredStarships(starships);
    } else {
      const results = await starshipsApi.searchStarships(searchQuery);
      setFilteredStarships(results);
    }
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredStarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStarships = filteredStarships.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <img
                src="/logo.svg"   
                alt="Starships Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                StarShips
              </h1>
              <p className="text-gray-400 text-sm">
                Big Ship Go Brrr...
              </p>
            </div>
          </div>
          <Link
            to="/add"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/50"
          >
            <Plus size={20} />
            <span>Add Ship</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search starships by name, faction, corporation, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 font-medium">Loading starships...</p>
          </div>
        ) : currentStarships.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl font-medium">
              No starships found
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredStarships.length)}</span> of{' '}
                <span className="text-white font-semibold">{filteredStarships.length}</span> starships
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentStarships.map((starship) => (
                <StarshipCard key={starship.id} starship={starship} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <span className="text-white font-semibold bg-gray-800 px-4 py-2 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}