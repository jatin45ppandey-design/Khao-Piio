import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { foodItems, restaurants } from '../data/mockData';

export default function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return { foods: [], rests: [] };
    const q = query.toLowerCase();
    return {
      foods: foodItems
        .filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q)
        )
        .slice(0, 5),
      rests: restaurants
        .filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.cuisine.toLowerCase().includes(q)
        )
        .slice(0, 3),
    };
  }, [query]);

  const hasResults = results.foods.length > 0 || results.rests.length > 0;

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for dishes or restaurants..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-orange-50/80 border border-orange-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {focused && query.trim() && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {hasResults ? (
            <>
              {results.foods.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-1.5">
                    Dishes
                  </p>
                  {results.foods.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        onNavigate?.('food', f.id);
                        setQuery('');
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-orange-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {f.name}
                        </p>
                        <p className="text-xs text-gray-500">₹{f.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.rests.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-1.5">
                    Restaurants
                  </p>
                  {results.rests.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onNavigate?.('restaurant', r.id);
                        setQuery('');
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-orange-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={r.cover}
                        alt={r.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {r.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {r.cuisine}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
