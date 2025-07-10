import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Table, Container, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomShipping from "../Component/shipping";
import { Trash2, Edit } from 'react-feather';
import './Payment.css';


const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user._id;
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [cardNumberError, setCardNumberError] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedItems] = useState(location.state?.selectedItems || []);
    const [totalAmount] = useState(location.state?.totalAmount || '0.00');
    const [nameOnCard, setNameOnCard] = useState('');
    const [expirationDate, setExpirationDate] = useState({ month: '', year: '' });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [cards, setCards] = useState([]);
    const [showCardForm, setShowCardForm] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [defaultCardId, setDefaultCardId] = useState(null);
    const [showModal, setShowModalConfirm] = useState(false);
    const formRef = useRef(null);


    const visalogo = "https://drive.google.com/thumbnail?id=199rEj8xl5LrJQq7LkaYgSgT5E6agckPR";
    const mastercardLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqs07JKStrOgOZWYFt3t19oWlpVEK8KKYiPQ04ByoHv8JOT-Ehtm3eGIJltbjxZEZxaHg&usqp=CAU";

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            if (!userId) {
                console.error('User ID is not defined.');
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/payment`);
                const data = response.data;

                if (data && data.paymentInfo) {
                    const paymentInfoArray = data.paymentInfo;
                    setCards(paymentInfoArray);
                    const { nameOnCard, cardNumber, cvv, expirationDate } = paymentInfoArray;
                    if (paymentInfoArray.length > 0) {
                        const defaultCard = paymentInfoArray[paymentInfoArray.length - 1];
                        setDefaultCardId(defaultCard._id);
                    }

                    setNameOnCard(nameOnCard || '');
                    setCardNumber(cardNumber ? `${cardNumber.slice(0, 4)}${'*'.repeat(cardNumber.length - 8)}${cardNumber.slice(-4)}` : '');
                    setCvv(cvv ? cvv.replace(/.(?=.{1})/g, '*') : '');

                    if (expirationDate) {
                        const [month, year] = expirationDate.split(' ');
                        setExpirationDate({ month: month || '', year: year || '' });
                    } else {
                        setExpirationDate({ month: '', year: '' });
                    }
                } else {
                    console.warn('No payment found for this user.');
                }
            } catch (error) {
                console.error("Error fetching payment info:", error.response ? error.response.data : error.message);
            }
        };

        fetchPaymentInfo();
    }, [userId]);

    useEffect(() => {
        if (cardNumber.startsWith('4')) {
            setCardType('visa');
        } else if (cardNumber.startsWith('5')) {
            setCardType('mastercard');
        } else {
            setCardType('');
        }

        if (cardNumber.length > 0 && cardNumber.length !== 16) {
            setCardNumberError('Card number must be exactly 16 digits.');
        } else {
            setCardNumberError('');
        }
    }, [cardNumber]);

    const handlePayment = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (cardNumber.length !== 16) newErrors.cardNumber = 'Please enter a valid 16-digit card number.';
        if (cvv.length !== 3) newErrors.cvv = 'CVV Code must be 3 digits.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formattedExpirationDate = {
                month: parseInt(expirationDate.month, 10),
                year: parseInt(expirationDate.year, 10)
            };
            setLoading(true);
            const paymentInfo = {
                nameOnCard,
                cardNumber: `${cardNumber.slice(0, 4)}${'*'.repeat(cardNumber.length - 8)}${cardNumber.slice(-4)}`,
                cvv: cvv.replace(/.(?=.{1})/g, '*'),
                expirationDate: formattedExpirationDate,
            };
            try {
                if (editingCard) {
                    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/payment/${editingCard._id}`, paymentInfo);
                    if (response.status === 200) {
                        setCards(cards.map(card => card._id === editingCard._id ? response.data : card));
                        setSuccessMessage(' Payment Update successfully!');
                    }

                } else {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/payment`, paymentInfo);
                    if (response.status === 200) {
                        setCards([...cards, response.data]);
                        setSuccessMessage('Payment added successfully!');
                    }

                }
                resetForm()

            } catch (error) {
                console.error("Error saving payment info:", error);
                if (error.response) {
                    console.error("Server responded with:", error.response.data);
                }
            } finally {
                setLoading(false);
            }

        };

    };

    const resetForm = () => {
        setNameOnCard('');
        setCardNumber('');
        setCvv('');
        setExpirationDate({ month: '', year: '' });
        setShowCardForm(false);
        setEditingCard(null);
    };


    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 16) {
            setCardNumber(value);
        }
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCvv(value);
        }
    };

    const handleEditCard = (card) => {
        setEditingCard(card);
        setNameOnCard(card.nameOnCard);
        setCardNumber(card.cardNumber);
        setCvv(card.cvv);
        setExpirationDate(card.expirationDate);
        setShowCardForm(true);
    };

    const handleDeleteCard = (card) => {
        setShowDeleteConfirm(true);
        setCardToDelete(card);
    };

    const confirmDeleteCard = async () => {
        if (!cardToDelete) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/controlUsers/${userId}/payment/delete/${cardToDelete._id}`);
            setCards(cards.filter(card => card._id !== cardToDelete._id));
            setSuccessMessage('Card deleted successfully!');
        } catch (error) {
            console.error("Error deleting card:", error);
            setErrors('An error occurred while deleting the card.');
        } finally {
            setShowDeleteConfirm(false);
            setCardToDelete(null);
        }
    };



    const handleCardClick = (cardId) => {
        if (defaultCardId === cardId) {
            setDefaultCardId(null);
        } else {
            setDefaultCardId(cardId);
        }
    };

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            setShowCardForm(false);
        }
    };

    useEffect(() => {

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDoubleClickConfirm = () => {
        setShowModalConfirm(true);
    };

    const handleConfirm = () => {
        setShowModalConfirm(false);
        navigate('/paymentsuccess');
    };

    const handleCancel = () => {
        setShowModalConfirm(false);
    };


    return (
        <Container className="payment-page">
            <Row className='row-payment-page'>
                <Col md={6}>
                    <Table className="custom-table" >
                        <Col className='title-product-payment'>
                            <Col md={6} className='product-payment'>Product</Col>
                            <Col md={6} className='product-subtotal'> Subtotal</Col>
                        </Col>

                        {selectedItems.map(item => (
                            <Col className='body-product-payment' key={item._id}>
                                <Col className='product-payment' >{item.name} ({item.quantity})</Col>
                                <Col className='product-subtotal-title' >${(item.price * item.quantity).toFixed(2)}</Col>
                            </Col>
                        ))}
                        <Col className='title-total-product' >
                            <Col><strong className='total-product'>Total</strong></Col>
                            <Col className='total-product-total'><strong className='total' >${totalAmount}</strong></Col>
                        </Col>

                    </Table>
                </Col>
                <Col md={5} className='from-card-list' >
                    <table className='card-list'>
                        <Col className='title-card-list'>
                            <Col md={3} >Card Type</Col>
                            <Col md={6}>Card Number</Col>
                            <Col md={3} ></Col>

                        </Col>

                        {cards.map(card => (
                            <Col className='product-list-card' key={card._id} onClick={() => handleCardClick(card._id)}>
                                <Col md={3} className='card-list-imglogo'>
                                    <img onDoubleClick={handleDoubleClickConfirm}
                                        src={
                                            card.cardNumber && card.cardNumber.startsWith('4')
                                                ? visalogo
                                                : mastercardLogo
                                        }
                                        alt={
                                            card.cardNumber && card.cardNumber.startsWith('4')
                                                ? "Visa"
                                                : "MasterCard"
                                        }
                                        style={{
                                            opacity: (defaultCardId === card._id) ? 1 : 0.3,
                                        }}
                                        className="card-logo"
                                    />
                                </Col>
                                <Col md={6} className='card-list-imglogo' onDoubleClick={handleDoubleClickConfirm} >{card.cardNumber}</Col>
                                <Col md={3} className='card-list-imglogo'>
                                    <Edit
                                        strokeWidth={1}
                                        size={20}
                                        onClick={() => handleEditCard(card)}
                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                    />
                                    <Trash2
                                        strokeWidth={1}
                                        size={20} className="checkout-item-icon"
                                        onClick={() => handleDeleteCard(card)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Col>
                            </Col>
                        ))}

                    </table>
                    <Button onClick={() => { resetForm(); setShowCardForm(true); }} className='add-card-button'>
                        {editingCard ? "Edit Card" : "+ Add Card"}
                    </Button>
                    {showCardForm && (
                        <Row className="Payment-title" ref={formRef}>
                            <Col>
                                <Col>
                                    <h3 className="Payment-title-h3">{editingCard ? "Edit Card" : "Add Card"}</h3>
                                </Col>
                            </Col>
                            <Row className='row-from'>
                                <Form onSubmit={handlePayment}>
                                    <Form.Group controlId="formNameOnCard" className='form-input-information'>
                                        <Form.Label>Name on Card</Form.Label>
                                        <Form.Control
                                            className='form-information'
                                            type="text"
                                            placeholder="Name on Card"
                                            value={nameOnCard}
                                            onChange={(e) => setNameOnCard(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formCardNumber" className='form-input-information'>
                                        <div className="label-logo-container">
                                            <Form.Label>
                                                Number on Card <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>

                                            <Col className="text-center">
                                                <img
                                                    src={visalogo}
                                                    alt="Visa"
                                                    className="card-logo"
                                                    style={{ opacity: cardType === 'visa' ? 1 : 0.3 }}
                                                />
                                                <img
                                                    src={mastercardLogo}
                                                    alt="MasterCard"
                                                    className="card-logo"
                                                    style={{ opacity: cardType === 'mastercard' ? 1 : 0.3 }}
                                                />

                                            </Col>
                                        </div>

                                        <Form.Control
                                            className='form-information'
                                            type="text"
                                            placeholder="Card Number"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                        />
                                        {cardNumberError && <div className="error-message">{cardNumberError}</div>}
                                    </Form.Group>

                                    <Row className='From-payment-card'>
                                        <Col md={3}>
                                            <Form.Group controlId="formCvv" className='form-input-information'>
                                                <Form.Label>CVV <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    className='form-information'
                                                    type="text"
                                                    placeholder="CVV Code"
                                                    value={cvv}
                                                    style={{ width: '100px' }}
                                                    onChange={handleCvvChange}
                                                />
                                                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                                            </Form.Group>
                                        </Col>

                                        <Col md={9} className='from-payment-text'>
                                            <Form.Group className='form-input-information'>
                                                <Form.Label>Expiration Date</Form.Label>
                                                <div className="expiration-container">
                                                    <Form.Control
                                                        className='form-information-expiration'
                                                        as="select"
                                                        style={{ width: '150px', backgroundColor: '#f8f3f0' }}
                                                        value={expirationDate.month}
                                                        onChange={(e) => setExpirationDate({ ...expirationDate, month: e.target.value })}
                                                    >
                                                        <option value="" disabled selected hidden>Month</option>
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i} value={String(i + 1).padStart(2, '0')}>
                                                                {String(i + 1).padStart(2, '0')}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                    <Form.Control
                                                        className='form-information-expiration'
                                                        as="select"
                                                        value={expirationDate.year}
                                                        style={{ width: '150px', backgroundColor: '#f8f3f0' }}
                                                        onChange={(e) => setExpirationDate({ ...expirationDate, year: e.target.value })}
                                                    >
                                                        <option value="" disabled hidden>Year</option>
                                                        {[...Array(10)].map((_, i) => (
                                                            <option key={i} value={String(new Date().getFullYear() + i)}>
                                                                {String(new Date().getFullYear() + i)}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </div>
                                            </Form.Group>



                                        </Col>

                                    </Row>


                                    <Button type="submit" className='submit-button' disabled={loading}>
                                        {loading ? "Processing..." : (editingCard ? "Update Card" : "Add Card")}
                                    </Button>
                                </Form>
                                {successMessage && <div className="success-message">{successMessage}</div>}
                            </Row>
                        </Row>
                    )}
                    {showDeleteConfirm && (
                        <div className="delete-confirm">
                            <p>Are you sure you want to delete this card?</p>
                            <Button onClick={confirmDeleteCard}>Yes</Button>
                            <Button onClick={() => setShowDeleteConfirm(false)}>No</Button>
                        </div>
                    )}
                </Col>
                <Modal show={showModal} onHide={handleCancel} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Payment Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to proceed with the payment of <strong>${totalAmount}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
            <CustomShipping />
        </Container>
    );

}

export default Payment;


