import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Form, Modal, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './BlogForm.css';

const BlogForm = ({ blog, onEditBlogs, onDeleteBlogs }) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const role = user?.isAdmin ? 'admin' : 'user';

    const handleEditBlogs = () => {
        onEditBlogs(blog);
    };

    const handleDeleteBlogs = () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            onDeleteBlogs(blog);
        }
    };

    return (
        <Col md={4} className="blog-card-all">
            <Card className="Blog-card">
                <Card.Img className="blog-card-img" src={blog.img} />
                <Card.Body>
                    <Card.Title className="blog-card-title">{blog.title}</Card.Title>
                    <Card.Text className="blog-card-text">{blog.text}</Card.Text>
                    {role === 'admin' && (
                        <div className='btn-product' >
                            <Button className="btn-edit-product" onClick={handleEditBlogs}>Edit</Button>
                            <Button className="btn-delete-product" onClick={handleDeleteBlogs}>Delete</Button>
                        </div>
                    )}
                </Card.Body>


            </Card>
        </Col>
    );
};



const BlogSlider = ({ blogs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const role = user?.isAdmin ? 'admin' : 'user';
    const [blogsState, setBlogs] = useState(blogs);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBlogTitle, setNewBlogTitle] = useState('');
    const [newBlogImgURL, setNewBlogImgURL] = useState('');
    const [newBlogText, setNewBlogText] = useState('');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        text: '',
        img: '',
    });

    const handleCloseAddModal = () => setShowAddModal(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!blogs || blogs.length === 0) {
        return <p>No blogs available to display.</p>;
    }
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
    };

    const handleUpdateBlogs = async () => {
        try {
            const updatedBlog = { ...currentBlog, ...formData };
            const response = await axios.put(`http://localhost:5000/api/Blogs/${updatedBlog._id}`, updatedBlog);

            if (response.status === 200) {
                setBlogs(blogs.map(blog => blog._id === updatedBlog._id ? response.data.blog : blog));
                setShowEditModal(false);
                setCurrentBlog(null);
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditBlogs = (blog) => {
        setCurrentBlog(blog);
        setFormData({
            title: blog.title,
            text: blog.text,
            img: blog.img,
        });
        setShowEditModal(true);
    };

    const handleDeleteBlogs = async (blog) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/Blogs/${blog._id}`);

            if (response.status === 200) {
                setBlogs(blogsState.filter(b => b._id !== blog._id));
            } else {
                throw new Error('Failed to delete blogs');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const displayedBlogs = [
        blogs[currentIndex],
        blogs[(currentIndex + 1) % blogs.length],
        blogs[(currentIndex + 2) % blogs.length]
    ].filter(blog => blog);


    //Uploads Blog to cLoudinary
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadBlogCloudinary = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'BlogUser_Flower_Doris');
        formData.append('folder', 'Img_Blogs');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dfkuxfick/image/upload',
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        let imageUrl = '';


        if (file) {
            imageUrl = await uploadBlogCloudinary();
            if (!imageUrl) {
                alert('Error uploading avatar. Please try again.');
                return;
            }
        }

        const formData = new FormData();
        formData.append('title', newBlogTitle);
        formData.append('text', newBlogText);
        formData.append('img', newBlogImgURL || imageUrl);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Blogs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setBlogs([...blogs, response.data.blog]);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding new blog:', error);
        }
    };



    return (
        <div className="blog-slider-container">
            <Row className='admin-add-blogs'>
                {role === 'admin' && (
                    <Button className='add-blog-btn' variant="primary" onClick={() => setShowAddModal(true)}
                    >Add Blog</Button>
                )}

            </Row>

            {isMobile ? (
                <Carousel interval={3000} pause={false}>
                    {blogs.map((blog) => (
                        <Carousel.Item key={blog._id}>
                            {/* <BlogForm blog={blog} /> */}
                            <Card className="service-card mx-auto" style={{ maxWidth: "80%" }}>
                                <Card.Img variant="top" src={blog.imgSrc} />
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>{blog.text}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <Row className="form-our-blogs">
                    {displayedBlogs.map((blog) => (
                        <BlogForm
                            key={blog._id}
                            blog={blog}
                            onEditBlogs={handleEditBlogs}
                            onDeleteBlogs={handleDeleteBlogs}
                        />
                    ))}
                </Row>
            )}

            <>

                {/* Form Edit Modal  */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered style={{ maxHeight: '650px', overflowY: 'auto' }}>

                    <Modal.Header >
                        <Modal.Title>Edit Blogs</Modal.Title>
                    </Modal.Header>

                    <Modal.Body >

                        <Form onSubmit={(e) => { e.preventDefault(); handleUpdateBlogs(); }}>
                            <Form.Group controlId="formTitle" >
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formText" className="mt-3">
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Text"
                                    value={formData.text}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formImg" className="mt-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="img"
                                    value={formData.img}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Button className="mt-3" variant="primary" type="submit">Save Changes</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>

            <>
                {/* Form add blog */}
                <Modal show={showAddModal} onHide={handleCloseAddModal}>
                    <Modal.Header >
                        <Modal.Title>Add New Blog</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddBlog}>
                            <Form.Group controlId="formTitle" className="mt-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter blog title"
                                    value={newBlogTitle}
                                    onChange={(e) => setNewBlogTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formImgURL" className="mt-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter image URL"
                                    value={newBlogImgURL}
                                    onChange={(e) => setNewBlogImgURL(e.target.value)}

                                />
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".jpg, .jpeg, .png"
                                />
                            </Form.Group>

                            <Form.Group controlId="formText" className="mt-3">
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter blog content"
                                    value={newBlogText}
                                    onChange={(e) => setNewBlogText(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button className="mt-3" variant="primary" type="submit">
                                Add Blog
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>


            {!isMobile && (
                <div className="d-flex justify-content-center mt-3 button-next">
                    <Button className="slider-button" onClick={handlePrev} variant="link">
                        <FaChevronLeft />
                    </Button>
                    <Button className="slider-button" onClick={handleNext} variant="link">
                        <FaChevronRight />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BlogSlider;


