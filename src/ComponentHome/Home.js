import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import CatalogCard from './CatalogCard';
import ServicesSection from '../Component/ServiceCard';
import ProductList from '../Component/ProductList';
import CartModal from '../ComponentNavbar/CartModal'
import { useCart } from '../Component/useCart';
import CustomShipping from '../Component/shipping'
import axios from 'axios';
import BlogSlider from '../Component/BlogForm'

function Home() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedButton, setSelectedButton] = useState('All');
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [showCart, setShowCart] = useState(false);
    const { cartItems, addToCart, onQuantityChange, userId } = useCart();
    const [blogs, setBlogs] = useState([]);
    const handleCloseCart = () => setShowCart(false);


    //Get Img from Database

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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
                const data = await response.json();
                const shuffledData = shuffleArray(data);
                setProducts(shuffledData);
                setFilteredProducts(shuffledData.slice(0, 8));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // handle when onclick all products
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setSelectedButton(filter);
        setVisibleProducts(8);
        if (filter === 'All') {
            setFilteredProducts(products.slice(0, 8));
        } else {
            const filtered = products.filter(product => product.condition === filter);
            setFilteredProducts(filtered.slice(0, 8));
        }
    };

    // Handle "Show More" button click
    const navigate = useNavigate();

    const handleShowMore = () => {
        navigate('/shops', { state: { title: 'All', catalog: '' } });
    };


    //get product blogs from api

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Blogs`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setBlogs(response.data);
                } else {
                    console.warn('No blogs available in the response:', response.data);
                    setBlogs([]);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    //Link read my story to page 
    const handleButtonClick = () => {
        navigate('/page/about-us');
    }

    //Link from our blogs
    const handleBlogsClick = () => {
        navigate('/page/blog')
    }

    return (
        <Container>
            <div className="banner">
                <h1>Bring Spring To Your Life</h1>
            </div>
            <h2 className="mt-4">Service</h2>

            <ServicesSection />
            <h2 className="mt-4" > Discover Catalogies</h2>

            <Row className='catalog-card'>
                <CatalogCard catalog='Wedding Flower' imageUrl='https://drive.google.com/thumbnail?id=1yBZWSjgmnAcHKqHojm_v4K27nl00yqUn' z />
                <CatalogCard catalog='Bouquet Flower' imageUrl='https://drive.google.com/thumbnail?id=168N539CTDctVprRA8gDpLJWGImccL2zz' />
                <CatalogCard catalog='Flower Basket' imageUrl='https://drive.google.com/thumbnail?id=189Q5zFHvONKDCvhJP1yNML1PdM7Hnw7M' />
                <CatalogCard catalog='Flower Box And Cake' imageUrl='https://drive.google.com/thumbnail?id=17LUkFHusyF77XfI6rYMLf2zzY4nxOiKb' />
                <CatalogCard catalog='Small Tree' imageUrl='https://truegreennursery.com.au/wp-content/uploads/Spathiphyllum_Emerald_Star-1b_LowRes.jpg' />
                <CatalogCard catalog='Vases' imageUrl='https://drive.google.com/thumbnail?id=1D3tNS9EwVl_2wVzVJihbX0SzK_YY9Eyd' />
            </Row>

            <div className="all-products">
                <Button
                    className="all-products-title"
                    style={{
                        fontWeight: selectedButton === 'All' ? '500' : 'normal',
                        fontSize: selectedButton === 'All' ? '20px' : '18px',
                    }}
                    onClick={() => handleFilterChange('All')}
                >
                    All products
                </Button>
                <Button
                    className="all-products-title"
                    style={{
                        fontWeight: selectedButton === 'New' ? '500' : 'normal',
                        fontSize: selectedButton === 'New' ? '20px' : '18px',
                    }}
                    onClick={() => handleFilterChange('New')}
                >
                    New products
                </Button>
                <Button
                    className="all-products-title"
                    style={{
                        fontWeight: selectedButton === 'Sale' ? '500' : 'normal',
                        fontSize: selectedButton === 'Sale' ? '20px' : '18px',
                    }}
                    onClick={() => handleFilterChange('Sale')}
                >
                    Sales
                </Button>
            </div>



            <div className='row-img-allproducts'>
                <Row className='row-btn-showmore'>
                    <ProductList
                        products={filteredProducts.slice(0, visibleProducts)}
                        handleShowMore={handleShowMore}
                        isLazyLoading={visibleProducts <= filteredProducts.length}
                        onAddToCart={addToCart}
                    />

                </Row>
                <>

                    <CartModal
                        show={showCart}
                        onClose={handleCloseCart}
                        cartItems={cartItems}
                        onQuantityChange={onQuantityChange}
                        userId={userId}
                    />
                </>

            </div>

            <div className="banner-our-story">
                <span className='banner-story'>
                    <h2 className='banner-header'>Gracefully of flowers</h2>
                    <button className='banner-btn' onClick={handleButtonClick}>Read our story </button>
                </span>
            </div>

            <h4 className="mt-4" onClick={handleBlogsClick}>From Our Blogs </h4>

            <BlogSlider blogs={blogs} />

            <div className="banner-workshops">
                <span className='workshops-text'>
                    <h2 className='workshops-header'>Join Us for a Flower Arranging Workshop</h2>
                    <p className='workshops-p'>This workshop will help you not only improve your flower arranging skills but also relax and connect with like-minded individuals. Come and enjoy an inspiring artistic space with us!</p>
                    <button className='btn-workshops' onClick={handleBlogsClick}> Join now </button>
                </span>
            </div>

            <CustomShipping />
        </Container>
    );
}

export default Home;