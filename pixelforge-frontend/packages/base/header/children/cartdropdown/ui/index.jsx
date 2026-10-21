import { useCartStore } from '@pixelforge/usecartstore';
import { Minus, Plus, X } from 'lucide-react';
import './index.css';

export const CartDropdown = ({ onClose }) => {
    const cart = useCartStore((state) => state.cart);
    const addToCart = useCartStore((state) => state.addToCart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);

    const cartCount = cart.reduce(
        (total, item) => total + item.qty, 0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.qty, 0
    );

    return (
        <div className="cart-dropdown">
            <header className="cart-dropdown__header">
                <h3>Your cart ({cartCount})</h3>

                <button onClick={onClose} aria-label="Close cart">
                    <X size={18} />
                </button>
            </header>

            {cart.length === 0 ? (
                <p className="cart-dropdown__empty">
                    Your cart is empty.
                </p>
            ) : (
                <>
                    <div className="cart-dropdown__items">
                        {cart.map((item) => (
                            <article
                                className="cart-dropdown__item"
                                key={item.productId}
                            >
                                <img src={item.image} alt={item.name} />

                                <div className="cart-dropdown__details">
                                    <h4>{item.name}</h4>

                                    <p>
                                        {item.price.toLocaleString('sv-SE')} kr
                                    </p>

                                    <div className="cart-dropdown__quantity">
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.productId)
                                            }
                                            aria-label={`Remove one ${item.name}`}
                                        >
                                            <Minus size={14} />
                                        </button>

                                        <span>{item.qty}</span>

                                        <button
                                            onClick={() =>
                                                addToCart({
                                                    id: item.productId,
                                                    name: item.name,
                                                    price: item.price,
                                                    image: item.image
                                                })
                                            }
                                            aria-label={`Add one ${item.name}`}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <footer className="cart-dropdown__footer">
                        <div className="cart-dropdown__subtotal">
                            <span>Subtotal</span>
                            <strong>
                                {subtotal.toLocaleString('sv-SE')} kr
                            </strong>
                        </div>

                        <button
                            className="cart-dropdown__checkout"
                            onClick={onClose}
                        >
                            Continue shopping
                        </button>

                        <button
                            className="cart-dropdown__clear"
                            onClick={clearCart}
                        >
                            Clear cart
                        </button>
                    </footer>
                </>
            )}
        </div>
    );
};