# Jacha Aru API - Postman Collection

This directory contains Postman collection and environment files for testing the Jacha Aru API with comprehensive error handling and testing scenarios.

## Files

- `Jacha-Aru-API.postman_collection.json` - Complete API collection with all endpoints
- `Jacha-Aru-Development.postman_environment.json` - Development environment variables

## How to Import

1. Open Postman
2. Click "Import" button
3. Select both JSON files from this directory
4. The collection and environment will be imported

## Usage

1. **Set Environment**: Select "Jacha Aru Development" environment
2. **Authentication**: 
   - First, run "Register User" or "Login User" from the Authentication folder
   - The access token will be automatically saved to the environment
3. **Test Endpoints**: All other requests will use the saved token automatically

## API Structure

### Authentication (Enhanced with Error Testing)
- `POST /auth/register` - Register new user (with duplicate email handling)
- `POST /auth/login` - Login user (with invalid credential testing)
- `POST /auth/register` - Test duplicate registration (soft-delete restoration)
- Tests for invalid login credentials and meaningful error messages

### User Management
- `GET /usuarios/me` - Get my profile
- `PUT /usuarios/me` - Update my profile
- `GET /usuarios` - Get all users (admin)
- `GET/PUT/DELETE /usuarios/:id` - Manage specific users

### Categories & Hierarchy (Enhanced with Filtering)
- `GET /categorias` - Get all categories with themes
- `GET /categorias/:id/temas` - Get themes by category
- `GET /temas` - Get all themes  
- `GET /temas?categoriaId=X` - **Filter themes by category**
- `GET /indicadores` - Get all indicators
- `GET /indicadores?temaId=X` - **Filter indicators by theme**
- Full CRUD operations with foreign key constraint handling

### Consultations
- `GET/POST /consultations/rapidas` - Quick consultations
- `GET/POST /consultations/filtros` - Filter consultations  
- `GET/POST /consultations/complejas` - Complex consultations

### Data Management
- `GET/POST /years` - Year management
- `GET/POST /fuentes` - Data sources
- `GET /desegregaciones` - Disaggregation data
- `GET /tipos-desegregacion` - Disaggregation types

### Researchers
- `GET/POST /investigadores` - Researcher management

### Filters
- `GET/POST /filtros` - Filter combinations

### Responses
- `GET/POST /responses/*` - Consultation responses

## Key Features Added

### 🛡️ Enhanced Error Handling
- **Foreign Key Constraint Testing**: Deletion tests show meaningful error messages
- **Authentication Error Testing**: Invalid credentials, duplicate emails, etc.
- **Comprehensive Logging**: All requests include test scripts for debugging

### 🔍 Advanced Filtering
- **Hierarchical Filtering**: Filter themes by category, indicators by theme
- **Query Parameter Support**: Use `?categoriaId=X` and `?temaId=X` parameters
- **Relational Data Loading**: Responses include related entity information

### 🧪 Automated Testing
- **Test Scripts**: Built-in test scripts verify response status and content
- **Error Message Validation**: Tests ensure error messages are helpful
- **Variable Extraction**: Automatically saves IDs and tokens for subsequent requests

## Environment Variables

The environment includes these variables:
- `baseUrl` - API base URL (default: http://localhost:3000)
- `access_token` - JWT token (auto-populated after login)
- `user_id` - Current user ID (auto-populated after login)
- `investigador_id` - Current researcher ID

## Testing Scenarios

### 🔐 Authentication Flow
1. **Register New User** → Success with token
2. **Login Existing User** → Success with token  
3. **Test Invalid Login** → 401 with meaningful error
4. **Test Duplicate Registration** → 401 or restoration of soft-deleted user

### 🏗️ Hierarchy Management
1. **Create Category** → Returns category with ID
2. **Create Theme** → Link to category
3. **Create Indicator** → Link to theme via junction table
4. **Filter Data** → Use query parameters to filter by relationships

### 🗑️ Deletion Testing
1. **Try Delete Category with Themes** → 400 error with helpful message
2. **Try Delete Theme with Filters** → 400 error explaining dependency
3. **Delete in Correct Order** → Success (filters → indicators → themes → categories)

### 📊 Advanced Features
- **Soft Delete Restoration**: Re-registering deleted users restores them
- **Comprehensive Logging**: Server logs show detailed authentication flow
- **Cascade Operations**: Related data is handled properly during updates/deletes

## Usage Tips

1. **Start with Authentication**: Always login first to set up tokens
2. **Check Console Logs**: Test scripts log useful debugging information
3. **Follow Hierarchy**: Create categories before themes, themes before indicators
4. **Test Error Cases**: Use the error testing endpoints to understand system behavior
5. **Use Filters**: Take advantage of query parameters for hierarchical filtering

## Error Messages You'll See

```json
// Foreign key constraint violation
{
  "statusCode": 400,
  "message": "Cannot delete category: it has 3 related themes. Delete themes first."
}

// Authentication errors
{
  "statusCode": 401,
  "message": "Invalid credentials"
}

// Duplicate registration
{
  "statusCode": 401,
  "message": "User with this email already exists"
}
```

The collection is designed to handle real-world scenarios with proper error handling and user guidance!