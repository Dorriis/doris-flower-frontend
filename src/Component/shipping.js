import React from 'react';
import { Container } from 'react-bootstrap';
import { Truck, Headphones, DollarSign } from 'react-feather';
import './shipping.css';

function CustomShipping() {
    return (
        <Container className="my-4">
            <div className="service-row">
                <div className="service-item">
                    <Truck size={50} strokeWidth={1} className="service-item-icon" />
                    <div>
                        <h5>FREE SHIPPING</h5>
                        <p>Free Shipping For Orders Within 10 Km</p>
                    </div>
                </div>
                <div className="service-item">
                    <Headphones size={50} strokeWidth={1} className="service-item-icon" />
                    <div>
                        <h5>24/7 DEDICATED SUPPORT</h5>
                        <p>Support On Saturdays, Sundays, And Holidays</p>
                    </div>
                </div>
                <div className="service-item">
                    <DollarSign size={50} strokeWidth={1} className="service-item-icon" />
                    <div>
                        <h5>MONEY BACK</h5>
                        <p>Refund Policy</p>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default CustomShipping;
