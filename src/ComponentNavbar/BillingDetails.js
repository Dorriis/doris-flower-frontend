import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomShipping from "../Component/shipping"
import './Payment.css';

function BillingDetails() {
    const location = useLocation();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?._id;
    const userEmail = user?.email;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [province, setProvince] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [errors, setErrors] = useState({});
    const [time, setTime] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [existingDetails, setExistingDetails] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const totalAmount = location.state?.totalAmount || 0;
    const [selectedItems] = useState(location.state?.selectedItems || []);

    // Fetch billing details when the component mounts
    useEffect(() => {
        const fetchBillingDetails = async () => {
            if (!userId) {
                console.error('User ID is not defined.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/controlUsers/${userId}/billing-details`);
                const data = response.data;

                if (data && data.billingDetails) {
                    const { firstName, lastName, streetAddress, province, phone } = data.billingDetails;
                    setFirstName(firstName || '');
                    setLastName(lastName || '');
                    setStreetAddress(streetAddress || '');
                    setProvince(province || '');
                    setPhone(phone || '');
                    setExistingDetails(true);
                } else {
                    console.warn('No billing details found for this user.');
                }
            } catch (error) {
                console.error('Error fetching billing details:', error.response ? error.response.data : error.message);
            }
        };

        fetchBillingDetails();
    }, [userId]);


    const handleNext = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!streetAddress) newErrors.streetAddress = 'Street Address is required.';
        if (!province) newErrors.province = 'Province is required.';
        if (!phone) newErrors.phone = 'Phone is required.';
        if (!deliveryDate) newErrors.deliveryDate = 'Delivery Date is required.';
        if (!time) newErrors.time = 'Time is required.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const billingDetails = {
                firstName,
                lastName,
                streetAddress,
                province,
                phone,
                email: userEmail
            };

            try {

                if (existingDetails) {
                    const response = await axios.put(`http://localhost:5000/api/controlUsers/${userId}/billing-details/edit`, billingDetails);
                    if (response.status === 200) {
                        setSuccessMessage('Billing details updated successfully!');
                        navigate('/payment', {
                            state: {
                                selectedItems,
                                totalAmount,
                            },
                        });
                    }
                } else {

                    const response = await axios.post(`http://localhost:5000/api/controlUsers/${userId}/billing-details`, billingDetails);
                    if (response.status === 200) {
                        setSuccessMessage('Billing details added successfully!');
                        navigate('/payment', {
                            state: {
                                selectedItems,
                                totalAmount,
                            },
                        });
                    }
                }
            } catch (error) {
                console.error('Error saving billing details:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container>
            <div className="billing-details-page ">
                <h2 className='titile-headers'>Billing Details</h2>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formFirstName" className='form-input-information'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control className='form-information'
                                    type="text"
                                    placeholder="First Name"
                                    maxLength="210"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="formLastName" className='form-input-information'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control className='form-information'
                                    type="text"
                                    placeholder="Last Name"
                                    maxLength="210"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="formDeliveryDate" className='form-input-information'>
                                <Form.Label>
                                    Delivery Date <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control className='form-information'
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    isInvalid={!!errors.deliveryDate}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.deliveryDate}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="formTime" className='form-input-information'>
                                <Form.Label>
                                    Time <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control className='form-information'
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    isInvalid={!!errors.time}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.time}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>

                    <Form.Group controlId="formStreetAddress" className='form-input-information'>
                        <Form.Label>Street Address<span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control className='form-information'
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            isInvalid={!!errors.streetAddress}
                            placeholder="Street Address"
                            style={{ width: '465px', height: '40px' }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.streetAddress}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formProvince" className='form-input-information'>
                        <Form.Label>Province<span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control className='form-information'
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            isInvalid={!!errors.province}
                            placeholder="Lam Dong Province"
                            style={{ width: '465px', height: '40px' }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPhone" className='form-input-information'>
                        <Form.Label>Phone<span style={{ color: 'red' }}>*</span></Form.Label>
                        <Form.Control className='form-information'
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            isInvalid={!!errors.phone}
                            placeholder="Phone"
                            style={{ width: '465px', height: '40px' }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formEmail" className='form-input-information'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control className='form-information'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            style={{ width: '465px', height: '40px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formAdditionalInfo" className='form-input-information'>
                        <Form.Label>Additional Information</Form.Label>
                        <Form.Control className='form-information'
                            as="textarea"
                            rows={3}
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="Additional Information"
                            style={{ width: '465px', height: '40px' }}
                        />
                    </Form.Group>

                    <Button className='btn-next' onClick={handleNext}>Next</Button>
                </Form>

            </div>
            <CustomShipping />

        </Container>


    );
}
export default BillingDetails;


