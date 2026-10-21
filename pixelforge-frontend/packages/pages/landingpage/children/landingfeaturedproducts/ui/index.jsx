import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@pixelforge/productcard';
import { fetchProducts } from '@pixelforge/api';
import './index.css';

export const LandingFeaturedProducts = () => {
    const {
        data: products = [],
        isPending,
        isError,
        error
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    const featuredProducts = products
        .filter(product => product.featured)
        .slice(0, 6);

    if (isPending) return <p>Loading products...</p>;
    if (isError) return <p>{error.message}</p>;

    return (
        <section className="landing-featured wrapper">
            <div className="landing-featured__header">
                <div className="landing-featured__heading">
                    <h2 className="landing-featured__title">
                        Featured products
                    </h2>

                    <p className="landing-featured__description">
                        Hand-picked by our hardware team
                    </p>
                </div>

                <Link
                    className="landing-featured__link"
                    to="/products"
                >
                    View all
                    <span aria-hidden="true">›</span>
                </Link>
            </div>

            <div className="landing-featured__products">
                {featuredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
};