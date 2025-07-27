import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const user = useSelector((state) => state.auth.login?.currentUser);

    const userId = user?._id;
    console.log("userId in useCart.js:", userId);

    // Fetch cart items when userId changes
    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/cart`,
                    { withCredentials: true }
                );

                if (Array.isArray(response.data)) {
                    setCartItems(response.data.map(item => ({
                        ...item,
                        productId: item.id
                    })));
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
        const existingItemIndex = updatedCart.findIndex(
            item => item.productId.toString() === product._id.toString()
        );

        if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].quantity += 1;
        } else {
            updatedCart.push({ productId: product._id, quantity: 1 });
        }

        setCartItems(updatedCart);

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/cart/add`, {
                productId: product._id,
                quantity: 1
            },
                { withCredentials: true }
            );
        } catch (error) {
            console.error('Failed to add product to cart', error);

        }
    }, [userId, cartItems]);

    // Remove item from the cart

    const removeFromCart = useCallback(async (productId) => {
        if (!userId) return;
        setCartItems((prevItems) =>
            prevItems.filter(item => item.productId.toString() !== productId.toString())
        );


        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/cart/remove/${productId}`,
                {
                    data: { productId },
                    withCredentials: true
                }
            );
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
                item.productId.toString() === productId.toString()
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/cart/update/${productId}`, {
                newQuantity
            }, { withCredentials: true });
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