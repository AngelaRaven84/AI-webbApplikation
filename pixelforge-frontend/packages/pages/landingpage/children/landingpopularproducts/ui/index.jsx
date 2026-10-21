import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@pixelforge/productcard';
import { fetchProducts } from '@pixelforge/api';
import './index.css';

export const LandingPopularProducts = () => {
    const {
        data: products = [],
        isPending,
        isError,
        error
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    const popularProducts = products
        .filter(product => product.popular)
        .slice(0, 8);

    if (isPending) return <p>Loading products...</p>;
    if (isError) return <p>{error.message}</p>;

    return (
        <section className="landing-popular wrapper">
            <div className="landing-popular__header">
                <div className="landing-popular__heading">
                    <h2 className="landing-popular__title">
                        Popular right now
                    </h2>

                    <p className="landing-popular__description">
                        What other gamers are buying
                    </p>
                </div>

                <Link
                    className="landing-popular__link"
                    to="/products"
                >
                    View all
                    <span aria-hidden="true">›</span>
                </Link>
            </div>

            <div className="landing-popular__products">
                {popularProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
};