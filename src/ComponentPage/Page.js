import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ServicesSection from '../Component/ServiceCard';
import CustomShipping from '../Component/shipping';
import './Page.css'

function Page() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the current path is the "About Us" page or "/page"
    const isAboutUs = location.pathname === '/page/about-us' || location.pathname === '/page';

    //Link to shop
    const handleShopClick = () => {
        navigate('/shops')
    }

    return (
        <Container>
            <Row className="my-3 justify-content-center ">
                <Col md={10} className="d-flex justify-content-between">
                    <Button
                        variant="link"
                        className={isAboutUs ? "active-link" : "button-link"}
                        onClick={() => navigate('/page/about-us')}
                    >
                        About Us
                    </Button>
                    <Button
                        variant="link"
                        className={location.pathname === '/page/contact-us' ? "active-link" : "button-link"}
                        onClick={() => navigate('/page/contact-us')}
                    >
                        Contact Us
                    </Button>
                    <Button
                        variant="link"
                        className={location.pathname === '/page/blog' ? "active-link" : "button-link"}
                        onClick={() => navigate('/page/blog')}
                    >
                        From Our Blog
                    </Button>
                    <Button
                        variant="link"
                        className={location.pathname === '/page/return-policy' ? "active-link" : "button-link"}
                        onClick={() => navigate('/page/return-policy')}
                    >
                        Return Policy
                    </Button>
                </Col>
            </Row>

            <Outlet />
            {isAboutUs && (
                <>
                    <Row className='row-journey-img-page'>
                        <Col md={6} className='journey-img-page'>
                            <img
                                src="https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.30808-6/483062669_623479697257322_5221709891554190531_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHRn7pMeyGiY7LjldFS2rYdCzsRK36PeaMLOxErfo95oymuBd1cAVEnqy5QkGZ6S93ImXDquj7jTtVB3lxMnseb&_nc_ohc=EnyaNTNU1QEQ7kNvwGzYyKo&_nc_oc=AdntyCgpDm-HhrTbw9xCtyAks-GGrmK41km-LGV0TG2n-aubXOjFWTLzGEWMTV-qKqUw9xwYPFb_Sewyq1kdxWfT&_nc_zt=23&_nc_ht=scontent.fsgn13-1.fna&_nc_gid=dnH6CWy1q94Gl7U7WLsYrA&oh=00_AfRARjX4hLHVOcXDd0gabm47HWk_GqmAd1szAYcpF3DlsQ&oe=687558C9"
                                alt="Journey img"
                                className="img-journey"
                            />
                        </Col>
                        <Col md={6} className='journey-content-page'>
                            <h2 className='journey-header'>Our Journey to Dreams</h2>
                            <p className='journey-text'>
                                Welcome to Doris Flower, where every petal tells a story. Doris Flower is not just a flower shop; it is an artistic space where we meticulously care for each flower to create delicate and meaningful gifts. With a perfect blend of tradition and modernity, Doris Flower offers you vibrant bouquets, charming potted plants, and unique floral gifts for every occasion. We take pride in the quality of our fresh flowers, carefully selected from the best gardens. Our team members are not just flower sellers but also artisans, always ready to listen and help you create imaginative floral masterpieces. Let Doris Flower accompany you in your memorable moments, making every special occasion truly complete and meaningful.
                            </p>
                            <Button className='journey-btn' onClick={handleShopClick} variant="success">View the shop</Button>
                        </Col>
                    </Row>
                    <>
                        <h2 className="mt-4">Service</h2>
                        <ServicesSection />;
                    </>

                    <div className="container text-center my-5">
                        <div className="position-relative d-inline-block">
                            <img
                                src="https://scontent.fsgn13-2.fna.fbcdn.net/v/t51.75761-15/503898547_17961309980926872_3841993802719510179_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGn0MzGjj4l4jlzj5yQCKWkfZadBFuJn2F9lp0EW4mfYRWKpAF3q5Iwr9zwSUxaezNQw7UytRwqkXqb3CotYYL2&_nc_ohc=6PP2YtAaLw0Q7kNvwEmrMvQ&_nc_oc=AdmjaccNI6jUE7A9GnypD16G0eMf7jVxUJxE2xIO6HdzKUwxW6lsvTaFMDXe8JY-JKBptCSXH6hDinz0YD7z9TV7&_nc_zt=23&_nc_ht=scontent.fsgn13-2.fna&_nc_gid=YU5phRInrsEosZ7f1_mPAA&oh=00_AfTFt3_D5htTiISssjBoIgnUHEsrwze3cPn_4Qz3aAffsQ&oe=687576C5"
                                alt="Video mockup"
                                className="video-img"
                            />
                            <div className="play-button-small">
                                <div className="play-icon-small"></div>
                            </div>
                        </div>
                        <p className="quote-text mt-4">
                            "We will make the experience of finding the perfect potted plants as wonderful as the flowers themselves." <br />
                            <span className="quote-author">— Doris Founder/CEO</span>
                        </p>
                    </div>
                    <CustomShipping />


                </>
            )}

        </Container>
    );
}

export default Page;
