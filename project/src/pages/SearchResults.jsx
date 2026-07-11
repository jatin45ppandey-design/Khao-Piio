import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { foodItems, restaurants, categories } from '../data/mockData';
import FoodCard from '../components/FoodCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const [activeCategory, setActiveCategory] = useState('all');

  const results = useMemo(() => {
    if (type === 'food') {
      const food = foodItems.find((f) => f.id === id);
      return { foods: food ? [food] : [], rests: [] };
    }
    if (type === 'restaurant') {
      const rest = restaurants.find((r) => r.id === id);
      return {
        foods: foodItems.filter((f) => f.restaurantId === id),
        rests: rest ? [rest] : [],
      };
    }
    return { foods: [], rests: [] };
  }, [type, id]);

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'all') return results.foods;
    return results.foods.filter((f) => f.category === activeCategory);
  }, [results.foods, activeCategory]);

  const availableCategories = useMemo(() => {
    const ids = new Set(results.foods.map((f) => f.category));
    return categories.filter((c) => ids.has(c.id));
  }, [results.foods]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Search className="w-5 h-5 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
      </div>

      {results.rests.length > 0 && (
        <div className="mb-8">
          {results.rests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col sm:flex-row"
            >
              <img
                src={r.cover}
                alt={r.name}
                className="w-full sm:w-64 h-44 object-cover"
              />
              <div className="p-5 flex-1">
                <h2 className="text-xl font-bold text-gray-800">{r.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{r.cuisine}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">
                    ★ {r.rating}
                  </span>
                  <span>{r.deliveryTime}</span>
                  <span>₹{r.priceForTwo} for two</span>
                  <span className="text-gray-400">{r.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredFoods.length > 0 ? (
        <>
          {availableCategories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-all ${
                  activeCategory === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                All
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No results found.</p>
        </div>
      )}
    </div>
  );
}
