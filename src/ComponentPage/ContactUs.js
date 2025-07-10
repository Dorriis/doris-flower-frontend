
import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Phone, Home, Mail } from 'react-feather';
import ChatBox from './ChatBox';
import './Page.css'

const ContactUs = () => {
    return (
        <Container>
            <Container className="my-5">
                <div className="text-center mb-4">
                    <h2 className="mb-4" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        Keep in touch with us
                    </h2>
                    <p style={{ maxWidth: '650px', margin: '0 auto' }}>
                        We are always ready to listen and support you. Please contact us if you encounter any service issues or need advice on any matter.
                    </p>
                </div>
                <div className="d-flex justify-content-center">

                    <Form className='contact-form'>
                        <h3 className='contact-header' >
                            Contact Us Now
                        </h3>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Your Name"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Your Email Address"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMessage" className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Your Message"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Button type="submit" className="btn-form-contact">
                            Subscribe Us
                        </Button>
                    </Form>
                </div>

                <div className="contact-row">
                    <div className="contact-item">
                        <Phone size={50} strokeWidth={1} className="contact-item-icon" />
                        <div className='contact-content'>
                            <h5>Phone:</h5>
                            <div className='contact-phone'>
                                <p>Mobile: (+84)332.46.46.63 </p>
                                <p>Fax: 678 678 6789 678   </p>
                            </div>

                        </div>
                    </div>
                    <div className="contact-item">
                        <Home size={50} strokeWidth={1} className="contact-item-icon" />
                        <div className='contact-content'>
                            <h5>Address:</h5>
                            <p> Binh Hung Commune, Binh Chanh District</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <Mail size={50} strokeWidth={1} className="contact-item-icon" />
                        <div className='contact-content'>
                            <h5>Email:</h5>
                            <p>DorisNgoc@gmail.com</p>
                        </div>
                    </div>
                </div>
            </Container>
            <ChatBox />
        </Container >

    );
};

export default ContactUs;