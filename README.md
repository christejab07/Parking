# Parking Management System Backend

## Overview
This is a Node.js/Express.js backend for a parking management system, built with Sequelize ORM and MySQL. It provides APIs for user authentication, vehicle management, parking bookings, and ticket management. The system includes JWT-based authentication, role-based authorization (admin/user), and Swagger documentation for API exploration.

## Features
- **User Management**: Register and login users with JWT authentication.
- **Vehicle Management**: Create, read, update, and delete vehicles for authenticated users.
- **Booking Management**: Create and approve (admin-only) parking bookings.
- **Ticket Management**: View and pay tickets for approved bookings.
- **Input Validation**: Regex-based validation for all input fields.
- **Swagger Documentation**: Interactive API documentation at `/api-docs`.

## Prerequisites
- **Node.js**: v20.18.2 or higher
- **MySQL**: 8.0 or higher
- **npm**: For dependency management

## Setup Instructions
1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd parking-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install express sequelize mysql2 dotenv bcryptjs jsonwebtoken cors swagger-ui-express
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the project root:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=parking_management
     JWT_SECRET=your_jwt_secret_key
     ```
   - Replace `your_username`, `your_password`, and `your_jwt_secret_key` with your MySQL credentials and a secure JWT secret.

4. **Set Up MySQL Database**:
   - Create a database named `parking_management`:
     ```sql
     CREATE DATABASE parking_management;
     ```
   - The schema will sync automatically when the server starts.

5. **Run the Server**:
   ```bash
   npm install -g nodemon
   nodemon server.js
   ```
   - The server will run on `http://localhost:3000`.
   - Swagger UI is available at `http://localhost:3000/api-docs`.

6. **Database Schema Update** (if needed):
   - The first run uses `sequelize.sync({ force: true })` to create tables. After the initial setup, change to `sequelize.sync({ force: false })` in `server.js` to avoid data loss.

## API Endpoints
All endpoints are prefixed with `/api`.

### Authentication
- **POST /auth/register**: Register a new user.
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **POST /auth/login**: Login and get JWT token.
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```

### Vehicles (Authenticated)
- **POST /vehicles**: Create a vehicle.
  ```json
  {
    "plateNumber": "ABC123",
    "brand": "Toyota",
    "model": "Camry",
    "color": "Blue"
  }
  ```
- **GET /vehicles**: Get all vehicles for the authenticated user.
- **PUT /vehicles/:id**: Update a vehicle.
  ```json
  {
    "plateNumber": "XYZ789",
    "brand": "Honda",
    "model": "Civic",
    "color": "Red"
  }
  ```
- **DELETE /vehicles/:id**: Delete a vehicle.

### Bookings (Authenticated)
- **POST /bookings**: Create a booking.
  ```json
  {
    "vehicleId": 1,
    "startTime": "2025-05-20T10:00:00Z",
    "endTime": "2025-05-20T12:00:00Z"
  }
  ```
- **PUT /bookings/:id/approve**: Approve a booking (admin only).

### Tickets (Authenticated)
- **GET /tickets**: Get all tickets for the authenticated user.
- **PUT /tickets/:id/pay**: Pay a ticket.

## Input Validation
- **User**:
  - Username: Alphanumeric with underscores, 3-20 characters.
  - Email: Valid email format.
  - Password: 8-30 characters, with uppercase, lowercase, number, and special character.
- **Vehicle**:
  - Plate Number: Alphanumeric with hyphens/spaces, 3-10 characters.
  - Brand/Model/Color: Letters (and spaces for brand/color), 2-50 characters.
- **Booking**:
  - Vehicle ID: Positive integer.
  - Start/End Time: Valid ISO 8601 date-time, with endTime > startTime.
- **Ticket**:
  - ID: Positive integer.

## Testing
1. **Swagger UI**:
   - Access `http://localhost:3000/api-docs` to test endpoints interactively.
   - Authorize with `Bearer <token>` after logging in.
2. **Postman/cURL**:
   - Example (create vehicle):
     ```bash
     curl -X POST http://localhost:3000/api/vehicles \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"plateNumber":"ABC123","brand":"Toyota","model":"Camry","color":"Blue"}'
     ```
3. **Admin Testing**:
   - Update a user’s role to `admin` in the database:
     ```sql
     UPDATE Users SET role = 'admin' WHERE email = 'john@example.com';
     ```

## Project Structure
```
parking-backend/
├── controllers/
│   ├── authController.js
│   ├── vehicleController.js
│   ├── bookingController.js
│   ├── ticketController.js
├── middleware/
│   ├── auth.js
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   ├── Booking.js
│   ├── Ticket.js
│   ├── index.js
├── routes/
│   ├── auth.js
│   ├── vehicles.js
│   ├── bookings.js
│   ├── tickets.js
├── swagger.js
├── server.js
├── .env
├── README.md
├── package.json
```

## Notes
- **Database**: Use `sequelize.sync({ force: true })` only for initial setup to avoid data loss.
- **Security**: Ensure `JWT_SECRET` is secure and not exposed.
- **Error Handling**: Controllers include validation and error responses for invalid inputs.
- **Swagger**: Use `/api-docs` for API documentation and testing.

## Troubleshooting
- **Database Errors**: Verify MySQL credentials in `.env` and ensure the `parking_management` database exists.
- **JWT Issues**: Ensure the `Authorization` header is set as `Bearer <token>`.
- **Contact**: For issues, check server logs or consult the Swagger UI for endpoint details.