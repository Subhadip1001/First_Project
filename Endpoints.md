### API Endpoints

Here is a complete list of the API endpoints for the backend, based on the provided files.

#### Authentication
* **POST** `/api/auth/signup` - User registration
* **POST** `/api/auth/login` - User login
* **GET** `/api/auth/logout` - User logout

#### Users (Protected)
*These endpoints require an authenticated user.*
* **GET** `/api/users/me` - Get current user's profile
* **PATCH** `/api/users/updateMe` - Update current user's information
* **DELETE** `/api/users/deleteMe` - Deactivate current user's account

#### Users (Manager Only)
*These endpoints require an authenticated user with the `manager` role.*
* **GET** `/api/users` - Get all users
* **POST** `/api/users` - Create a new user
* **GET** `/api/users/:id` - Get a user by ID
* **PATCH** `/api/users/:id` - Update a user by ID
* **DELETE** `/api/users/:id` - Delete a user by ID

#### Teams (Protected)
*These endpoints require an authenticated user. Some actions are role-restricted.*
* **GET** `/api/teams` - Get all teams
* **POST** `/api/teams` - Create a new team (Manager only)
* **GET** `/api/teams/:id` - Get a team by ID
* **PATCH** `/api/teams/:id` - Update a team by ID
* **DELETE** `/api/teams/:id` - Delete a team by ID
* **PATCH** `/api/teams/:id/add-member` - Add a member to a team

#### Dashboard
* **GET** `/api/dashboard/stats` - Get dashboard statistics (Manager only)

#### Projects
*These endpoints are protected and restricted to the `manager` role.*
* **POST** `/api/projects` - Create a new project
* **GET** `/api/projects` - Get all projects
* **GET** `/api/projects/:id` - Get a project by ID
* **PATCH** `/api/projects/:id` - Update a project by ID
* **DELETE** `/api/projects/:id` - Delete a project by ID

#### Reviews
* **POST** `/api/reviews` - Create a new review
* **GET** `/api/reviews` - Get all reviews
* **GET** `/api/reviews/:id` - Get a review by ID
* **PUT** `/api/reviews/:id` - Update a review by ID
* **DELETE** `/api/reviews/:id` - Delete a review by ID

#### Reports (Manager Only)
*These endpoints are protected and restricted to the `manager` role.*
* **GET** `/api/reports/team-report` - Get a report of all team members under the manager, including project stats and deadlines
* **GET** `/api/reports/team-report/projects/:userId` - Get a list of projects for a specific team member
