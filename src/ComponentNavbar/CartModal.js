import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Component/useCart';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './CartModal.css';

const CartModal = ({ show, onClose }) => {
    const userId = useSelector((state) => state.auth.login?.currentUser?._id);
    const { cartItems = [], setCartItems, onQuantityChange, removeFromCart } = useCart();
    const [productDetails, setProductDetails] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Fetch product details based on cart items
    const fetchCart = useCallback(async () => {
        if (cartItems.length === 0) {
            setProductDetails([]);
            return;
        }

        const productIds = cartItems.map(item => item.id).join(',');
        try {
            const response = await axios.get(`http://localhost:5000/api/controlUsers/${userId}/cart`, {
                params: { ids: productIds },
            });

            setProductDetails(response.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }, [cartItems, userId]);

    const fetchProductDetails = useCallback(async () => {
        if (cartItems.length === 0) {
            setProductDetails([]);
            return;
        }

        const productIds = cartItems.map(item => item.productId);
        try {
            const productRequests = productIds.map(id =>
                axios.get(`http://localhost:5000/api/products/${id}`)
            );

            const responses = await Promise.all(productRequests);
            const products = responses.map(response => ({ ...response.data, quantity: cartItems.find(item => item.productId === response.data._id)?.quantity || 1 }));
            setProductDetails(products);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }, [cartItems]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails, cartItems]);

    const handleQuantityChange = async (productId, newQuantity) => {
        const currentQuantity = cartItems.find(item => item.productId === productId)?.quantity;

        if (currentQuantity === newQuantity) {
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
        );

        setIsLoading(true);

        try {
            await onQuantityChange(productId, newQuantity);
            if (newQuantity === 0) {
                await removeFromCart(productId);
            }
        } catch (error) {
            console.error('Failed to update product quantity:', error);

            setCartItems((prevItems) =>
                prevItems.map(item =>
                    item.productId === productId ? { ...item, quantity: currentQuantity } : item
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (item) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.some((selectedItem) => selectedItem._id === item._id)
                ? prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id)
                : [...prevSelectedItems, item]
        );
    };

    // Handle checkout
    const handleCheckout = () => {
        navigate('/checkout', { state: { selectedItems } });
        onClose();
    };

    useEffect(() => {
        if (show) {
            fetchProductDetails();
        }
    }, [show, fetchProductDetails]);

    if (!productDetails.length) {
        return (
            <Modal show={show} onHide={onClose} size="md" className="cart-modal">
                <Modal.Header>
                    <Modal.Title>Shopping Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">Your cart is empty</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-footer-shoppingcart" variant="primary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onClose} size="md" className="cart-modal">
            <Modal.Header closeButton>
                <Modal.Title>Shopping Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {productDetails.map((product) => (
                        <ListGroup.Item key={product._id}>
                            <div className="cart-item">
                                <input
                                    type="checkbox"
                                    className="cart-item-checkbox"
                                    onChange={() => handleCheckboxChange(product)}
                                    checked={selectedItems.some((selectedItem) => selectedItem._id === product._id)}
                                />
                                <img src={product.img || 'path/to/default-image.jpg'} alt={product.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <div className="cart-item-name">{product.name}</div>
                                    <div className="cart-item-quantity">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                                            disabled={product.quantity <= 0}
                                        >
                                            -
                                        </button>
                                        <span>{product.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                                            disabled={isLoading}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="item-price">
                                        <div className="cart-item-price">${parseFloat(product.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-checkout" variant="primary" onClick={handleCheckout}>
                    Check Out
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CartModal;