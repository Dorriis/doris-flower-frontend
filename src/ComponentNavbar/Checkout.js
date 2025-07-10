import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2 } from 'react-feather';
import { Row, Col } from 'react-bootstrap';
import CustomShipping from '../Component/shipping'
import './Checkout.css'

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(location.state?.selectedItems || []);

    const totalAmount = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    const handleRemoveItem = (itemId) => {
        setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one product to checkout.');
            return;
        }
        navigate('/billing-details', {
            state: {
                selectedItems,
                totalAmount
            }
        });
    };

    return (
        <div className="checkout-page">
            <Row>
                <Col md={9}>
                    <div className="checkout-table">

                        <Col className='title-checkout'>
                            <Col md={6} className='title-checkout-product'>Product</Col>
                            <Col md={2}>Price</Col>
                            <Col md={2}>Quantity</Col>
                            <Col md={2}>Subtotal</Col>
                        </Col>

                        <div className="table-content">
                            {selectedItems.map((item, index) => (
                                <Col key={`${item._id}-${index}`} className='item-checkout-list'>
                                    <Col md={6}>
                                        <img src={item.img} alt={item.name} className="product-image" />
                                        {item.name}
                                    </Col>
                                    <Col md={2} className='number-checkout'>${item.price && item.quantity ? (item.price * item.quantity).toFixed(2) : '0.00'}</Col>
                                    <Col md={2} className='number-checkout'>{item.quantity}</Col>
                                    <Col md={2} className='checkout-list-icon'>
                                        <span>${item.price && item.quantity ? (item.price * item.quantity).toFixed(2) : '0.00'}</span>
                                        <Trash2
                                            strokeWidth={1}
                                            size={24} className="checkout-item-icon"
                                            onClick={() => handleRemoveItem(item._id)}
                                        />
                                    </Col>
                                </Col>
                            ))}

                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="cart-totals">
                        <h3 className='Cart-checkout-title'>Cart total</h3>
                        <p className="checkout-total-item">Subtotal: <span className="checkout-total-amount">${totalAmount}</span></p>
                        <p className="checkout-total-item-list">Total: <span className="total-amount">${totalAmount}</span></p>
                        <button className="checkout-button-cart" onClick={handleCheckout}>Check Out</button>
                    </div>
                </Col>
            </Row>

            <CustomShipping />

        </div>
    );
};

export default Checkout;
