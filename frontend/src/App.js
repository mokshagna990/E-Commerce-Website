import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header/header';
import Footer from './components/footer';
import Home from './pages/home';
import Cart from './pages/cart';
import Login from './pages/login';
import Register from './pages/register';
import ProductDetail from './pages/productDetails';
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Chatbot from './components/Chatbot/Chatbot';
import Profile from './pages/profile'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/wishlist';
import Addresses from './components/Addresses';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? children : <Navigate to="/login" replace />;
};
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f5f5f5;
  position: relative;
`;

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 9999;
`; 

function App() {
  return (
    <GoogleOAuthProvider clientId="13687418787-vs6tskkdb8dvgcouo049feeu1kitco7j.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <AppContainer>
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
              </Routes>
            </main>
            <Footer />
            <FloatingContainer>
              <VoiceAssistant />
              <Chatbot />
            </FloatingContainer>
          </AppContainer>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
