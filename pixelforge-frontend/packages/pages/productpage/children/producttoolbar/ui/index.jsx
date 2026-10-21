import './index.css';
import { Icon } from '@pixelforge/icon';
import { Search } from 'lucide-react';

export const ProductToolbar = ({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
}) => {
    return (
        <div className="product-toolbar">
            <label className="product-toolbar__search">
                <Icon icon={ Search } size={ 16 } />

                <input
                    type="search"
                    placeholder="Search products..."
                    aria-label="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </label>

            <select
                className="product-toolbar__sort"
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="popular">Most popular</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="rating">Highest rated</option>
                <option value="name">Name: A–Z</option>
            </select>
        </div>
    );
};