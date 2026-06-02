import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMenu,
  selectMenuItems,
  selectMenuLoading,
  selectMenuError,
  selectSelectedCategory,
} from '../features/menu/menuSlice';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MenuPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectMenuItems);
  const loading = useSelector(selectMenuLoading);
  const error = useSelector(selectMenuError);
  const selectedCategory = useSelector(selectSelectedCategory);

  useEffect(() => {
    dispatch(fetchMenu(selectedCategory));
  }, [dispatch, selectedCategory]);

  return (
    <div className="page">
      <div className="container">
        {/* Premium Hero Section */}
        <div className="mb-10 pt-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-900 px-8 py-14 md:px-16 md:py-20 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-gradient-to-l from-primary-500/20 to-transparent blur-3xl rounded-full transform rotate-12 mix-blend-screen" />
              <div className="absolute -bottom-[30%] -left-[10%] w-[40%] h-[100%] bg-gradient-to-r from-accent-500/20 to-transparent blur-3xl rounded-full transform -rotate-12 mix-blend-screen" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-full mb-6 shadow-glow">
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                  Now Delivering Hot & Fresh
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  Taste the magic of
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 drop-shadow-sm mt-2">
                    exceptional food.
                  </span>
                </h1>
                <p className="text-surface-300 text-base md:text-lg max-w-md font-medium leading-relaxed mb-4">
                  Discover a curated menu of handcrafted dishes, prepared with premium ingredients and delivered directly to your door in minutes.
                </p>
              </div>

              {/* Visual Decorative Grid */}
              <div className="hidden md:flex justify-end relative">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-full blur-2xl animate-pulse-soft" />
                  <div className="relative z-10 w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                    <span className="text-9xl filter drop-shadow-xl">🍔</span>
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transform -rotate-12 shadow-xl">
                    <span className="text-4xl">🍕</span>
                  </div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transform rotate-12 shadow-xl">
                    <span className="text-3xl">🥤</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter />
        </div>

        {/* Menu Grid */}
        {loading ? (
          <LoadingSpinner message="Loading delicious items..." />
        ) : error ? (
          <EmptyState
            icon="😕"
            title="Oops! Something went wrong"
            message={error}
            action={
              <button
                onClick={() => dispatch(fetchMenu(selectedCategory))}
                className="btn btn-primary"
              >
                Try Again
              </button>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No items found"
            message={`No ${selectedCategory !== 'All' ? selectedCategory.toLowerCase() + ' ' : ''}items available right now. Check back soon!`}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-surface-900">
                {selectedCategory === 'All' ? 'All Items' : selectedCategory}
                <span className="text-surface-400 font-normal ml-2 text-base">
                  ({items.length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
