import React, { useState } from 'react';
import { Row, Button, Form, Modal, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CardProduct from './CardProduct';
import { useCart } from '../Component/useCart';
import axios from 'axios';

const ProductList = ({ products, visibleCount, isLazyLoading, searchQuery }) => {

    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [productsState, setProducts] = useState(products);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slogan: '',
        price: '',
        catalog: '',
        condition: '',
        color: '',
        img: '',
    });

    const filteredProducts = searchQuery
        ? products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : products;


    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleShowMoreClick = () => {
        navigate('/shops', { state: { title: 'All' } });
    };

    const handleClick = (product) => {
        navigate(`/product/${product._id}`);

    };

    const handleUpdateProduct = async () => {
        try {
            const updatedProduct = { ...currentProduct, ...formData };
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${updatedProduct._id}`, updatedProduct);
            if (response.status === 200) {
                setProducts(products.map(product => product._id === updatedProduct._id ? response.data.product : product));
                setShowEditModal(false);
                setCurrentProduct(null);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            slogan: product.slogan,
            price: product.price,
            catalog: product.catalog,
            condition: product.condition,
            color: product.color,
            img: product.img,
        });
        setShowEditModal(true);
    };

    const handleDeleteProduct = async (product) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${product._id}`);

            if (response.status === 200) {
                setProducts(productsState.filter(p => p._id !== product._id));
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
            console.error('Full error:', error);
        }
    };

    return (

        <>
            <Row className='img-row'>
                {filteredProducts.slice(0, visibleCount).map((product, index) => (
                    <CardProduct
                        key={`${product._id}-${index}`}
                        product={{
                            ...product,
                            price: Number(product.price),
                            oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined
                        }}
                        onAddToCart={handleAddToCart}
                        onClick={() => handleClick(product)}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                ))}


                {/* Modal Edit product */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>

                    <Modal.Body >
                        <Form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }}>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="formSlogan">
                                        <Form.Label>Slogan</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="slogan"
                                            value={formData.slogan}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} >

                                    <Form.Group controlId="formPrice" className="mt-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </Form.Group>

                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formCatalog" className="mt-3">
                                        <Form.Label>Catalog</Form.Label>
                                        <Form.Control
                                            as="select"
                                            type="text"
                                            name="catalog"
                                            value={formData.catalog}
                                            onChange={handleFormChange}
                                        >
                                            <option>Wedding Flower</option>
                                            <option>Bouquet Flower</option>
                                            <option>Flower Basket</option>
                                            <option>Box Flower</option>
                                            <option>Small Tree</option>
                                            <option>Vases</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formColor" className="mt-3">
                                        <Form.Label>Color</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleFormChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="formCondition" className="mt-3">
                                        <Form.Label>Condition</Form.Label>
                                        <Form.Control
                                            as="select"
                                            type="text"
                                            name="condition"
                                            value={formData.condition}
                                            onChange={handleFormChange}
                                        >
                                            <option>New</option>
                                            <option>Best Sale</option>
                                            <option>Sale</option>
                                            <option>Comming Soon</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Form.Group controlId="formDescription" className="mt-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
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
                                    required
                                />
                            </Form.Group>

                            <Button className="mt-3" variant="primary" type="submit">Save Changes</Button>
                        </Form>
                    </Modal.Body>
                </Modal>


            </Row>
            {
                isLazyLoading && (
                    <div className="loading-placeholder">
                        <Button className='btn-showmore' onClick={handleShowMoreClick}>Show More</Button>
                    </div>
                )
            }

        </>

    );
};

export default ProductList;
