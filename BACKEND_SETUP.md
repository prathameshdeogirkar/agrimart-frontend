# Backend Setup Instructions

## Issue: Network Error

If you're seeing a "Network Error" in the browser console, it means the frontend cannot connect to the backend server.

## Solution: Start the Backend Server

### Prerequisites
1. **Java 17** installed
2. **Maven** installed
3. **MySQL** database running on `localhost:3306`
4. Database `agrimart` created

### Steps to Start Backend

1. **Navigate to backend directory:**
   ```bash
   cd agrimart-backend
   ```

2. **Start MySQL database** (if not already running)
   - Make sure MySQL is running on port 3306
   - Create database: `CREATE DATABASE agrimart;`

3. **Start the Spring Boot application:**
   
   **Option 1: Using Maven**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   **Option 2: Using Maven Wrapper (Windows)**
   ```bash
   mvnw.cmd spring-boot:run
   ```
   
   **Option 3: Build and Run JAR**
   ```bash
   ./mvnw clean package
   java -jar target/agrimart-backend-0.0.1-SNAPSHOT.jar
   ```

4. **Verify backend is running:**
   - You should see: "Agrimart Backend Application is running..."
   - Open browser and go to: `http://localhost:8080/api/products`
   - You should see a JSON response (even if empty array `[]`)

### Backend Configuration

The backend is configured to run on:
- **Port:** 8080
- **Database:** MySQL on localhost:3306
- **Database Name:** agrimart
- **Username:** root
- **Password:** 220801

### CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:5173` (Vite default port)

### Troubleshooting

1. **Port 8080 already in use:**
   - Change port in `application.properties`: `server.port=8081`
   - Update frontend `src/services/api.js`: Change `API_BASE_URL` to `http://localhost:8081`

2. **Database connection error:**
   - Check MySQL is running
   - Verify database credentials in `application.properties`
   - Ensure database `agrimart` exists

3. **CORS errors:**
   - Backend CORS is configured for `http://localhost:5173`
   - If using different port, update `SecurityConfig.java`

### Testing Backend Connection

Test if backend is accessible:
```bash
curl http://localhost:8080/api/products
```

Or open in browser: `http://localhost:8080/api/products`

You should see a JSON response with products (or empty array `[]`).



