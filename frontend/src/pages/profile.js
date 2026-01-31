import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './profile.css';
import SavedAddresses from '../components/Profile/SavedAddresses';
import OrderHistory from '../components/Profile/OrderHistory';
import UserCoupons from '../components/Profile/UserCoupons';
import HelpCenter from '../components/Profile/HelpCenter';
import UserProfile from '../components/Profile/UserProfile';
import ProductCard from '../components/productCard'; // Import for recommendations

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [purchaseHistory, setPurchaseHistory] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch User Purchase History & Recommendations
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(`/api/user-history/${user?._id}`);
        setPurchaseHistory(response.data);

        // Fetch recommended products based on history
        const recommendationsRes = await axios.get(`/api/recommendations/${user?._id}`);
        setRecommendations(recommendationsRes.data);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    if (user) {
      fetchPurchaseHistory();
    }
  }, [user]);

  // Function to render content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case 'addresses':
        return <SavedAddresses />;
      case 'orders':
        return <OrderHistory />;
      case 'coupons':
        return <UserCoupons />;
      case 'help':
        return <HelpCenter />;
      case 'history': // New: Display purchase history
        return (
          <div>
            <h2>Purchase History</h2>
            {purchaseHistory ? (
              <div>
                <p><strong>Categories Purchased:</strong> {purchaseHistory.categories.join(", ")}</p>
                <p><strong>Average Amount Spent:</strong> ₹{purchaseHistory.average_spent.toFixed(2)}</p>
              </div>
            ) : (
              <p>Loading purchase history...</p>
            )}
            <h2>Recommended for You</h2>
            <div className="product-grid">
              {recommendations.length > 0 ? (
                recommendations.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p>No recommendations available.</p>
              )}
            </div>
          </div>
        );
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <h3>{user?.username || 'User'}</h3>
          <p>{user?.email}</p>
        </div>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'addresses' ? 'active' : ''} 
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={activeTab === 'coupons' ? 'active' : ''} 
          onClick={() => setActiveTab('coupons')}
        >
          Coupons
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''} 
          onClick={() => setActiveTab('history')}
        >
          Purchase History
        </button>
        <button 
          className={activeTab === 'help' ? 'active' : ''} 
          onClick={() => setActiveTab('help')}
        >
          Help
        </button>
      </div>
      <div className="profile-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
