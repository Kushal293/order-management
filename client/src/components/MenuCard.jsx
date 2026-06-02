import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectIsInCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const MenuCard = ({ item }) => {
  const dispatch = useDispatch();
  const isInCart = useSelector(selectIsInCart(item._id));

  const handleAddToCart = () => {
    dispatch(addToCart({ menuItem: item }));
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });
  };

  return (
    <div className="group h-full bg-white rounded-[1.25rem] border border-surface-100/80 shadow-soft hover:shadow-card hover:border-primary-100 transition-all duration-300 overflow-hidden flex flex-col relative" id={`menu-item-${item._id}`}>
      {/* Image Container with Zoom Effect */}
      <div className="relative h-48 overflow-hidden bg-surface-50">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Decorative Image Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {/* Category & Price Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-surface-900 bg-white/90 backdrop-blur-md rounded-lg shadow-sm">
            {item.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 text-sm font-black text-white bg-surface-900/80 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-primary-600 transition-colors leading-tight">
          {item.name}
        </h3>
        <p className="text-sm text-surface-500 flex-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Action Button */}
        <div className="mt-6 pt-5 border-t border-surface-100 border-dashed">
          {isInCart ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </span>
              <button
                onClick={handleAddToCart}
                className="btn btn-ghost text-sm py-2 px-4 rounded-xl text-surface-600 hover:text-primary-600 hover:bg-primary-50 shadow-sm border border-surface-200"
              >
                + Add More
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 rounded-xl shadow-md hover:shadow-glow-strong"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
