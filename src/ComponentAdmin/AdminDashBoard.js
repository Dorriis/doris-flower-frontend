import React, { useEffect, useState, createContext } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';


export const CatalogContext = createContext();

function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const initialCatalog = location.state?.selectedCatalog || '';
    const [selectedCatalog, setSelectedCatalog] = useState(initialCatalog);


    // Handle Catalog
    const handleSelectCatalog = (catalog) => {
        setSelectedCatalog(catalog);
    };

    useEffect(() => {
        if (user) {
            if (user.isAdmin) {
                if (location.pathname === '/admin-dashboard') {
                    navigate('/admin-dashboard/product');
                } else if (!location.pathname.startsWith('/admin-dashboard')) {
                    navigate('/admin-dashboard');
                }
            }
        } else {
            navigate('/home');
        }
    }, [user, navigate, location]);

    return (

        <CatalogContext.Provider value={{ selectedCatalog, handleSelectCatalog }}>
            <Container fluid>
                <Row className="my-3 align-items-center sticky-nav">
                    <Col md={10} className="d-flex align-items-center">
                        <Button
                            variant="link"
                            className={location.pathname === '/admin-dashboard/product' ? "active-link" : "button-link"}
                            onClick={() => navigate('/admin-dashboard/product')}
                        >
                            Products
                        </Button>
                        <Button
                            variant="link"
                            className={location.pathname === '/admin-dashboard/website' ? "active-link" : "button-link"}
                            onClick={() => navigate('/admin-dashboard/website')}
                        >
                            Website
                        </Button>
                        <Button
                            variant="link"
                            className={location.pathname === '/admin-dashboard/customer' ? "active-link" : "button-link"}
                            onClick={() => navigate('/admin-dashboard/customer')}
                        >
                            Customers
                        </Button>
                        <Button
                            variant="link"
                            className={location.pathname === '/admin-dashboard/order' ? "active-link" : "button-link"}
                            onClick={() => navigate('/admin-dashboard/order')}
                        >
                            Order
                        </Button>
                        <Button
                            variant="link"
                            className={location.pathname === '/admin-dashboard/employee' ? "active-link" : "button-link"}
                            onClick={() => navigate('/admin-dashboard/employee')}
                        >
                            Employee
                        </Button>
                    </Col>

                    <Col md={2} className="d-flex align-items-center">
                        <DropdownButton className="options-price" id="dropdown-sorting-button" title="Catalog" variant="link">
                            <Dropdown.Item onClick={() => handleSelectCatalog('')}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Wedding Flower')}>Wedding Flower</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Bouquet Flower')}>Bouquet Flower</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Flower Basket')}>Flower Basket</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Flower Box And Cake')}>Flower Box And Cake</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Small Tree')}>Small Tree</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Vases')}>Vases</Dropdown.Item>

                        </DropdownButton>
                    </Col>
                </Row>

                <Outlet />
            </Container>

        </CatalogContext.Provider>

    );
}

export default AdminDashboard;
