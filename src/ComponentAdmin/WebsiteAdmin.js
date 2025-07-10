import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { Trash2, Edit } from 'react-feather';
import BlogSide from '../Component/BlogForm';
import axios from 'axios';
import './Admin.css'

const WebsiteAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    // const [showAddModal, setShowAddModal] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [workshops, setWorkshops] = useState([]);
    const [currentWorkshop, setCurrentWorkshop] = useState(null);


    const [formData, setFormData] = useState({
        topic: '',
        date: '',
        time: '',
        content: '',
    });

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

        const fetchWorkshops = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/workshops');

                if (Array.isArray(response.data)) {
                    setWorkshops(response.data);
                } else {
                    console.error('Data is not an array:', response.data);
                    setWorkshops([]);
                }
            } catch (error) {
                console.error('Error fetching workshops:', error);
                setWorkshops([]);
            }
        };

        fetchBlogs();
        fetchWorkshops();
    }, []);

    //handle delete, update Blogs

    const handleUpdateBlogs = async (blog) => {
        setCurrentBlog(blog);
        setShowEditModal(true);
    };


    const handleDeleteBlogs = async (blogId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/Blogs/${blogId}`);
            if (response.status === 200) {
                setBlogs(blogs.filter(blog => blog._id !== blogId));
            } else {
                console.error('Failed to delete blog:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    //Handle Add, delete, update Worshop
    // const handleCloseAddModal = () => setShowAddModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);


    const handleAddWorkshop = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/workshops/add', formData);
            setWorkshops([...workshops, response.data]);
            setFormData({ topic: '', date: '', time: '', content: '' }); // Reset form
        } catch (error) {
            console.error('Error adding workshop:', error);
        }
    };


    const handleUpdateWorkshop = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/workshops/${currentWorkshop._id}`, formData);
            setWorkshops(workshops.map(w => w._id === currentWorkshop._id ? response.data : w));
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating workshop:', error);
        }
    };


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'date') {
            const formattedDate = new Date(value).toISOString().split('T')[0];
            setFormData(prevFormData => ({ ...prevFormData, [name]: formattedDate }));
        } else {
            setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
        }
    };

    const handleEditWorkshop = (workshop) => {
        const formattedWorkshop = {
            ...workshop,
            date: new Date(workshop.date).toISOString().split('T')[0],
        };
        setCurrentWorkshop(formattedWorkshop);
        setFormData(formattedWorkshop);
        setShowEditModal(true);
    };

    const handleDeleteWorkshop = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/workshops/${id}`);
            setWorkshops(workshops.filter(workshop => workshop._id !== id));
        } catch (error) {
            console.error('Error deleting workshop:', error);
        }
    };

    return (
        <Container className='website-admin'>
            <Row>
                <Col md={6} className=" d-flex contact-infor">
                    <Form className='contact-form' onSubmit={handleAddWorkshop}>
                        <h3 className='contact-header'>Add Workshop</h3>
                        <Form.Group controlId="formTopic" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleFormChange}
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDate" className="mb-3">
                            <Form.Control
                                type="date"
                                placeholder="Preferred Date"
                                name="date"
                                value={formData.date}
                                onChange={handleFormChange}
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTimer" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Time"
                                name="time"
                                value={formData.time}
                                onChange={handleFormChange}
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formContent" className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Content"
                                name="content"
                                value={formData.content}
                                onChange={handleFormChange}
                                style={{ backgroundColor: '#F8F3F0' }}
                            />
                        </Form.Group>

                        <Button type="submit" className="btn-form-contact">
                            Add Workshop
                        </Button>
                    </Form>
                </Col>

                <Col md={6}>
                    <div className="workshop-container">
                        {workshops.length > 0 ? (
                            workshops.map((workshop, index) => (
                                <div key={index} className="workshop-info">
                                    <h4 className="workshop-title">{`Workshop: ${workshop.topic}`}</h4>
                                    <div className='workshop-info-body'>
                                        <Row style={{ margin: '0', padding: '0' }} className='workshop-icon-body'>
                                            <Col md={9} style={{ margin: '0', padding: '0' }}>
                                                <p><strong>Topic:</strong> {workshop.topic}</p>
                                                <p>Date: {new Date(workshop.date).toLocaleDateString()}</p>
                                                <p>Time: {workshop.time}</p>
                                            </Col>
                                            <Col md={3} className='workshop-icon' style={{ margin: '0', padding: '0' }}>
                                                <Edit
                                                    strokeWidth={1}
                                                    size={20}
                                                    onClick={() => handleEditWorkshop(workshop)}
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                />
                                                <Trash2
                                                    strokeWidth={1}
                                                    size={20}
                                                    className="checkout-item-icon"
                                                    onClick={() => handleDeleteWorkshop(workshop._id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
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

            <Row>
                <BlogSide
                    blogs={blogs}
                    handleUpdateBlogs={handleUpdateBlogs}
                    onDeleteProduct={handleDeleteBlogs}
                />
            </Row>


            <>
                {/* Form Edit Modal  */}
                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header>
                        <Modal.Title>Edit Workshop</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="topic" className="mt-3">
                                <Form.Label>Topic</Form.Label>
                                <Form.Control type="text" name="topic" value={formData.topic} onChange={handleFormChange} />
                            </Form.Group>

                            <Form.Group controlId="date" className="mt-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" name="date" value={formData.date} onChange={handleFormChange} />
                            </Form.Group>

                            <Form.Group controlId="time" className="mt-3">
                                <Form.Label>Time</Form.Label>
                                <Form.Control type="text" name="time" value={formData.time} onChange={handleFormChange} />
                            </Form.Group>

                            <Form.Group controlId="content" className="mt-3">
                                <Form.Label>Content</Form.Label>
                                <Form.Control as="textarea" name="content" value={formData.content} onChange={handleFormChange} />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="mt-3" onClick={handleUpdateWorkshop}>Update Workshop</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>

        </Container>
    );
};

export default WebsiteAdmin;
