import React from 'react';

const PaymentSuccess = () => {
    return (
        <div className="text-center mt-5">
            <h1>Payment Successful!</h1>
            <p>Thank you for your order. We will process it as soon as possible.</p>
            <a href="/" className="btn btn-primary mt-3">Back to Home</a>
        </div>
    );
}

export default PaymentSuccess;