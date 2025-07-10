import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ProductList from '../Component/ProductList';
import { useIntersectionObserver } from './hook';
import CartModal from '../ComponentNavbar/CartModal';
import { useCart } from '../Component/useCart';
import StickyFilter from './stickyfiter';
import './shop.css';

function Shop() {
    const location = useLocation();
    const titleFromNavigation = location.state?.title || '';
    const [activeTitle, setActiveTitle] = useState(titleFromNavigation);
    const initialCatalog = location.state?.selectedCatalog || '';
    const [selectedCatalog, setSelectedCatalog] = useState(initialCatalog);
    const [products, setProducts] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activePriceRange, setActivePriceRange] = useState(null);
    const [visibleCount, setVisibleCount] = useState(16);
    const [showCart, setShowCart] = useState(false);
    const { cartItems, addToCart, onQuantityChange, userId } = useCart();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    const handleSelectCatalog = (catalog) => {
        setSelectedCatalog(catalog || 'All');
        setActiveTitle(catalog || 'All');
    };

    // Fetch products and apply filters
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                const shuffledData = shuffleArray(data);
                setProducts(shuffledData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Update filteredProducts when selectedCatalog, selectedPriceRange, selectedColors, or products change
    useEffect(() => {
        let filtered = [...products];

        if (selectedCatalog && selectedCatalog !== 'All') {
            filtered = filtered.filter(product => product.catalog === selectedCatalog);
        }

        if (selectedPriceRange) {
            const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
            filtered = filtered.filter(product => {
                const price = Number(product.price.toLocaleString());
                return !isNaN(price) && price >= minPrice && (maxPrice ? price <= maxPrice : true);
            });
        }

        if (selectedColors.length > 0) {
            filtered = filtered.filter(product => {
                const productColors = product.color.split(', ').map(color => color.trim());
                return selectedColors.every(color => productColors.includes(color));
            });
        }

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [selectedCatalog, selectedPriceRange, selectedColors, products, searchQuery]);

    // Lazy Loading
    const [loadingRef, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
    useEffect(() => {
        if (isIntersecting) {
            setVisibleCount(prevCount => prevCount + 16);
        }
    }, [isIntersecting]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

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
            [...els].forEach(el => el.classList.remove('active'));
            el.classList.add('active');
        }

        let sortedProducts = [...filteredProducts];
        if (sort === 'price_low') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_high') {
            sortedProducts.sort((a, b) => b.price - a.price);
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
            [...els].forEach(el => el.classList.remove('active'));
            el.classList.add('active');
        }

        setSelectedPriceRange(range);
        setActivePriceRange(range);
    };
    const UpdatevalueSearch = searchQuery

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

    const handleAddToCart = (product) => {
        addToCart(product);
        handleShowCart();
    };

    return (
        <>
            <div className="sticky-header">
                <Row className="my-3 align-items-center sticky-nav " style={{ paddingLeft: "0px" }}>
                    <Col md={10} className="d-flex align-items-center justify-content-start">
                        <Button
                            variant="link"
                            className={activeTitle === 'All' ? 'active-title' : ''}
                            onClick={() => handleSelectCatalog('')}
                        >
                            All
                        </Button>
                        <Button
                            variant="link"
                            className={activeTitle === 'Wedding Flower' ? 'active-title' : ''}
                            onClick={() => handleSelectCatalog('Wedding Flower')}
                        >
                            Wedding Flower
                        </Button>
                        <Button
                            variant="link"
                            className={activeTitle === 'Bouquet Flower' ? 'active-title' : ''}
                            onClick={() => handleSelectCatalog('Bouquet Flower')}
                        >
                            Bouquet Flower
                        </Button>
                        <Button
                            variant="link"
                            className={activeTitle === 'Flower Basket' ? 'active-title' : ''}
                            onClick={() => handleSelectCatalog('Flower Basket')}
                        >
                            Flower Basket
                        </Button>
                        <Button
                            variant="link"
                            className={activeTitle === 'Flower Box And Cake' ? 'active-title' : ''}
                            onClick={() => handleSelectCatalog('Flower Box And Cake')}
                        >
                            Flower Box And Cake
                        </Button>
                        <DropdownButton id="dropdown-sorting-button" title="More" variant="link">
                            <Dropdown.Item onClick={() => handleSelectCatalog('Small Tree')}>Small Tree</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectCatalog('Vases')}>Vases</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col md={2} className="d-flex justify-content-start ">
                        <DropdownButton className='options-price' id="dropdown-sorting-button" title="Default sorting" variant="link">
                            <Dropdown.Item className="price-option" onClick={(e) => handleSelectSort('popularity', e)}>Sort by popularity</Dropdown.Item>
                            <Dropdown.Item className="price-option" onClick={(e) => handleSelectSort('rating', e)}>Sort by average rating</Dropdown.Item>
                            <Dropdown.Item className="price-option" onClick={(e) => handleSelectSort('latest', e)}>Sort by latest</Dropdown.Item>
                            <Dropdown.Item className="price-option" onClick={(e) => handleSelectSort('price_low', e)}>Sort by price: low to high</Dropdown.Item>
                            <Dropdown.Item className="price-option" onClick={(e) => handleSelectSort('price_high', e)}>Sort by price: high to low</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
            </div>

            <Container fluid>
                <Row>
                    <Col md={2} className="sticky-filter">
                        <StickyFilter
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
                            visibleCount={visibleCount}
                            search={UpdatevalueSearch}
                            onAddToCart={handleAddToCart}
                        />
                        <div ref={loadingRef}></div>
                    </Col>
                </Row>

                <CartModal
                    show={showCart}
                    onClose={handleCloseCart}
                    cartItems={cartItems}
                    onQuantityChange={onQuantityChange}
                    userId={userId}
                />
            </Container>
        </>
    );
}

export default Shop;
