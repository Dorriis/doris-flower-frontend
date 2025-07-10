import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Share2, ShoppingCart } from 'react-feather';
import { useCart } from '../Component/useCart';
import './productDetailPage.css'
import axios from 'axios';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [productResponse, allProductsResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/products/${id}`),
                    axios.get('http://localhost:5000/api/products')
                ]);
                setProduct(productResponse.data);
                setProducts(allProductsResponse.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProducts();
        } else {
            setError(new Error("Product ID is missing"));
            setLoading(false);
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching products: {error.message}</div>;
    if (!product) return <div>Product not found</div>;



    const handleAddToCart = () => {
        addToCart({ ...product, price: parseFloat(product.price), quantity });
    };

    const relatedProducts = products
        .filter(p => p.catalog === product.catalog && p._id !== product._id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    return (
        <Container>
            <Row className='details-product'>
                <Col md={6} className='img-details-product'>
                    <Image
                        src={product.img}
                        fluid
                        alt={product.name}
                        style={{ cursor: 'pointer', width: '400', height: '400' }}
                    />
                </Col>
                <Col md={6} className='product-detail-title'>
                    <h3 className='product-detail-name'>{product.name}</h3>
                    <h4 className='product-detail-price'>${product.price}</h4>
                    <p className='product-detail-slogan'>{product.slogan}</p>

                    <Form.Group className='product-detail-body'>
                        <Form.Label className='product-detail-label'>Quantity</Form.Label>
                        <div className="cart-item-quantity-body">
                            <button
                                className='btn-quanity-product-details'
                                onClick={() => setQuantity(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button className='btn-quanity-product-details'
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        className="btn-product-detail"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart
                            className="icon-product-detail"
                            strokeWidth={1}
                            size={20}
                        />
                        Add to Cart
                    </Button>

                    <Share2
                        className='icon-share-product-details'
                        strokeWidth={1}
                        size={20}
                    />

                </Col>
            </Row>

            <div className='description-product-details'>
                <h3 className='description-product-details-title' >Description</h3>
                <p className="mt-3">{product.description}</p>
            </div>


            <Row className="mt-4">
                <h5 className="related-product-details-title">Related Products</h5>
                {relatedProducts.length > 0 ? (
                    relatedProducts.map((relatedProduct) => (
                        <Col key={relatedProduct._id} md={3} className="mt-3">
                            <div className="related-product-item">
                                <Image className='card-img-product' src={relatedProduct.img} alt={relatedProduct.name} />
                                <div className="img-card-body">
                                    <div className="card-header">
                                        <h6 className="title-card card-title">
                                            <strong>{relatedProduct.name}</strong>
                                        </h6>
                                        {relatedProduct.condition === 'New' && (
                                            <div className="card-condition New">New</div>
                                        )}
                                        {relatedProduct.condition === 'Sale' && (
                                            <div className="card-condition Sale">Sale</div>
                                        )}
                                        {relatedProduct.condition === 'Comming Soon' && (
                                            <div className="card-condition comming">Comming Soon</div>
                                        )}
                                        {relatedProduct.condition === 'Best Sale' && (
                                            <div className="card-condition best">Best Sale</div>
                                        )}
                                    </div>
                                    <p className="text-card card-text">
                                        ${relatedProduct.price.toFixed(2)}
                                        {relatedProduct.condition === 'Sale' && (
                                            <span className="card-old-price">
                                                ${relatedProduct.oldPrice.toFixed(2)}
                                            </span>
                                        )}
                                        <ShoppingCart
                                            strokeWidth={1.5}
                                            size={20}
                                            className="add-to-cart"
                                            onClick={() => addToCart({ ...relatedProduct, quantity: 1 })}
                                        />
                                    </p>
                                </div>
                            </div>
                        </Col>
                    ))
                ) : (
                    <div>No related products found.</div>
                )}
            </Row>
        </Container>
    );
};

export default ProductDetailPage;
