import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const user = useSelector((state) => state.auth.login?.currentUser);

    const userId = user?._id;

    // Fetch cart items when userId changes
    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/controlUsers/${userId}/cart`);

                if (Array.isArray(response.data)) {
                    setCartItems(response.data);
                } else {
                    console.error('Received cart is not an array or is undefined:', response.data);
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Failed to fetch cart items', error);
                setCartItems([]);
            }
        };
        fetchCart();
    }, [userId]);


    // Add to cart and update database

    const addToCart = useCallback(async (product) => {
        if (!userId || !product._id) return;

        const updatedCart = [...cartItems];
        const existingItemIndex = updatedCart.findIndex(item => item.productId.toString() === product._id);

        if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].quantity += 1;
        } else {
            updatedCart.push({ productId: product._id, quantity: 1 });
        }

        setCartItems(updatedCart);

        try {
            await axios.post(`http://localhost:5000/api/controlUsers/${userId}/cart/add`, {
                productId: product._id,
                quantity: 1
            });
        } catch (error) {
            console.error('Failed to add product to cart', error);

        }
    }, [userId, cartItems]);

    // Remove item from the cart

    const removeFromCart = useCallback(async (productId) => {
        if (!userId) return;

        setCartItems((prevItems) => prevItems.filter(item => item._id.toString() !== productId));

        try {

            await axios.delete(`http://localhost:5000/api/controlUsers/${userId}/cart/remove/${productId}`, {
                data: { productId }
            });
        } catch (error) {
            console.error('Failed to remove item from cart', error);
        }
    }, [userId]);


    // Update product quantity in the cart

    const onQuantityChange = useCallback(async (productId, newQuantity) => {
        if (!userId) return;

        setCartItems((prevItems) => {
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.productId !== productId);
            }

            return prevItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            );
        });

        try {
            await axios.put(`http://localhost:5000/api/controlUsers/${userId}/cart/update/${productId}`, {
                newQuantity
            });
        } catch (error) {
            console.error('Failed to update product quantity', error);
        }
    }, [userId]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, onQuantityChange, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);