# Database Setup Guide

## PostgreSQL Database Setup for Fundación Aru Backend

### Prerequisites
- PostgreSQL 12+ installed
- Node.js 18+ 
- npm or yarn

### Database Setup Steps

1. **Install Dependencies**
   ```bash
   npm i
   ```

2. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE fundacion_aru_db;
   CREATE USER aru_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE fundacion_aru_db TO aru_user;
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=aru_user
   DB_PASSWORD=your_secure_password
   DB_NAME=fundacion_aru_db
   NODE_ENV=development
   ```

4. **Run the Application**
   ```bash
   npm run start:dev
   ```
   
   TypeORM will automatically create all tables based on the entities.
