import './index.css';

import { products } from '@pixelforge/products';

export const PriceFilter = ({ maxPrice, setMaxPrice }) => {
    const highestPrice = Math.max(...products.map(product => product.price));

    return (
        <section className="price-filter">
            <h3 className="price-filter__title">Max Price</h3>

            <div className="price-filter__content">
                <input
                    type="range"
                    min="0"
                    max={highestPrice}
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    aria-label="Maximum price"
                />

                <div className="price-filter__values">
                    <span>0 kr</span>
                    <span>{maxPrice.toLocaleString('sv-SE')} kr</span>
                </div>
            </div>
        </section>
    );
};