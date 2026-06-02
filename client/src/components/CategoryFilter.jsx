import { useDispatch, useSelector } from 'react-redux';
import { setCategory, selectSelectedCategory } from '../features/menu/menuSlice';
import { MENU_CATEGORIES, CATEGORY_ICONS } from '../utils/constants';

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(selectSelectedCategory);

  return (
    <div className="flex gap-4 overflow-x-auto py-4 mb-6 scrollbar-none" id="category-filter">
      {MENU_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => dispatch(setCategory(category))}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border-none cursor-pointer transition-all duration-300 ${selectedCategory === category
            ? 'bg-surface-900 text-white shadow-card shadow-surface-900/20 scale-105'
            : 'bg-white text-surface-600 hover:bg-surface-100 hover:text-surface-900 shadow-sm hover:shadow'
            }`}
          style={{
            border: selectedCategory !== category ? '1px solid var(--color-surface-200)' : '1px solid transparent',
          }}
          id={`category-${category.toLowerCase()}`}
        >
          <span className="text-base leading-none">{CATEGORY_ICONS[category]}</span>
          <span>{category}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
