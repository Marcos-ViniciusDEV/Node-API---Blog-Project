# Node API - Blog Project

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)

A comprehensive REST API for a blog platform built with Node.js, TypeScript, and Express. This project provides endpoints for user authentication, blog post management, and content retrieval.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Routes](#api-routes)
  - [Health Check](#health-check)
  - [Authentication Routes](#authentication-routes)
  - [Public Routes](#public-routes)
  - [Admin Routes](#admin-routes)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Repository](#repository)
- [License](#license)

## Features

- 🔐 User authentication with JWT tokens
- 🔒 Password encryption with bcrypt
- 📝 Blog post management (CRUD operations)
- 🖼️ Image upload support for blog covers
- 🔗 URL slug generation for posts
- 🔍 Post search and filtering
- 📋 Related posts recommendation
- ✅ Input validation with Zod
- 🛡️ CORS enabled
- 📱 RESTful API design

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Marcos-ViniciusDEV/Node-API---Blog-Project.git
   cd Node-API---Blog-Project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```

## Configuration

### Environment Variables

The following environment variables need to be configured in your `.env` file:

| Variable       | Description                | Example                                          |
| -------------- | -------------------------- | ------------------------------------------------ |
| `PORT`         | Server port                | `3000`                                           |
| `DATABASE_URL` | Database connection string | `postgresql://user:password@localhost:5432/blog` |
| `JWT_SECRET`   | Secret key for JWT tokens  | `your-secret-key`                                |

## Usage

### Development

To start the development server with hot reloading:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Production

Build the TypeScript files:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

## API Routes

### Health Check

| Method | Route       | Parameters | Returns            | Authentication |
| ------ | ----------- | ---------- | ------------------ | -------------- |
| `GET`  | `/api/ping` | None       | `{ ping: "pong" }` | No             |

---

### Authentication Routes

#### Sign Up

| Method | Route              | Parameters                                          | Returns                           | Authentication |
| ------ | ------------------ | --------------------------------------------------- | --------------------------------- | -------------- |
| `POST` | `/api/auth/signup` | `{ email: string, password: string, name: string }` | `{ user: object, token: string }` | No             |

#### Sign In

| Method | Route              | Parameters                            | Returns                           | Authentication |
| ------ | ------------------ | ------------------------------------- | --------------------------------- | -------------- |
| `POST` | `/api/auth/signin` | `{ email: string, password: string }` | `{ user: object, token: string }` | No             |

#### Validate Token

| Method | Route                | Parameters | Returns                            | Authentication |
| ------ | -------------------- | ---------- | ---------------------------------- | -------------- |
| `GET`  | `/api/auth/validate` | None       | `{ valid: boolean, user: object }` | Yes (JWT)      |

---

### Public Routes (Blog Posts)

#### Get All Posts

| Method | Route        | Parameters               | Returns              | Authentication |
| ------ | ------------ | ------------------------ | -------------------- | -------------- |
| `GET`  | `/api/posts` | Query filters (optional) | `[{ post objects }]` | No             |

#### Get Post by Slug

| Method | Route              | Parameters             | Returns           | Authentication |
| ------ | ------------------ | ---------------------- | ----------------- | -------------- |
| `GET`  | `/api/posts/:slug` | `slug` (URL parameter) | `{ post object }` | No             |

#### Get Related Posts

| Method | Route                      | Parameters             | Returns                      | Authentication |
| ------ | -------------------------- | ---------------------- | ---------------------------- | -------------- |
| `GET`  | `/api/posts/:slug/related` | `slug` (URL parameter) | `[{ related post objects }]` | No             |

---

### Admin Routes (Protected)

**All admin routes require JWT authentication (Bearer token in Authorization header)**

#### Create Post

| Method | Route              | Parameters                                   | Returns                   | Authentication |
| ------ | ------------------ | -------------------------------------------- | ------------------------- | -------------- |
| `POST` | `/api/admin/posts` | `FormData: { title, content, cover (file) }` | `{ created post object }` | Yes (JWT)      |

#### Get All Admin Posts

| Method | Route              | Parameters | Returns              | Authentication |
| ------ | ------------------ | ---------- | -------------------- | -------------- |
| `GET`  | `/api/admin/posts` | None       | `[{ post objects }]` | Yes (JWT)      |

#### Get Admin Post by Slug

| Method | Route                    | Parameters             | Returns           | Authentication |
| ------ | ------------------------ | ---------------------- | ----------------- | -------------- |
| `GET`  | `/api/admin/posts/:slug` | `slug` (URL parameter) | `{ post object }` | Yes (JWT)      |

#### Update Post

| Method | Route                    | Parameters                                   | Returns                   | Authentication |
| ------ | ------------------------ | -------------------------------------------- | ------------------------- | -------------- |
| `PUT`  | `/api/admin/posts/:slug` | `FormData: { title, content, cover (file) }` | `{ updated post object }` | Yes (JWT)      |

#### Delete Post

| Method   | Route                    | Parameters             | Returns                | Authentication |
| -------- | ------------------------ | ---------------------- | ---------------------- | -------------- |
| `DELETE` | `/api/admin/posts/:slug` | `slug` (URL parameter) | `{ success: boolean }` | Yes (JWT)      |

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Programming language
- **Prisma** - ORM for database management
- **PostgreSQL** - Database (typical)
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcrypt** - Password hashing and security
- **Multer** - File upload middleware
- **Cors** - Cross-Origin Resource Sharing
- **Zod** - Schema validation
- **Slug** - URL-friendly string generation
- **UUID** - Unique identifier generation
- **body-parser** - Request body parsing

## Project Structure

```
Node-API---Blog-Project/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── mainController.ts
│   │   ├── authConstroller.ts
│   │   └── adminController.ts
│   ├── routes/             # API route definitions
│   │   ├── main.ts
│   │   ├── auth.ts
│   │   └── admin.ts
│   ├── services/           # Business logic services
│   │   ├── userServices.ts
│   │   ├── postServices.ts
│   │   ├── jwtServices.ts
│   │   └── userType.ts
│   ├── libs/               # Utility libraries
│   │   ├── prisma.ts
│   │   ├── multer.ts
│   │   └── jtw.ts
│   ├── middlewares/        # Express middlewares
│   │   └── prevate-routes.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── extended-request.ts
│   │   └── token-payload.ts
│   ├── utils/              # Utility functions
│   │   └── cover-to-url.ts
│   └── server.ts           # Main server file
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── public/                 # Static files
│   └── images/
│       └── covers/
├── tmp/                    # Temporary files
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation

```

## Authentication

This API uses JWT (JSON Web Token) for authentication. To access protected routes:

1. Sign up or sign in using the authentication endpoints
2. Receive a JWT token in the response
3. Include the token in the `Authorization` header as a Bearer token for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Repository

- **Repository URL**: [https://github.com/Marcos-ViniciusDEV/Node-API---Blog-Project](https://github.com/Marcos-ViniciusDEV/Node-API---Blog-Project)
- **Issues**: [Report Issues](https://github.com/Marcos-ViniciusDEV/Node-API---Blog-Project/issues)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Author**: Marcos Vinicius  
**Last Updated**: November 2025
