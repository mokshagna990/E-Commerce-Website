# Setup Instructions for E-Shop Frontend

To get the website working, follow these steps:

1. **Install Dependencies**
   ```bash
   # Navigate to the frontend directory
   cd frontend

   # Install all required packages
   npm install
   ```

2. **Start the Development Server**
   ```bash
   # Start the React development server
   npm start
   ```

3. **Verify the Application**
   - The application should automatically open in your browser
   - If it doesn't, manually open [http://localhost:3000](http://localhost:3000)
   - You should see the E-Shop homepage with:
     - A blue header with navigation links
     - A grid of sample products
     - A footer at the bottom

4. **Troubleshooting**
   If you don't see anything on the website:
   
   a. Check if all dependencies are installed:
   ```bash
   # Verify node_modules exists and dependencies are installed
   npm list --depth=0
   ```

   b. Clear npm cache and reinstall:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

   c. Check console for errors:
   - Open browser developer tools (F12)
   - Look for any error messages in the Console tab

5. **Required Dependencies**
   Make sure these packages are installed:
   - @reduxjs/toolkit
   - react-redux
   - react-router-dom
   - styled-components

6. **Port Configuration**
   - The application is configured to run on port 3000
   - Make sure no other application is using this port
   - Check that the .env file contains:
     ```
     BROWSER=none
     PORT=3000
     ```

If you still experience issues after following these steps, check:
1. Node.js version (should be 14.x or higher)
2. npm version (should be 6.x or higher)
3. Any firewall or security software blocking localhost:3000