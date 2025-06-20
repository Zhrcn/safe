'use client';
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
const MedicineQuery = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/medicine/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Medicine Query</h2>
      <div className="relative mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for medicines..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {query && (
              <Button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((medicine) => (
            <div key={medicine.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">{medicine.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{medicine.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {medicine.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};
export default MedicineQuery; 