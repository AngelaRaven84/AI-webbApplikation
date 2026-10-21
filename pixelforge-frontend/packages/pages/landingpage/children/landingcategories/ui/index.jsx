import { categories } from '@pixelforge/categories';
import { CategoryCard } from '@pixelforge/categorycard';
import './index.css';

export const LandingCategories = () => {
    return (
        <section className="landing-categories wrapper">
            <h2 className="landing-categories__title">
                Browse by category
            </h2>

            <div className="landing-categories__grid">
                {
                    categories.map(category => {
                        return <CategoryCard
                            key={category.slug}
                            category={category}
                        />
                    })
                }
            </div>
        </section>
    )
}
