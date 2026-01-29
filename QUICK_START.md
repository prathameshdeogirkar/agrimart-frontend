# Quick Start Guide

## 🚀 Starting the Application

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd agrimart-backend
   ```

2. Make sure MySQL is running and the database exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS agrimart;
   ```

3. Start the Spring Boot backend:
   
   **Windows:**
   ```bash
   mvnw.cmd spring-boot:run
   ```
   
   **Linux/Mac:**
   ```bash
   ./mvnw spring-boot:run
   ```

4. Wait for the message: `Agrimart Backend Application is running...`

5. Verify backend is running by opening: `http://localhost:8080/api/products` in your browser

### Step 2: Start the Frontend

1. Open a **new terminal** (keep backend running)

2. Navigate to the frontend directory:
   ```bash
   cd agrimart-frontend
   ```

3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to: `http://localhost:5173`

## ✅ Verification

- Backend should be accessible at: `http://localhost:8080`
- Frontend should be accessible at: `http://localhost:5173`
- You should see products on the home page (or an empty state if no products exist)

## 🔧 Troubleshooting

### Network Error
If you see "Network Error" in the browser console:
- ✅ Make sure the backend is running on port 8080
- ✅ Check that MySQL database is running
- ✅ Verify database credentials in `application.properties`

### Port Already in Use
If port 8080 is busy:
- Change backend port in `agrimart-backend/src/main/resources/application.properties`
- Update frontend API URL in `agrimart-frontend/src/services/api.js`

### CORS Errors
- Backend is already configured for `http://localhost:5173`
- If using a different port, update `SecurityConfig.java` in the backend

## 📝 Default Configuration

- **Backend Port:** 8080
- **Frontend Port:** 5173 (Vite default)
- **Database:** MySQL on localhost:3306
- **Database Name:** agrimart



