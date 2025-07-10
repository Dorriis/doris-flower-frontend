import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'
import { loginUser, registerUser } from '../Redux/apiRequest';
import { useDispatch } from 'react-redux';



function LoginRegister() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Toggle show password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };



  // handle submit login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!email || !password) {
      console.error("Email or password is missing");
      return;
    }

    const newUser = {
      email: email,
      password: password,
    };

    try {

      await loginUser(newUser, dispatch, navigate);


    } catch (error) {
      setError('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle submit register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = {
      username: username,
      email: email,
      password: password,
      isAdmin: false,
    };

    try {

      await registerUser(newUser, dispatch);

    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };


  return (

    <Container className="login-register-container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <Row className="mb-4 text-center">
        <Col>
          <div className="header-title">
            <div
              className={`header-title-item ${isLogin ? 'active' : 'inactive'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </div>
            <div
              className={`header-title-item ${!isLogin ? 'active' : 'inactive'}`}
              onClick={() => setIsLogin(false)}

            >
              Register
            </div>
          </div>
        </Col>
      </Row>

      <form className="login-register-form" onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <h2 className='header-title-form'>Login</h2>
            <input className="custom-form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input className="custom-form-control"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <span className='checkbox-show' >
              <input type="checkbox" onClick={toggleShowPassword} /> Show Password
            </span>
            <button className='btn-login-form' type="submit">Login</button>
          </>
        ) : (
          <>
            <h2 className='header-title-form'>Register</h2>
            <input className="custom-form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Name"
            />
            <input className="custom-form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input className="custom-form-control"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <input className="custom-form-control"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            <span className='checkbox-show' >
              <input type="checkbox" onClick={toggleShowPassword} /> Show Password
            </span>
            <button className='btn-login-form' type="submit">Register</button>
          </>
        )}
      </form>
      {error && <p>{error}</p>}

    </Container>

  );
}

export default LoginRegister;
