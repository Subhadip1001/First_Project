# Backend JWT Auth and MongoDB

## Features

  - **JWT Authentication**: Secure login/signup with JWT tokens
  - **Role-based Access**: Manager, Team Lead, and Executive roles
  - **Reference ID Validation**: Users must provide correct reference IDs to sign up
  - **MongoDB Integration**: Using Mongoose for data modeling
  - **Security**: Helmet, rate limiting, data sanitization, and more
  - **Error Handling**: Comprehensive error handling with custom error classes

## Project Structure

```
Backend_Project_root/
├── app.js
├── .env
├── .gitignore
├── server.js
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── errorController.js
│   ├── executiveController.js
│   ├── projectController.js
│   ├── receivedDataController.js
│   ├── reportController.js
│   ├── reviewController.js
│   ├── salaryController.js
│   ├── teamController.js
│   ├── tlReviewController.js
│   └── userController.js
├── endpoints/
│   ├── ExecutiveEndP.md
│   ├── ManagerEndPoints.md
│   ├── TeamLeadEP.md
│   └── Endpoints.md
├── models/
│   ├── Project.js
│   ├── ReceivedData.js
│   ├── Review.js
│   ├── Team.js
│   ├── TLReview.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── executiveRoutes.js
│   ├── projectRoutes.js
│   ├── receivedDataRoutes.js
│   ├── reportRoutes.js
│   ├── reviewRoutes.js
│   ├── salaryRoutes.js
│   ├── teamRoutes.js
│   ├── tlReviewRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── appError.js
│   └── catchAsync.js
├── package.json
├── package-lock.json
└── Postman_collection.json
```

## Setup Instructions

### 1\. Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

MANAGER_SIGNUP_REFID=manager
TEAM_LEAD_SIGNUP_REFID=teamlead
EXECUTIVE_SIGNUP_REFID=executive
```

### 2\. Backend Setup

```bash
# Install backend dependencies
npm install

# Start the backend server
npm run dev
```


### API Endpoints

#### Authentication
* **POST** `/api/auth/signup` - User registration.
* **POST** `/api/auth/login` - User login.
* **GET** `/api/auth/logout` - User logout.

#### Users
* **GET** `/api/users/me` - Get current user's profile.
* **PATCH** `/api/users/updateMe` - Update current user's information.
* **DELETE** `/api/users/deleteMe` - Deactivate current user's account.
* **GET** `/api/users` - Get all users (Manager only).
* **POST** `/api/users` - Create a new user (Manager only).
* **GET** `/api/users/:id` - Get a user by ID (Manager only).
* **PATCH** `/api/users/:id` - Update a user by ID (Manager only).
* **DELETE** `/api/users/:id` - Delete a user by ID (Manager only).

#### Teams
* **GET** `/api/teams` - Get all teams (Accessible by all roles).
* **POST** `/api/teams` - Create a new team (Manager only).
* **GET** `/api/teams/:id` - Get a team by ID (Manager and Team Lead only).
* **PATCH** `/api/teams/:id` - Update a team by ID (Manager only).
* **DELETE** `/api/teams/:id` - Delete a team by ID (Manager only).
* **PATCH** `/api/teams/:id/add-member` - Add a member to a team (Manager and Team Lead only).

#### Dashboard
* **GET** `/api/dashboard/stats` - Get dashboard statistics (Manager and Team Lead only).

#### Projects
* **POST** `/api/projects` - Create a new project (Manager and Team Lead only).
* **GET** `/api/projects` - Get all projects (Manager and Team Lead only).
* **GET** `/api/projects/payout` - Get a list of project payouts (Manager only).
* **GET** `/api/projects/:id` - Get a project by ID (Manager and Team Lead only).
* **PATCH** `/api/projects/:id` - Update a project by ID (Manager and Team Lead only).
* **DELETE** `/api/projects/:id` - Delete a project by ID (Manager only).
* **PATCH** `/api/projects/:id/assign-task` - Assign a task to a user within a project (Manager and Team Lead only).

#### Reviews
* **POST** `/api/reviews` - Create a new review (Manager only).
* **GET** `/api/reviews` - Get all reviews (Manager only).
* **GET** `/api/reviews/:id` - Get a review by ID (Manager only).
* **PATCH** `/api/reviews/:id` - Update a review by ID (Manager only).
* **DELETE** `/api/reviews/:id` - Delete a review by ID (Manager only).

#### Team Lead Reviews
* **GET** `/api/tl/reviews` - Get filtered reviews (Team Lead only).
* **POST** `/api/tl/reviews` - Creates a new review for Team Leads.
* **GET** `/api/tl/reviews/:id` - Gets a specific review for Team Leads.

#### Reports (Manager Only)
* **GET** `/api/reports/team-report` - Get a report of all team members under the manager.
* **GET** `/api/reports/team-report/projects/:userId` - Get a list of projects for a specific team member.

#### Salary API (Manager Only)
* **GET** `/api/salaries` - Retrieves a list of all team members and their latest salary information.
* **POST** `/api/salaries/:userId` - Adds a new salary payment record for a specific user.

#### Received Data API (Manager Only)
* **POST** `/api/received-data` - Creates a new "received data" entry.
* **GET** `/api/received-data` - Retrieves all data received by the manager.
* **GET** `/api/received-data/:id` - Retrieves a single "received data" entry by its ID.
* **PATCH** `/api/received-data/:id` - Updates a "received data" entry.
* **DELETE** `/api/received-data/:id` - Deletes a "received data" entry.

#### Executive-Specific Endpoints
* **GET** `/api/executive/my-projects` - Retrieves the executive's pending and current projects.
* **GET** `/api/executive/completed-projects` - Retrieves the executive's completed projects.
* **GET** `/api/executive/my-payout` - Retrieves the executive's own salary and payment history.

## Role-based Access

### Reference IDs for Signup:

  - **Manager**: Use `manager`
  - **Team Lead**: Use `teamlead`
  - **Employee/Executive**: Use `executive`

### Permissions:

  - **Manager**: Can create/manage users and teams
  - **Team Lead**: Can view teams and manage assigned team members
  - **Executive**: Basic access to their profile and assigned teams

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

## Development

```bash
# Backend development
npm run dev
```

The backend runs on `http://localhost:5000`.

```
```