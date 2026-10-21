import './index.css';

import { CategoryFilter } from '@pixelforge/categoryfilter';
import { BrandFilter } from '@pixelforge/brandfilter';
import { PriceFilter } from '@pixelforge/pricefilter';

export const ProductFilters = ({
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    setSelectedBrands,
    maxPrice,
    setMaxPrice
}) => {
    return (
        <div className="product-filters">
            <h2 className="product-filters__title">Filters</h2>

            <CategoryFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <BrandFilter 
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
            />
            
            <PriceFilter
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
            />
        </div>
    );
};