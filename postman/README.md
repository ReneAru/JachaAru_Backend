# Jacha Aru API - Postman Collection

This directory contains Postman collection and environment files for testing the Jacha Aru API.

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

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Categories & Hierarchy  
- `GET /categorias` - Get all categories
- `GET /categorias/:id/temas` - Get themes by category
- `POST /categorias` - Create category
- `GET /temas` - Get all themes
- `GET /indicadores` - Get all indicators

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

## Environment Variables

The environment includes these variables:
- `baseUrl` - API base URL (default: http://localhost:3000)
- `access_token` - JWT token (auto-populated after login)
- `user_id` - Current user ID
- `investigador_id` - Current researcher ID

## Testing Flow

1. **Setup**: Register/Login to get authentication token
2. **Create Data**: Create categories, themes, indicators, sources, years
3. **Create Filters**: Combine data elements into filters  
4. **Create Consultations**: Submit consultation requests
5. **Manage Responses**: Handle consultation responses

## Notes

- All endpoints except authentication require Bearer token
- The collection automatically handles token management
- Response data can be used in subsequent requests via variables
- Test scripts automatically extract important IDs from responses