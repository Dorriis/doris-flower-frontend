import React from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { ShoppingCart } from 'react-feather';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './Cardproduct.css';

const CardProduct = ({ product, onAddToCart, onClick, onEditProduct, onDeleteProduct }) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const role = user?.isAdmin ? 'admin' : 'user';

    const handleEditProduct = () => {
        onEditProduct(product);
    };

    const handleDeleteProduct = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDeleteProduct(product);
        }
    };
    const handleAddToCart = () => {
        onAddToCart(product);
    };

    return (
        <Col key={product._id} >
            <Card >
                <div
                    className="card-img-container"
                    onClick={() => onClick(product)}
                >
                    <Card.Img className="card-img-product" src={product.img} variant="top" />

                </div>

                <Card.Body className='img-card-body'>
                    <div className="card-header">
                        <Card.Title className='title-card' as="div">
                            <strong>{product.name}</strong>
                        </Card.Title>
                        {product.condition === 'New' && <div className="card-condition New">New</div>}
                        {product.condition === 'Sale' && <div className="card-condition Sale">Sale</div>}
                        {product.condition === 'Comming Soon' && <div className="card-condition comming">Comming Soon</div>}
                        {product.condition === 'Best Sale' && <div className="card-condition best">Best Sale</div>}
                    </div>
                    <Card.Text className='text-card' as="h3">
                        ${product.price && !isNaN(product.price) ? product.price.toFixed(2) : 'N/A'}
                        {product.condition === 'Sale' && product.oldPrice && !isNaN(product.oldPrice) && (
                            <span className="card-old-price">
                                ${product.oldPrice.toFixed(2)}
                            </span>
                        )}
                        <ShoppingCart
                            strokeWidth={1.5}
                            size={20}
                            className="add-to-cart"
                            onClick={handleAddToCart}
                        />
                    </Card.Text>
                    {role === 'admin' && (
                        <div className='btn-product'>
                            <Button className="btn-edit-product" onClick={handleEditProduct}>Edit</Button>
                            <Button className="btn-delete-product" onClick={handleDeleteProduct}>Delete</Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

CardProduct.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        oldPrice: PropTypes.number,
        condition: PropTypes.string.isRequired
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default CardProduct;