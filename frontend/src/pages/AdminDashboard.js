import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🟣 Chart.js Component Registration
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './AdminDashboard.css';

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [salesData, setSalesData] = useState([]); // prediction data
    const navigate = useNavigate();
    const [editingProduct, setEditingProduct] = useState(null);

    // ✅ Component Did Mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }
        fetchProducts();
        fetchPredictions();
    }, [navigate]);

    // ✅ Fetch Products
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    // ✅ Fetch Predicted Sales
    const fetchPredictions = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/analytics/predict-sales', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            // ⚡ Fix salesData.map() error
            if (Array.isArray(data)) {
                setSalesData(data);
            } else {
                setSalesData([]); // fallback to empty array
                console.warn("Prediction API returned unexpected format", data);
            }
        } catch (err) {
            console.error("Prediction API failed", err);
            setSalesData([]);
        }
    };

    // ✅ Update Product Price
    const handlePriceUpdate = async (productId, newPrice) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    price: parseFloat(newPrice) 
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update price');

            setProducts(products.map(p => p._id === productId ? data : p));
            setEditingProduct(null);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to update price');
        }
    };

    if (loading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    // ✅ SAFE Sales Data
    const safeSalesData = Array.isArray(salesData) ? salesData : [];

    // ✅ Chart Data
    const barData = {
        labels: safeSalesData.map(item => item.category),
        datasets: [
            {
                label: 'Predicted Sales (Next Year)',
                data: safeSalesData.map(item => item.predicted_sales),
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderWidth: 1
            }
        ]
    };

    const pieData = {
        labels: safeSalesData.map(item => item.category),
        datasets: [
            {
                label: 'Predicted Sales Share',
                data: safeSalesData.map(item => item.predicted_sales),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ]
            }
        ]
    };

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>

            {/* --- Product Table --- */}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Name</th>
                        <th>Current Price</th>
                        <th>New Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td><img src={product.image} alt={product.name} className="product-image" /></td>
                            <td>{product.name}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>
                                {editingProduct === product._id ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={product.price}
                                        className="price-input"
                                        autoFocus
                                    />
                                ) : (
                                    `$${product.price.toFixed(2)}`
                                )}
                            </td>
                            <td>
                                {editingProduct === product._id ? (
                                    <>
                                        <button
                                            className="update-button"
                                            onClick={(e) => {
                                                const input = e.target.parentNode.parentNode.querySelector('input');
                                                handlePriceUpdate(product._id, input.value);
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="update-button cancel"
                                            onClick={() => setEditingProduct(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="update-button"
                                        onClick={() => setEditingProduct(product._id)}
                                    >
                                        Edit Price
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- Sales Prediction --- */}
            <h2>Predicted Sales for Next Year</h2>
            <div className="charts-section" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '45%' }}>
                    <Bar data={barData} />
                </div>
                <div style={{ width: '45%' }}>
                    <Pie data={pieData} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
