import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import BlogSlider from '../Component/BlogForm'
import CustomShipping from '../Component/shipping';
import axios from 'axios';
import './Page.css'

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [workshop, setWorkshop] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/Blogs');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setBlogs(response.data);
                } else {
                    console.warn('No blogs available in the response:', response.data);
                    setBlogs([]);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        const fetchWorkshop = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/workshops');
                setWorkshop(response.data);

            } catch (error) {
                console.error('Error fetching workshop:', error);
            }
        };

        fetchBlogs();
        fetchWorkshop();
    }, []);

    return (
        <Container>
            <Row>
                <Col md={6} className=" d-flex contact-infor">
                    <Form className='contact-form'>
                        <h3 className='contact-header' >
                            Register for the Workshop
                        </h3>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Full Name"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumber" className="mb-3">
                            <Form.Control
                                type="phone"
                                placeholder="Phone Number"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate" className="mb-3">
                            <Form.Control
                                type="date"
                                placeholder="Preferred Date"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMessage" className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Additional Notes"
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>
                        <Button type="submit" className="btn-form-contact">
                            Subscribe Us
                        </Button>
                    </Form>
                </Col>

                <Col md={6}>
                    <div className="workshop-container">
                        {workshop.length > 0 ? (
                            workshop.map((workshop, index) => (
                                <div key={index} className="workshop-info">
                                    <h4 className="workshop-title">{`Workshop: ${workshop.topic}`}</h4>
                                    <div className='workshop-info-body'>
                                        <Row style={{ margin: '0', padding: '0' }} className='workshop-icon-body'>
                                            <Col md={9} style={{ margin: '0', padding: '0' }}>
                                                <p><strong>Topic:</strong> {workshop.topic}</p>
                                                <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                                                <p><strong>Time:</strong> {workshop.time}</p>
                                            </Col>
                                        </Row>
                                        <p>{workshop.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No workshops available.</p>
                        )}

                    </div>

                </Col>
            </Row>


            <h2 className="mt-4"> Blogs </h2>
            <BlogSlider blogs={blogs} />
            <CustomShipping />

        </Container>


    )
};

export default Blog; 