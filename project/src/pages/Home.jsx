import { useState, useMemo } from 'react';
import { Star, Clock, ChevronRight, Flame } from 'lucide-react';
import { categories, restaurants, foodItems } from '../data/mockData';
import FoodCard from '../components/FoodCard';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'all') return foodItems;
    return foodItems.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  const bestsellers = foodItems.filter((f) => f.bestseller);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-orange-700 text-sm font-medium mb-5">
                <Flame className="w-4 h-4" />
                Authentic Indian Flavors
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-[1.1] mb-5">
                Order food from the{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  heart of India
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                From street-side chaat to royal biryanis — get your favorite
                Indian dishes delivered hot and fresh to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#menu"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                >
                  Explore Menu
                </a>
                <a
                  href="#restaurants"
                  className="px-7 py-3.5 rounded-full bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Top Restaurants
                </a>
              </div>
              <div className="flex gap-8 mt-10">
                <div>
                  <p className="text-2xl font-bold text-gray-800">500+</p>
                  <p className="text-sm text-gray-500">Dishes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">50+</p>
                  <p className="text-sm text-gray-500">Restaurants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">30 min</p>
                  <p className="text-sm text-gray-500">Avg Delivery</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80"
                  alt="Paneer Butter Masala"
                  className="rounded-2xl shadow-xl w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1743615467363-250466982515?w=400&q=80"
                  alt="Masala Dosa"
                  className="rounded-2xl shadow-xl w-full h-48 object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1559528896-c5310744cce8?w=400&q=80"
                  alt="Biryani"
                  className="rounded-2xl shadow-xl w-full h-48 object-cover -mt-4"
                />
                <img
                  src="https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=400&q=80"
                  alt="Desserts"
                  className="rounded-2xl shadow-xl w-full h-48 object-cover mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          What's on your mind?
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                document
                  .getElementById('menu')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange-400 transition-all group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bestsellers</h2>
            <p className="text-sm text-gray-500 mt-1">
              Most loved dishes this week
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {bestsellers.slice(0, 4).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section id="restaurants" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Popular Restaurants
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={r.cover}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-green-600 text-white text-sm font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  {r.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg">{r.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{r.cuisine}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {r.deliveryTime}
                  </span>
                  <span>₹{r.priceForTwo} for two</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{r.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Menu */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Explore Our Menu
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-6 scrollbar-hide">
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
          {categories.map((cat) => (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
}
