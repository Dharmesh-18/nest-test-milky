# NestJS Daily Milk Log Application

This is a simple NestJS application designed to manage daily milk collections for customers, track monthly payments, and implement role-based access control.

## Features

*   **User Authentication:** Signup and Login with JWT.
## Role-Based Access Control (RBAC) Summary

*   **Owner:** Can perform all actions on users, including creating, reading, updating, and deleting users of any role. Can also mark milk collected/paid for users with the `customer` role.
*   **Worker:** Can create, read, and update users of any role (including marking milk collected/paid for `customer` users). Cannot delete users.
*   **Customer:** Can only read their own user data (if their user ID matches the requested user ID). Cannot create, update, or delete other users.
*   **Customer Management:**
    *   Create, view, update, and delete customer records.
    *   Mark daily milk collection.
    *   Mark monthly payments.

## Setup and Running the Application

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Configure MongoDB:**
    Create a `.env` file in the project root with your MongoDB connection URI. For local development, you can use:
    ```
    MONGODB_URI=mongodb://localhost:27017/nest-test-milky
    ```
3.  **Run the Application in Development Mode:**
    ```bash
    npm run start:dev
    ```
    The application will typically run on `http://localhost:3000`.

## API Endpoints

All endpoints are prefixed with `http://localhost:3000`.

### Authentication

#### 1. Signup (Create a User)

*   **Method:** `POST`
*   **URL:** `/auth/signup`
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body (JSON):**
    ```json
    {
        "username": "your_username",
        "password": "your_password",
        "role": "owner" | "worker" | "customer"
    }
    ```
*   **Expected Response:** JSON object of the created user (without password hash).

#### 2. Login (Get JWT Token)

*   **Method:** `POST`
*   **URL:** `/auth/login`
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body (JSON):**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
*   **Expected Response:** JSON object containing an `access_token`. This token must be used in the `Authorization` header for subsequent authenticated requests.

    ```json
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### Authenticated Requests

For all endpoints below, you must include an `Authorization` header:
*   **Header Key:** `Authorization`
*   **Header Value:** `Bearer YOUR_JWT_TOKEN_HERE`

### User Management

All user-related operations are now handled under the `/user` endpoint.

#### 1. Get Users by Role

*   **Method:** `GET`
*   **URL:** `/user/by-role/:role` (e.g., `/user/by-role/customer`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Authorization: Bearer <token>`
*   **Path Parameters:**
    *   `role`: The role of users to retrieve (`owner`, `worker`, `customer`).
*   **Expected Response:** An array of user JSON objects matching the specified role.

#### 2. Create a User with a Specific Role

*   **Method:** `POST`
*   **URL:** `/user/create-with-role`
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`
*   **Body (JSON):**
    ```json
    {
        "username": "new_user",
        "password": "secure_password",
        "role": "owner" | "worker" | "customer",
        "name": "User Name",
        "monthlyAmount": 0.00
    }
    ```
    *Note: `name`, `monthlyAmount`, `collectedToday`, and `paid` are optional and primarily relevant for `customer` role.*
*   **Expected Response:** JSON object of the created user.

#### 3. Get a Single User by ID and Role

*   **Method:** `GET`
*   **URL:** `/user/:id/role/:role` (e.g., `/user/60d5ecf0f1c2a3b4e5d6c7b8/role/customer`)
*   **Roles Allowed:** `owner`, `worker`, `customer` (customer can only access their own ID)
*   **Headers:** `Authorization: Bearer <token>`
*   **Path Parameters:**
    *   `id`: The MongoDB ObjectId of the user.
    *   `role`: The role of the user.
*   **Expected Response:** JSON object of the specified user.

#### 4. Update a User by ID and Role

*   **Method:** `PATCH`
*   **URL:** `/user/:id/role/:role` (e.g., `/user/60d5ecf0f1c2a3b4e5d6c7b8/role/customer`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`
*   **Path Parameters:**
    *   `id`: The MongoDB ObjectId of the user.
    *   `role`: The role of the user.
*   **Body (JSON):**
    ```json
    {
        "username": "updated_username",
        "name": "Updated Name",
        "monthlyAmount": 35.00
    }
    ```
*   **Expected Response:** JSON object of the updated user.

#### 5. Mark Milk Collected for a Customer User

*   **Method:** `PATCH`
*   **URL:** `/user/:id/collect` (e.g., `/user/60d5ecf0f1c2a3b4e5d6c7b8/collect`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Authorization: Bearer <token>`
*   **Path Parameters:**
    *   `id`: The MongoDB ObjectId of the customer user.
*   **Expected Response:** JSON object of the customer user with `collectedToday: true`.

#### 6. Mark Monthly Amount Paid for a Customer User

*   **Method:** `PATCH`
*   **URL:** `/user/:id/pay` (e.g., `/user/60d5ecf0f1c2a3b4e5d6c7b8/pay`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Authorization: Bearer <token>`
*   **Path Parameters:**
    *   `id`: The MongoDB ObjectId of the customer user.
*   **Expected Response:** JSON object of the customer user with `paid: true`.

#### 7. Delete a User by ID and Role

*   **Method:** `DELETE`
*   **URL:** `/user/:id/role/:role` (e.g., `/user/60d5ecf0f1c2a3b4e5d6c7b8/role/customer`)
*   **Roles Allowed:** `owner`
*   **Headers:** `Authorization: Bearer <token>`
*   **Path Parameters:**
    *   `id`: The MongoDB ObjectId of the user.
    *   `role`: The role of the user.
*   **Expected Response:** Empty success response (e.g., 200 OK).