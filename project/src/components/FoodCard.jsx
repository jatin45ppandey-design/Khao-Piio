import { Plus, Star, Leaf, Drumstick } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getRestaurantById } from '../data/mockData';

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const restaurant = getRestaurantById(food.restaurantId);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
              food.isVeg
                ? 'bg-green-50/90 text-green-700 border border-green-200'
                : 'bg-red-50/90 text-red-700 border border-red-200'
            }`}
          >
            {food.isVeg ? (
              <Leaf className="w-3 h-3" />
            ) : (
              <Drumstick className="w-3 h-3" />
            )}
            {food.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
        {food.bestseller && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-400/90 text-amber-950 backdrop-blur-sm">
            Bestseller
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 leading-tight">
            {food.name}
          </h3>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-md shrink-0">
            <Star className="w-3 h-3 fill-green-600 text-green-600" />
            <span className="text-xs font-semibold text-green-700">
              {food.rating}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {food.description}
        </p>
        <p className="text-xs text-gray-400 mb-3">{restaurant?.name}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800">
            ₹{food.price}
          </span>
          <button
            onClick={() => addToCart(food)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 font-semibold text-sm hover:bg-orange-500 hover:text-white transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
