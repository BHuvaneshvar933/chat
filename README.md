# Chat App - Fixes & Setup Guide

## Fixes Made to JWT Token Issue

The chat app had an issue with JWT authentication, causing users to be logged out unexpectedly or fail to authenticate. Here’s what we fixed:

1. **JWT Expiry Handling:** The token was expiring too soon or not being refreshed properly. We implemented token refreshing to ensure users stay logged in without manual reauthentication.
2. **Token Storage:** Instead of storing the JWT in local storage (which is insecure), we moved it to HTTP-only cookies for better security.
3. **Middleware Fix:** The authentication middleware was not properly verifying tokens. We ensured that:
   - Tokens are extracted correctly from headers/cookies.
   - Proper error handling is in place for expired or invalid tokens.
4. **CORS Issues:** Some requests were failing due to CORS policy restrictions. We updated the backend to allow proper CORS headers when handling authentication.

## How to Run the Project

### 1. Running the Backend
#### Prerequisites
- Node.js installed
- MongoDB running (locally or on a cloud provider like MongoDB Atlas)

#### Steps
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### 2. Running the Frontend
#### Prerequisites
- Node.js installed

#### Steps
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```plaintext
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

### 3. Testing the Application
- Open your browser and go to `http://localhost:5173`
- Sign up or log in to test authentication.
- Open DevTools and check cookies to see if the JWT token is stored securely.
- Ensure chat messages and authentication work as expected.

---
Now your chat app should be running smoothly with improved JWT authentication! 🚀

