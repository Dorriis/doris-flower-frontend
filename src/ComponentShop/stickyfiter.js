import React from 'react';
import { useSelector } from 'react-redux';
import './shop.css';
import { Button } from 'react-bootstrap';

function StickyFilter({
    selectedColors,
    activePriceRange,
    handleSelectPriceRange,
    handleSelectSort,
    handleToggleColor,
    handleDoubleClickColor,
    setShowAddModal
}) {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const role = user?.isAdmin ? 'admin' : 'user';

    return (
        <div className="filter-container">
            {role === 'admin' && (
                <Button className='btn-addProduct' onClick={() => setShowAddModal(true)}>
                    Add products
                </Button>
            )}
            <div className="filter-section">
                <h5>Sort By Price</h5>
                <div className="price-options">
                    <div
                        className={`price-option ${activePriceRange === '0-50' ? 'active' : ''}`}
                        onClick={(e) => {
                            console.log("Clicked price range: 0-50");
                            handleSelectPriceRange('0-50', e);
                        }}
                    >
                        Under $50
                    </div>
                    <div
                        className={`price-option ${activePriceRange === '50-100' ? 'active' : ''}`}
                        onClick={(e) => {
                            console.log("Clicked price range: 50-100");
                            handleSelectPriceRange('50-100', e);
                        }}
                    >
                        $50 to $100
                    </div>
                    <div
                        className={`price-option ${activePriceRange === '100-' ? 'active' : ''}`}
                        onClick={(e) => {
                            console.log("Clicked price range: 100-");
                            handleSelectPriceRange('100-', e);
                        }}
                    >
                        Over $100
                    </div>

                    <div
                        className={`price-option ${activePriceRange === 'price_low' ? 'active' : ''}`}
                        onClick={(e) => handleSelectSort('price_low', e)}
                    >
                        Low To High
                    </div>
                    <div
                        className={`price-option ${activePriceRange === 'price_high' ? 'active' : ''}`}
                        onClick={(e) => handleSelectSort('price_high', e)}
                    >
                        High To Low
                    </div>
                </div>

                <h5>Color</h5>
                <div className="color-options">
                    {['red', 'pink', 'white', 'orange', 'blue', 'green', 'yellow', 'purple'].map(color => (
                        <div
                            key={color}
                            className={`color-option ${color} ${selectedColors.includes(color) ? 'active' : ''}`}
                            onClick={() => handleToggleColor(color)}
                            onDoubleClick={() => handleDoubleClickColor(color)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StickyFilter;



