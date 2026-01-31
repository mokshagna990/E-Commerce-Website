# E-Commerce Website

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with AI-powered product recommendations, user authentication, shopping cart, wishlist, and order management features.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Google OAuth**: Sign in with Google integration
- **Product Browsing**: Browse and search through product catalog
- **Shopping Cart**: Add, update, and remove items from cart
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders and track order history
- **Address Management**: Save and manage multiple delivery addresses
- **AI Recommendations**: Personalized product recommendations based on browsing history

### Technical Features
- RESTful API architecture
- JWT-based authentication
- MongoDB database with Mongoose ODM
- Redux Toolkit for state management
- Responsive UI with Material-UI and Styled Components
- Real-time cart and wishlist updates
- Comprehensive error handling and logging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd E_COMMERCE_WEBSITE
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the following content and update with your values
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
# Copy the following content
```

Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
BROWSER=none
PORT=3000
```

```bash
# Start the frontend development server
npm start
```

The frontend application will run on `http://localhost:3000`

## 📁 Project Structure

```
E_COMMERCE_WEBSITE/
├── backend/
│   ├── config/          # Database and configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── python/          # AI recommendation scripts
│   ├── logs/            # Application logs
│   ├── server.js        # Express server entry point
│   └── package.json     # Backend dependencies
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store and slices
│   │   ├── services/    # API service calls
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main application component
│   ├── package.json     # Frontend dependencies
│   └── SETUP_INSTRUCTIONS.md
│
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/google-login` - Google OAuth login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Recommendations
- `GET /api/recommendations` - Get personalized product recommendations

### Addresses
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | Yes |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `PORT` | Frontend port number | No |
| `BROWSER` | Auto-open browser (none/default) | No |

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Verify your `MONGODB_URI` is correct
- Ensure MongoDB is running (if using local installation)
- Check network connectivity for MongoDB Atlas

**JWT Authentication Error**
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration settings

### Frontend Issues

**Blank Page on Load**
- Check browser console for errors (F12)
- Verify backend server is running
- Ensure `REACT_APP_API_URL` points to correct backend URL

**CORS Errors**
- Verify backend CORS configuration allows `http://localhost:3000`
- Check if frontend and backend are running on correct ports

**Dependencies Not Installing**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📦 Technologies Used

### Frontend
- React 18.2.0
- Redux Toolkit
- React Router DOM
- Material-UI (MUI)
- Styled Components
- Axios
- Chart.js
- React Icons
- Google OAuth

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- Winston (logging)
- Google Auth Library
- CORS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React team for the frontend framework
