import { useEffect, useRef, useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Icon } from '@pixelforge/icon';
import { useCartStore } from '@pixelforge/usecartstore';
import { CartDropdown } from '@pixelforge/cartdropdown';
import './index.css';

export const HeaderActions = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef(null);

    const cart = useCartStore((state) => state.cart);

    const cartCount = cart.reduce(
        (total, item) => total + item.qty, 0
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                cartRef.current &&
                !cartRef.current.contains(event.target)
            ) {
                setIsCartOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className="header__actions">
            <Icon icon={Search} size={24} />

            <div className="header__cart" ref={cartRef}>
                <button
                    className="header__cart-trigger"
                    onClick={() => setIsCartOpen((prev) => !prev)}
                    aria-label={`Shopping cart, ${cartCount} items`}
                    aria-expanded={isCartOpen}
                    aria-controls="cart-dropdown"
                >
                    <Icon icon={ShoppingCart} size={24} />

                    {cartCount > 0 && (
                        <span className="header__cart-count">
                            {cartCount}
                        </span>
                    )}
                </button>

                {isCartOpen && (
                    <div id="cart-dropdown">
                        <CartDropdown
                            onClose={() => setIsCartOpen(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};