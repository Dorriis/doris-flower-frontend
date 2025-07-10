import React from 'react';
import { Container } from 'react-bootstrap';
import CustomShipping from "../Component/shipping"


const ReturnPolicy = () => {
    return (
        <Container>
            <div className='Return-header'>
                <h2>Doris Flower's Return Policy</h2>
                <p>At Doris Flower, we are committed to providing our customers with the highest quality fresh flowers and the best service. If you are not satisfied with the product you receive, we will assist you with returns and refunds.</p>
            </div>

            <div className='Return-content'>
                <h3 className='Return-title'>1.Return Conditions</h3>
                <p>
                    1.1. Return Period: You may request a return within 24 hours of receiving the product.
                </p>
                <p> 1.2. Product Condition: The product must be intact, undamaged, and in its original condition.</p>
                <div>
                    1.3. Valid Reasons for Return:
                    <span className='Reasons-Return'>
                        <p>&#8226;The product is damaged or not as described.</p>
                        <p>&#8226;The product is incorrect.</p>
                        <p>&#8226;The product is wilted and does not meet quality standards upon delivery.</p>
                    </span>
                </div>

                <h3 className='Return-title'>2.Return Process:</h3>
                <p>
                    2.1. Contact Us: Please contact Doris Flower via phone or email to notify us about the return and the reason for the return.
                </p>
                <p> 2.2. Confirmation: After receiving your request, we will confirm the information and guide you through the return process.
                </p>
                <p> 2.3. Send Back the Product: Please carefully pack the product and send it back to us at the provided address.</p>
                <p> 2.4. Product Inspection: We will inspect the product upon receipt.
                </p>
                <p> 2.5. Refund: If the product meets the return conditions, we will process a refund within 7-10 business days after receiving the returned product.</p>

                <div className='Return-note'>
                    <h5 className='Return-note-header'>Note:</h5>
                    <span className='Return-note-content'>
                        <p>
                            &#8226;Return shipping costs will be covered by Doris Flower if the error is on our part (damaged product, incorrect product).
                        </p>
                        <p> &#8226;In the case of customer error (change of mind, no longer needed), the customer will bear the return shipping costs.</p>
                    </span>
                </div>
                <p>Thank you for trusting and using Doris Flower's services!</p>

            </div>
            <CustomShipping />
        </Container>
    );
};

export default ReturnPolicy;