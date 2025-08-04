# API Endpoints

## Authentication

- **POST** `/api/auth/signup` — User registration
- **POST** `/api/auth/login` — User login
- **GET** `/api/auth/logout` — User logout

## Users (Protected)
*These endpoints require an authenticated user.*

- **GET** `/api/users/me` — Get current user's profile
- **PATCH** `/api/users/updateMe` — Update current user's information
- **DELETE** `/api/users/deleteMe` — Deactivate current user's account

## Users (Manager Only)
*These endpoints require an authenticated user with the manager role.*

- **GET** `/api/users` — Get all users
- **POST** `/api/users` — Create a new user
- **GET** `/api/users/:id` — Get a user by ID
- **PATCH** `/api/users/:id` — Update a user by ID
- **DELETE** `/api/users/:id` — Delete a user by ID

## Teams (Protected)
*These endpoints require an authenticated user. Some actions are role-restricted.*

- **GET** `/api/teams` — Get all teams
- **POST** `/api/teams` — Create a new team (Manager only)
- **GET** `/api/teams/:id` — Get a team by ID
- **PATCH** `/api/teams/:id` — Update a team by ID
- **DELETE** `/api/teams/:id` — Delete a team by ID
- **PATCH** `/api/teams/:id/add-member` — Add a member to a team

## Dashboard 

GET /api/dashboard/stats

## Projects

POST /api/projects
GET /api/projects
GET /api/projects/:id
PATCH /api/projects/:id
DELETE /api/projects/:id
