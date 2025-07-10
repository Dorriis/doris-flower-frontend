import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CatalogCard = ({ catalog, imageUrl }) => {
    const navigate = useNavigate();

    return (
        <Col md={4} className='catalogies'>
            <Card className='catalogies-card' onClick={() => navigate('/shops', { state: { catalog } })}>
                <Card.Img className='catalogies-card-img' src={imageUrl} />
                <Card.Title className='catalogies-card-text'>{catalog.toUpperCase()}</Card.Title>
            </Card>
        </Col>
    );
};

export default CatalogCard;
