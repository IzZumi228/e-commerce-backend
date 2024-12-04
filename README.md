
# E-Commerce Backend

This is the backend for the E-Commerce platform, which provides the API endpoints for user authentication, product management, checkout processing, and more. It is built with Node.js, Express, and MongoDB.

---

## Features
- **User Authentication:**
  - User registration, login, and profile management
  - JWT-based authentication
  - Password hashing with bcrypt
- **Product Management:**
  - CRUD operations for products
  - Search functionality with fuzzy matching using Fuse.js
- **Category Management:**
  - Fetch and manage product categories
- **Checkout System:**
  - Process orders with cart, payment, and shipping details
  - Admin access to all checkout records
- **Admin Features:**
  - Manage users, products, and checkouts
- **Middleware:**
  - Authentication and authorization middleware
  - Error handling middleware

---

## Tech Stack
- **Backend Framework:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Utilities:** bcrypt for password hashing, Fuse.js for fuzzy searching
- **Environment Variables:** Managed with `dotenv`

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dstoneva/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   OR

   ```bash
   yarn
   ```

3. **Configure the environment variables:**
   - Create a `.env` file in the root directory with the following variables:
     ```
     NODE_ENV=development
     PORT=8080
     API_ROUTE=/api
     MONGO_URI=<your-mongo-uri>
     JWT_SECRET=<your-secret-key>
     ```

4. **Start the server:**
   ```bash
   npm start
   ```

   OR

   ```bash
   yarn start
   ```

5. The backend will be running on `http://localhost:8080`.

---

## API Endpoints

### User Routes
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login
- `GET /api/user/me` - Get the current user's profile (protected)
- `PUT /api/user/` - Update the current user's profile (protected)
- `PUT /api/user/active-status` - Update the user's active status (protected)
- `PUT /api/user/change-password` - Reset the user's password (protected)
- `GET /api/user/get-all` - Admin-only: Get all users
- `GET /api/user/:userId` - Admin-only: Get a specific user

### Product Routes
- `GET /api/products` - Get paginated products (protected)
- `GET /api/products/by-ids` - Get multiple products by IDs (protected)
- `GET /api/products/:productId` - Get a specific product (protected)
- `PUT /api/products/:productId` - Admin-only: Update a product
- `POST /api/products/:productId/comment` - Add a comment to a product (protected)
- `POST /api/products/create` - Admin-only: Create a new product

### Category Routes
- `GET /api/categories` - Get all categories (protected)
- `GET /api/categories/:categoryId` - Get a specific category (protected)

### Checkout Routes
- `GET /api/checkouts` - Admin-only: Get all checkouts
- `GET /api/checkouts/:checkoutId` - Get a specific checkout (protected)
- `POST /api/checkouts/create` - Create a new checkout (protected)

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
