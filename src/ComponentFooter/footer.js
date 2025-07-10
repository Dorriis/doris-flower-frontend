import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Facebook, Youtube, Instagram } from 'react-feather';
import './footer.css'

function CustomFooter() {
    const googleDriveImageId = '19ervlbXHFZZsjFBshftiq18qu8dBJrfm';
    const imageUrl = `https://drive.google.com/thumbnail?id=${googleDriveImageId}`;
    return (
        <BootstrapNavbar expand="sm" className="custom-footer">
            <Container fluid className="d-flex justify-content-between">
                <Col md={4} className="custom-footer-column">
                    <div className='custom-footer-title'>
                        <h3 className='title-footer'>Informations</h3>
                        <LinkContainer to="/page/about-us">
                            <Nav.Link className='content-title-footer'>About Us</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/page/contact-us">
                            <Nav.Link className='content-title-footer'>Contact Us</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/page/blog">
                            <Nav.Link className='content-title-footer'>Blogs</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/page/return-policy">
                            <Nav.Link className='content-title-footer'>Return Policy</Nav.Link>
                        </LinkContainer>
                    </div>
                </Col>

                <Col md={4} className="custom-footer-column text-center">
                    <BootstrapNavbar.Brand href="/" className="custom-logo-footer">
                        <img
                            src={imageUrl}
                            className="d-inline-block align-top"
                            alt="Doris Flowers logo"

                        />
                        <p className='logo-content-footer'>
                            Where every petal tells a story. Let Doris Flower listen to your story
                        </p>

                    </BootstrapNavbar.Brand>
                </Col>

                <Col md={4} className="custom-footer-column-contact">
                    <h3 className='title-footer'>Contact</h3>
                    <p className='contact-footer'>Hotline: (+84)332.46.46.63</p>
                    <p className='contact-email-footer'>Email: DorisNgoc@gmail.com</p>
                    <div className='footer-item-icons'>
                        <Facebook size={24} strokeWidth={1.25} color='#198754' className='footer-icons' />
                        <Youtube size={24} strokeWidth={1.25} color='#198754' className='footer-icons' />
                        <Instagram size={24} strokeWidth={1.25} color='#198754' className='footer-icons' />
                    </div>
                </Col>
            </Container>
        </BootstrapNavbar>
    );
}

export default CustomFooter;

