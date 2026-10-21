import { Button } from '@pixelforge/button';
import { useCartStore } from '@pixelforge/usecartstore';
import './index.css';

export const ProductCard = ({ product }) => {
    const addToCart = useCartStore((state) => state.addToCart);

    const {
        name,
        brand,
        price,
        originalPrice,
        rating,
        reviews,
        stock,
        badge,
        image
    } = product;

    const discount = originalPrice
        ? Math.round((1 - price / originalPrice) * 100)
        : null;

    const getStockStatus = () => {
        if (stock === 0) {
            return {
                text: 'Out of stock',
                className: 'product-card__stock--out'
            };
        }

        if (stock <= 5) {
            return {
                text: `Only ${stock} left`,
                className: 'product-card__stock--low'
            };
        }

        return {
            text: 'In stock',
            className: 'product-card__stock--available'
        };
    };

    const stockStatus = getStockStatus();

    return (
        <article className="product-card">
            <header className="product-card__header">
                <img
                    className="product-card__image"
                    src={image}
                    alt={name}
                />

                {(badge || discount) && (
                    <p className="product-card__badges">
                        {badge && (
                            <span className="product-card__badge">
                                {badge}
                            </span>
                        )}

                        {discount && (
                            <span className="product-card__discount">
                                -{discount}%
                            </span>
                        )}
                    </p>
                )}
            </header>

            <section className="product-card__content">
                <p className="product-card__brand">
                    {brand}
                </p>

                <h3 className="product-card__title">
                    {name}
                </h3>

                <p className="product-card__rating">
                    <span
                        className="product-card__stars"
                        aria-label={`${rating} out of 5 stars`}
                    >
                        ★★★★★
                    </span>

                    <span>{rating}</span>
                    <span>({reviews})</span>
                </p>

                <p className="product-card__price">
                    <strong>
                        {price.toLocaleString('sv-SE')} kr
                    </strong>

                    {originalPrice && (
                        <del>
                            {originalPrice.toLocaleString('sv-SE')} kr
                        </del>
                    )}
                </p>

                <p
                    className={`product-card__stock ${stockStatus.className}`}
                >
                    <span
                        className="product-card__stock-dot"
                        aria-hidden="true"
                    />
                    {stockStatus.text}
                </p>

                <footer className="product-card__footer">
                    <Button
                        text={stock === 0 ? 'Out of stock' : 'Add to cart'}
                        type="regular"
                        onClick={() => {
                            if (stock > 0) {
                                addToCart(product);
                            }
                        }}
                    />
                </footer>
            </section>
        </article>
    );
};