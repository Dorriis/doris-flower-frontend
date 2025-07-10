import React, { useEffect, useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Form, FormControl, Button, Container, Dropdown, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaSearch, FaUser, FaBars } from "react-icons/fa";
import { ShoppingCart } from 'react-feather';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createAxiosInstance } from '../Component/axiosConfig'
import { logOut } from '../Redux/apiRequest';
import CartModal from './CartModal';
import { useCart } from '../Component/useCart';
import './CustomNavbar.css';
import { logOutSuccess } from '../Redux/authSlice';


function CustomNavbar() {
    const { cartItems, onQuantityChange, userId } = useCart();
    const googleDriveImageId = '19ervlbXHFZZsjFBshftiq18qu8dBJrfm';
    const imageUrl = `https://drive.google.com/thumbnail?id=${googleDriveImageId}`;
    const [searchQuery, setSearchQuery] = useState('');
    const user = useSelector((state) => state.auth.login?.currentUser);
    const Token = user?.accessToken;
    const avatar = user?.avatar || 'https://via.placeholder.com/150';
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let axiosLogoutJwt = createAxiosInstance(user, dispatch, logOutSuccess);
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shops?search=${searchQuery}`);
        } else {
            navigate('/shops');
        }
    };


    const [showCart, setShowCart] = useState(false);

    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    useEffect(() => {
        if (user) {

            if (user.isAdmin && !location.pathname.startsWith('/admin-dashboard')) {
                navigate('/admin-dashboard');
            }
        } else if (!location.pathname.startsWith('/login-register')) {

            navigate('/login-register');
        }
    }, [user, location.pathname, navigate]);

    const handleLogout = async () => {
        logOut(dispatch, navigate, Token, axiosLogoutJwt);
    };


    const handleUserClick = () => {
        if (!user) {
            navigate('/login-register');
        }
    };

    const role = user?.isAdmin ? 'admin' : 'user';

    return (
        <>
            <BootstrapNavbar bg="white" expand="sm" className="custom-navbar">
                <Container fluid>

                    <Col md={4} className="custom-menu">
                        <Button
                            variant="light"
                            className="d-md-none custom-toggle-btn"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <FaBars size={20} />
                        </Button>

                        <Nav className={`mr-auto custom-nav ${showMenu ? "d-block" : "d-none d-md-flex"}`}>
                            {role === "admin" ? (
                                <LinkContainer to="/admin-dashboard">
                                    <Nav.Link>Admin Manager</Nav.Link>
                                </LinkContainer>
                            ) : (
                                <>
                                    <LinkContainer to="/home" onClick={() => setShowMenu(false)}>
                                        <Nav.Link>Home</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/shops" onClick={() => setShowMenu(false)}>
                                        <Nav.Link>Shops</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/page" onClick={() => setShowMenu(false)}>
                                        <Nav.Link>Page</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/catalogs" onClick={() => setShowMenu(false)}>
                                        <Nav.Link>All Catalogs</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Col>

                    <Col md={3} className='logo'>
                        <BootstrapNavbar.Brand href="/" className="mx-auto custom-logo">
                            <img
                                src={imageUrl}
                                className="d-inline-block align-top"
                                alt="Doris Flowers logo"
                            />
                        </BootstrapNavbar.Brand>
                    </Col>

                    <Col md={5} className="search-form d-flex align-items-center">
                        <Col md={10} className="d-none d-md-block">
                            <Form className="form-inline ml-auto custom-form" onSubmit={handleSearch}>
                                <FormControl
                                    type="text"
                                    placeholder="Search"
                                    className="mr-sm-2 custom-form-control-search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button variant="outline-success" className="custom-search-button" onClick={handleSearch}>
                                    <FaSearch />
                                </Button>
                            </Form>
                        </Col>

                        {/* Hiển thị icon search khi dưới 767px */}
                        <Col md={1} className="d-md-none">
                            <Button variant="outline-success" className="custom-search-button" onClick={handleSearch}>
                                <FaSearch size={20} />
                            </Button>
                        </Col>

                        {/* Giỏ hàng */}
                        <Col md={1}>
                            <Nav className="ml-auto custom-cart">
                                <Nav.Link onClick={handleShowCart}>
                                    <ShoppingCart strokeWidth={1.75} size={20} />
                                </Nav.Link>
                            </Nav>
                        </Col>

                        {/* User */}
                        <Col md={1}>
                            {user ? (
                                <Nav className="ml-auto custom-user">
                                    <Dropdown align="end" className="ml-auto">
                                        <Dropdown.Toggle
                                            className="custom-user-login"
                                            variant="light"
                                            id="dropdown-basic"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                padding: "0px",
                                                marginRight: "24px",
                                                backgroundColor: "#595959",
                                                backgroundImage: `url(${avatar})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        />
                                        <Dropdown.Menu className="custom-dropdown-menu dropdown-menu-end">
                                            <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
                                            <Dropdown.Item onClick={() => navigate("/order-history")}>Order History</Dropdown.Item>
                                            <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Nav>
                            ) : (
                                <Nav className="ml-auto custom-user">
                                    <Nav.Link onClick={handleUserClick}>
                                        <FaUser size={20} />
                                    </Nav.Link>
                                </Nav>
                            )}
                        </Col>
                    </Col>

                </Container>

            </BootstrapNavbar>

            {showCart && (
                <CartModal
                    show={showCart}
                    onClose={handleCloseCart}
                    cartItems={cartItems}
                    onQuantityChange={onQuantityChange}
                    userId={userId}
                />
            )}
        </>
    );
}
export default CustomNavbar;




