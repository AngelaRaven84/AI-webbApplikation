import './index.css';
import { categories } from '@pixelforge/categories';

export const CategoryFilter = ({
    selectedCategory,
    setSelectedCategory
}) => {
    return (
        <section className="category-filter">
            <h3 className="category-filter__title">
                Category
            </h3>

            <div className="category-filter__options">
                <button
                    type="button"
                    className={`category-filter__option ${
                        selectedCategory === 'All Products' ? 'category-filter__option--active' : ''
                    }`}
                    onClick={() => setSelectedCategory('All Products')}
                >
                    All Products
                </button>

                {categories.map(category => (
                    <button
                        key={category.id}
                        type="button"
                        className={`category-filter__option ${
                            selectedCategory === category.name ? 'category-filter__option--active' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </section>
    );
};