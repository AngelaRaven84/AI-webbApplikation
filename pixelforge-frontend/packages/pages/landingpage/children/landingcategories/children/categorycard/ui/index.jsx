import { Icon } from '@pixelforge/icon';
import { useNavigate } from 'react-router-dom';
import './index.css';

export const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    return (
        <article 
            className="category-card"
            onClick={ () => navigate(`/products?category=${category.slug}`) }
        >
            <Icon 
                icon={ category.icon }
                size={ 24 }
            />

            <h3 className="category-card__title">
                {category.name}
            </h3>

            <p className="category-card__description">
                {category.description}
            </p>
        </article>
    );
};