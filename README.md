# Backend Boilerplate with JWT Auth and MongoDB

A complete backend boilerplate built with Express.js, MongoDB, and JWT authentication, featuring role-based access control.

## Features

- **JWT Authentication**: Secure login/signup with JWT tokens
- **Role-based Access**: Manager, Team Lead, and Executive roles
- **Reference ID Validation**: Users must provide correct reference IDs to sign up
- **MongoDB Integration**: Using Mongoose for data modeling
- **Security**: Helmet, rate limiting, data sanitization, and more
- **Error Handling**: Comprehensive error handling with custom error classes
- **Testing Frontend**: Basic React app for testing the API

## Project Structure

\`\`\`
project-root/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── teamController.js
│   │   └── errorController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Team.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── teamRoutes.js
│   ├── utils/
│   │   ├── appError.js
│   │   └── catchAsync.js
│   ├── config/
│   │   └── database.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend-test/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── Dashboard.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env
└── README.md
\`\`\`

## Setup Instructions

### 1. Environment Setup

Create a `.env` file in the root directory:

\`\`\`env
NODE_ENV=development
PORT=5000
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

MANAGER_SIGNUP_REFID=manager
TEAM_LEAD_SIGNUP_REFID=teamlead
EXECUTIVE_SIGNUP_REFID=executive
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Start the backend server
npm run dev
\`\`\`

### 3. Frontend Test Setup

\`\`\`bash
# Install frontend dependencies
cd frontend-test
npm install

# Start the React app
npm start
\`\`\`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logout` - User logout

### Users (Protected)
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateMe` - Update current user
- `DELETE /api/v1/users/deleteMe` - Delete current user

### Users (Manager Only)
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Teams (Protected)
- `GET /api/v1/teams` - Get all teams
- `POST /api/v1/teams` - Create team (Manager only)
- `GET /api/v1/teams/:id` - Get team by ID
- `PATCH /api/v1/teams/:id` - Update team
- `DELETE /api/v1/teams/:id` - Delete team
- `PATCH /api/v1/teams/:id/add-member` - Add team member

## Role-based Access

### Reference IDs for Signup:
- **Manager**: Use `manager`
- **Team Lead**: Use `teamlead`
- **Executive**: Use `executive`

### Permissions:
- **Manager**: Can create/manage users and teams
- **Team Lead**: Can view teams and manage assigned team members
- **Executive**: Basic access to their profile and assigned teams

## Testing the API

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Try signing up with different roles using the correct reference IDs
4. Test login functionality
5. Explore the dashboard based on your role

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Data sanitization against NoSQL injection
- XSS protection
- HTTP security headers with Helmet
- CORS configuration

## Dependencies

### Backend
- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- bcryptjs - Password hashing
- Helmet - Security headers
- CORS - Cross-origin requests
- And more security middleware

### Frontend Test
- React - UI library
- React Router - Routing
- Basic CSS styling

## Development

\`\`\`bash
# Backend development
cd backend
npm run dev

# Frontend development
cd frontend-test
npm start
\`\`\`

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000`.
