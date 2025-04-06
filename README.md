# Student Management CRUD System

This project is a functional student management application built using React for the frontend, Node.js with Express for the backend, and MySQL for data storage. It supports registration, login, role-based access, student management (create, read, update, delete), and password recovery.

---

## How to Set It Up

## 1. Backend Setup

#### Prerequisites
- Node.js installed
- MySQL server running

#### Steps
```bash
cd backend
npm install
```

Next, create a MySQL database called `CRUD`, and run the following SQL:
```sql
CREATE TABLE student (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255),
  Email VARCHAR(255) UNIQUE,
  Password VARCHAR(255),
  Role VARCHAR(50)
);

CREATE TABLE password_resets (
  email VARCHAR(255),
  token VARCHAR(255),
  expires_at DATETIME
);
```

Then start the server:
```bash
node server.js
```
By default, the backend will be available at `http://localhost:8081`

### 3. Frontend Setup

#### Prerequisites
- Node.js
- npm

#### Steps
```bash
cd frontend
npm install
npm start
```
The frontend should launch at `http://localhost:3000`

---

## API Endpoints Summary

### Authentication
- `POST /login` - Logs a user in
- `POST /register` - Registers a new user

### Students (Requires login)
- `GET /secure-students` - Returns student data (full access for admins, limited for regular users)
- `GET /getstudent/:id` - Get details for one student
- `PUT /update/:id` - Update student information
- `DELETE /student/:id` - Remove a student

### Password Reset
- `POST /request-reset` - Request a password reset link
- `POST /reset-password/:token` - Submit new password with a valid reset token

---

## Roles & Permissions

### Admins
Admins can:
- View all student data (including passwords)
- Add, update, and delete student records
- Access protected admin routes

**Admin Login Credentials:**
- Email: `isak@example.com`
- Password: `@0000`

### Regular Users (Viewers)
Viewers can:
- Register and log in
- View limited student info
- Cannot make changes to student records

---

## Folder Overview
```
├── backend/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Student.js
│   │   ├── CreateStudent.js
│   │   ├── UpdateStudent.js
│   │   ├── ProtectedRoute.js
│   │   ├── ResetPassword.js
│   │   └── RequestReset.js
```

---

## Final Points
- Make sure your MySQL server is up and running when testing.
- The app uses JWT tokens stored in `localStorage` for auth.
- CORS is already set up to allow frontend-backend communication.


