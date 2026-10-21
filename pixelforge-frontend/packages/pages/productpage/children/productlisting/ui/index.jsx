import './index.css';
import { ProductCard } from '@pixelforge/productcard';

export const ProductListing = ({ products }) => {
    if (products.length === 0) {
        return (
            <div className="product-listing__empty">
                <h2>No products found</h2>
                <p>Try adjusting your search or filters.</p>
            </div>
        );
    }
    
    return (
        <div className="product-listing">
            {
                products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))
            }
        </div>
    );
};