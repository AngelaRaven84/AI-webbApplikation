import './index.css';

import { products } from '@pixelforge/products';

export const BrandFilter = ({
    selectedBrands,
    setSelectedBrands
}) => {
    const brands = [...new Set(products.map(product => product.brand))]
        .sort((a, b) => a.localeCompare(b));

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(item => item !== brand)
                : [...prev, brand]
        );
    };

    return (
        <section className="brand-filter">
            <h3 className="brand-filter__title">Brand</h3>

            <div className="brand-filter__options">
                {brands.map(brand => (
                    <label
                        key={brand}
                        className="brand-filter__option"
                    >
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                        />

                        <span>{brand}</span>
                    </label>
                ))}
            </div>
        </section>
    );
};