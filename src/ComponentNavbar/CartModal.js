import React, { useState, useEffect } from 'react';

import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Component/useCart';
import { useSelector } from 'react-redux';
import LoginRegister from '../ComponentNavbar/LoginRegister';
import './CartModal.css';

const CartModal = ({ show, onClose }) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?._id;
    const { cartItems = [], setCartItems, onQuantityChange, removeFromCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        if (!user && show) {
            navigate('/login-register');
            onClose();
        }
    }, [user, show, navigate, onClose]);

    if (!user) {
        return (
            <LoginRegister show={showLoginModal} handleClose={() => {
                setShowLoginModal(false);
                onClose();
            }} />
        );
    }

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

    const handleCheckboxChange = (product) => {
        setSelectedItems((prevSelectedItems) => {
            const alreadySelected = prevSelectedItems.find(item => item.productId === product.productId);
            if (alreadySelected) {
                return prevSelectedItems.filter(item => item.productId !== product.productId);
            } else {
                return [...prevSelectedItems, product];
            }
        });
    };


    // Handle checkout
    const handleCheckout = () => {
        if (!user) {
            setShowLoginModal(true);
        } else {
            navigate('/checkout', { state: { selectedItems } });
            onClose();
        }
    };


    if (!cartItems.length) {
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
        <Modal
            show={show}
            onHide={onClose}
            size="md"
            dialogClassName="cart-modal-right"
            contentClassName="cart-modal-content"
            backdrop={false}
        >
            <Modal.Header>
                <Modal.Title>Shopping Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {cartItems.map((product) => (
                        <ListGroup.Item key={product._id}>
                            <div className="cart-item">
                                <input
                                    type="checkbox"
                                    className="cart-item-checkbox"
                                    onChange={() => handleCheckboxChange(product)}
                                    checked={selectedItems.some((selectedItem) => selectedItem.productId === product.productId)}
                                />
                                <img src={product.img || 'path/to/default-image.jpg'} alt={product.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <div className="cart-item-name">{product.name}</div>
                                    <div className="cart-item-quantity">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(product.productId || product._id, product.quantity - 1)}

                                            disabled={product.quantity <= 0}
                                        >
                                            -
                                        </button>
                                        <span>{product.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(product.productId || product._id, product.quantity + 1)}

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