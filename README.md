# NestJS Daily Milk Log Application

This is a simple NestJS application designed to manage daily milk collections for customers, track monthly payments, and implement role-based access control.

## Features

*   **User Authentication:** Signup and Login with JWT.
*   **Role-Based Access Control (RBAC):**
    *   **Owner:** Full access to all APIs and routes.
    *   **Worker:** Can enroll new customers, mark milk collected, and mark payments.
    *   **Customer:** Can view their own customer data.
*   **Customer Management:**
    *   Create, view, update, and delete customer records.
    *   Mark daily milk collection.
    *   Mark monthly payments.

## Setup and Running the Application

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Application in Development Mode:**
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

### Customer Management

#### 1. Create a Customer

*   **Method:** `POST`
*   **URL:** `/customer`
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`
*   **Body (JSON):**
    ```json
    {
        "name": "Customer Name",
        "monthlyAmount": 0.00
    }
    ```
*   **Expected Response:** JSON object of the created customer.

#### 2. Get All Customers

*   **Method:** `GET`
*   **URL:** `/customer`
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Authorization: Bearer <token>`
*   **Expected Response:** An array of customer JSON objects.

#### 3. Get a Single Customer by ID

*   **Method:** `GET`
*   **URL:** `/customer/:id` (e.g., `/customer/1`)
*   **Roles Allowed:** `owner`, `worker`, `customer` (customer can only access their own ID)
*   **Headers:** `Authorization: Bearer <token>`
*   **Expected Response:** JSON object of the specified customer.

#### 4. Update a Customer

*   **Method:** `PATCH`
*   **URL:** `/customer/:id` (e.g., `/customer/1`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`
*   **Body (JSON):**
    ```json
    {
        "name": "Updated Name",
        "monthlyAmount": 35.00
    }
    ```
*   **Expected Response:** JSON object of the updated customer.

#### 5. Mark Milk Collected for Today

*   **Method:** `PATCH`
*   **URL:** `/customer/:id/collect` (e.g., `/customer/1/collect`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Authorization: Bearer <token>`
*   **Expected Response:** JSON object of the customer with `collectedToday: true`.

#### 6. Mark Monthly Amount Paid

*   **Method:** `PATCH`
*   **URL:** `/customer/:id/pay` (e.g., `/customer/1/pay`)
*   **Roles Allowed:** `owner`, `worker`
*   **Headers:** `Authorization: Bearer <token>`
*   **Expected Response:** JSON object of the customer with `paid: true`.

#### 7. Delete a Customer

*   **Method:** `DELETE`
*   **URL:** `/customer/:id` (e.g., `/customer/1`)
*   **Roles Allowed:** `owner`
*   **Headers:** `Authorization: Bearer <token>`
*   **Expected Response:** Empty success response (e.g., 200 OK).

## Role-Based Access Control (RBAC) Summary

*   **Owner:** Can perform all actions (create, read, update, delete customers; mark collected/paid).
*   **Worker:** Can create, read, update (including mark collected/paid) customers. Cannot delete customers.
*   **Customer:** Can only read their own customer data (if their user ID matches the customer ID). Cannot create, update, or delete customers.