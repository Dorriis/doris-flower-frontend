import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './ComponentNavbar/CustomNavbar';
import Profile from './ComponentNavbar/profile';
import LoginRegister from './ComponentNavbar/LoginRegister';
import Checkout from './ComponentNavbar/Checkout';
import BillingDetails from './ComponentNavbar/BillingDetails';
import Payment from './ComponentNavbar/Payment';
import PaymentSuccess from './ComponentNavbar/PaymentSuccess';
import ProductDetailPage from './Component/ProductDetailPage'
import Shop from './ComponentShop/Shop';
import Home from './ComponentHome/Home';
import Page from './ComponentPage/Page';
import AboutUs from './ComponentPage/AboutUs';
import ContactUs from './ComponentPage/ContactUs';
import ReturnPolicy from './ComponentPage/ReturnPolicy';
import Blog from './ComponentPage/Blogs';
import NotFound from './Component/NotFound';
import CustomFooter from './ComponentFooter/footer';
import AdminDashboard from './ComponentAdmin/AdminDashBoard';
import ProductsAdmin from './ComponentAdmin/ProductsAdmin';
import WebsiteAdmin from './ComponentAdmin/WebsiteAdmin'
import { CartProvider } from './Component/useCart';
import './App.css';
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <CartProvider>
      <div className="App">
        <CustomNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shops" element={<Shop setSearchQuery={setSearchQuery} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/page" element={<Page />}>
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="blog" element={<Blog />} />
            <Route path="return-policy" element={<ReturnPolicy />} />
          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />} >
            <Route path="product" element={<ProductsAdmin />} />
            <Route path="website" element={<WebsiteAdmin />} />
          </Route>
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/billing-details" element={<BillingDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymentsuccess" element={< PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
        <CustomFooter />

      </div>
    </CartProvider>

  );
}

export default App;
