import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Button, Modal, Form, Container } from 'react-bootstrap';
import ProductList from '../Component/ProductList';
import { useIntersectionObserver } from '../ComponentShop/hook';
import StickyFilter from '../ComponentShop/stickyfiter';
import { CatalogContext } from './AdminDashBoard';
import axios from 'axios';
import '../ComponentShop/shop.css';

function ProductsAdmin() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [visibleCount, setVisibleCount] = useState(16);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [activePriceRange, setActivePriceRange] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [catalog, setCatalog] = useState('');
    const [condition, setCondition] = useState('');
    const [color, setColor] = useState('');
    const [slogan, setSlogan] = useState('');
    const [img, setImg] = useState('');
    const [file, setFile] = useState(null);
    const { selectedCatalog, handleSelectCatalog } = useContext(CatalogContext);

    //Upload img to cloudynary
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadImgCloudinary = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ImgUser_Products');
        formData.append('cloud_name', 'Img_Products');

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

    //Lazy Loading 
    const [loadingRef, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
    useEffect(() => {
        if (isIntersecting) {
            setVisibleCount(prevCount => prevCount + 16);
        }
    }, [isIntersecting]);

    // Get Catalog from database
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                const shuffledData = shuffleArray(data);
                const filteredByCatalog = selectedCatalog
                    ? shuffledData.filter(product => product.catalog === selectedCatalog)
                    : shuffledData;

                setProducts(filteredByCatalog);

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [selectedCatalog]);


    //handle filter price and color
    useEffect(() => {
        let filtered = [...products];

        if (selectedPriceRange) {
            const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
            filtered = filtered.filter(product => {
                const price = parseFloat(product.price);
                return price >= minPrice && (maxPrice ? price <= maxPrice : true);
            });
        }

        if (selectedColors.length > 0) {
            filtered = filtered.filter(product => {
                const productColors = product.color.split(', ').map(color => color.trim());
                return selectedColors.every(color => productColors.includes(color));
            });
        }

        if (selectedCatalog) {
            filtered = filtered.filter(product => product.catalog === selectedCatalog);
        }

        setFilteredProducts(filtered);
    }, [selectedPriceRange, selectedColors, products, selectedCatalog]);


    const handleSelectSort = (sort, event) => {
        if (sort === activePriceRange) {
            setSelectedPriceRange('');
            setActivePriceRange(null);
            setFilteredProducts(products);
            return;
        }
        const el = event.currentTarget;
        const ctnEl = el.closest('.price-options');

        if (ctnEl) {
            const els = ctnEl.querySelectorAll('.price-option');
            [...els].forEach(el => {
                el.classList.remove('active');
            });
            el.classList.add('active');
        }
        let sortedProducts = [...filteredProducts];

        if (sort === 'price_low') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_high') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else {
            console.error('Giá trị sort không hợp lệ:', sort);
        }
        setFilteredProducts(sortedProducts);
        setActivePriceRange(sort);
    };


    const handleSelectPriceRange = (range, event) => {

        if (range === activePriceRange) {
            setSelectedPriceRange('');
            setActivePriceRange(null);
            setFilteredProducts(products);
            return;
        }
        const el = event.currentTarget;
        const ctnEl = el.closest('.price-options');

        if (ctnEl) {
            const els = ctnEl.querySelectorAll('.price-option');
            [...els].forEach(el => {
                el.classList.remove('active');
            });
            el.classList.add('active');
        }

        setSelectedPriceRange(range);
        setActivePriceRange(range);
    };

    // Color filter
    const handleToggleColor = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const handleDoubleClickColor = (color) => {
        setSelectedColors(selectedColors.filter(c => c !== color));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        let imageUrl = '';

        if (file) {
            imageUrl = await uploadImgCloudinary();
            if (!imageUrl) {
                alert('Error uploading avatar. Please try again.');
                return;
            }
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('catalog', catalog);
        formData.append('condition', condition);
        formData.append('oldPrice', oldPrice);
        formData.append('color', color);
        formData.append('slogan', slogan);
        formData.append('img', imageUrl || img);

        try {
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setProducts([...products, response.data.product]);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };


    const handleUpdateProduct = (product) => {
        setCurrentProduct(product);
        setShowEditModal(true);
    };
    const handleDeleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/products/${productId}`);

            if (response.status === 200) {

                setProducts(products.filter(product => product._id !== productId));
            } else {
                console.error('Failed to delete product:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const handleCloseAddModal = () => setShowAddModal(false);


    return (
        <Container fluid>
            <Row >
                <Col md={2} className="sticky-filter">
                    <StickyFilter
                        handleAddProduct={handleAddProduct}
                        setShowAddModal={setShowAddModal}
                        activePriceRange={activePriceRange}
                        handleSelectPriceRange={handleSelectPriceRange}
                        handleSelectSort={handleSelectSort}
                        selectedColors={selectedColors}
                        handleToggleColor={handleToggleColor}
                        handleDoubleClickColor={handleDoubleClickColor}
                    />
                </Col>

                <Col md={10} className='img-products'>
                    <ProductList
                        products={filteredProducts}
                        onCatalogChange={handleSelectCatalog}
                        selectedCatalog={selectedCatalog}
                        handleUpdateProduct={handleUpdateProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                    <div ref={loadingRef}></div>
                </Col>
            </Row>

            {/* Add product modal */}
            <Modal show={showAddModal} onHide={handleCloseAddModal} >
                <Modal.Header>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>

                <Modal.Body onSubmit={handleAddProduct}>

                    <Form >
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formProductName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formProductSlogan">
                                    <Form.Label>Slogan</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product slogan"
                                        value={slogan}
                                        onChange={(e) => setSlogan(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formProductPrice" className="mt-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formProductCatalog" className="mt-3">
                                    <Form.Label>Catalog</Form.Label>
                                    <Form.Control
                                        value={catalog}
                                        onChange={(e) => setCatalog(e.target.value)}
                                        required
                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formProductColor" className="mt-3">
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formProductCondition" className="mt-3">
                                    <Form.Label>Condition</Form.Label>
                                    <Form.Control
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {condition === 'Sale' && (
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formProductOldPrice" className="mt-3">
                                        <Form.Label>Old Price</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter old price"
                                            value={oldPrice}
                                            onChange={(e) => setOldPrice(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Form.Group controlId="formImg" className="mt-3">
                            <Form.Label>Image URL (or upload new file)</Form.Label>
                            <Form.Control
                                type="text"
                                name="img"
                                value={img}
                                onChange={(e) => setImg(e.target.value)}
                                placeholder="Enter image URL"
                            />
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                accept=".jpg, .jpeg, .png"
                            />
                        </Form.Group>

                        <Form.Group controlId="formProductDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Add Product
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>


        </Container>

    );
}

export default ProductsAdmin;