import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Carousel, Container } from 'react-bootstrap';
import '../ComponentHome/Home.css'

const ServiceCard = ({ title, imgSrc, text }) => (
    <Col md={3} className="d-none d-md-block">
        <Card className="service-card">
            <Card.Img variant="top" src={imgSrc} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{text}</Card.Text>
            </Card.Body>
        </Card>
    </Col>
);

const ServicesSection = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const services = [
        {
            title: "Feng Shui Consultation",
            imgSrc: "https://drive.google.com/thumbnail?id=1agA4jLTdbhZhwHnXOJIuCocpq_EDpTeh",
            text: "We provide feng shui consultations to help choose and arrange flowers and plants in your home or office for good luck and prosperity.",
        },
        {
            title: "Flower Arranging Workshops",
            imgSrc: "https://drive.google.com/thumbnail?id=1m3DLqC1VBG8QW9CL2HswDk-fAarFGzsW",
            text: "Join our regular workshops to learn and practice flower arranging techniques from basic to advanced under expert guidance.",
        },
        {
            title: "Event Design and Decoration",
            imgSrc: "https://drive.google.com/thumbnail?id=1ue5364FxAZToXpKds71pv3F7uE_Na-BH",
            text: "Doris Flower designs and decorates flowers for weddings, birthdays, anniversaries, and corporate events, creating stunning spaces.",
        },
        {
            title: "Custom Flower Arrangements",
            imgSrc: "https://drive.google.com/thumbnail?id=1_I5uJqYapCedzE2vwOv4y2QUp6q8SwYh",
            text: "Doris Flower offers personalized flower arrangements for any occasion or event, from simple bouquets to intricate designs.",
        },
    ];

    return (
        <Container>
            {isMobile ? (
                <Carousel
                    interval={3000} pause={false}
                >
                    {services.map((service, index) => (
                        <Carousel.Item key={index}>
                            <Card className="service-card mx-auto" style={{ maxWidth: "80%" }}>
                                <Card.Img variant="top" src={service.imgSrc} />
                                <Card.Body>
                                    <Card.Title>{service.title}</Card.Title>
                                    <Card.Text>{service.text}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <Row>
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ServicesSection;

