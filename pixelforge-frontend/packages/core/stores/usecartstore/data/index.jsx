import { create } from 'zustand';

export const useCartStore = create((set) => ({
    cart: [],

    addToCart: (product) => set((state) => {
        const existingProduct = state.cart.find(
            (item) => item.productId === product.id
        );

        if (existingProduct) {
            return {
                cart: state.cart.map((item) =>
                    item.productId === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
            };
        }

        return {
            cart: [
                ...state.cart,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty: 1
                }
            ]
        };
    }),

    removeFromCart: (productId) => set((state) => ({
        cart: state.cart
            .map((item) =>
                item.productId === productId
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
            .filter((item) => item.qty > 0)
    })),

    clearCart: () => set({ cart: [] })
}));