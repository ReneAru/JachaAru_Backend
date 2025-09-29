# Jacha Aru Backend API

Backend API for Fundación ARU's consultation management system. Jacha Aru (which means "Great Voice" in Aymara) is a research data management platform that enables researchers to request, manage, and deliver statistical consultations.

## About Fundación ARU

Fundación ARU is a Bolivian research institution dedicated to economic and social research. This API serves as the backend for managing research consultations, data sources, indicators, and researcher-user interactions.

## Project Purpose

This API provides a comprehensive system for:

- **User Management**: Registration and authentication for researchers and general users
- **Consultation Management**: Three types of consultations (quick, filtered, and complex)
- **Data Cataloging**: Management of data sources (fuentes), indicators, and disaggregations
- **Researcher Assignment**: Matching consultations with specialized researchers
- **Response Tracking**: Managing consultation responses and methodology documentation

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) 11.x - Progressive Node.js framework
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/) 0.3.26
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Validation**: class-validator and class-transformer
- **Security**: bcrypt for password hashing, CORS enabled
- **API Testing**: Postman collection included

## Features

### Core Functionality

- ✅ JWT-based authentication and authorization
- ✅ Full CRUD operations for all resources
- ✅ Soft delete support with audit trails
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Global validation and exception handling
- ✅ Cascading operations for related entities
- ✅ Status management (active, inactive, deleted)

### API Modules

1. **Authentication** (`/auth`) - User registration and login
2. **Users** (`/usuarios`) - User profile management
3. **Categories** (`/categorias`) - Research categories
4. **Themes** (`/temas`) - Research themes within categories
5. **Indicators** (`/indicadores`) - Statistical indicators
6. **Researchers** (`/investigadores`) - Researcher profiles and specializations
7. **Filters** (`/filtros`) - Data filtering configurations
8. **Consultations** (`/consultations`) - Three types:
   - **Quick** (`/consultations/rapidas`) - Simple data requests
   - **Filtered** (`/consultations/filtros`) - Filtered data requests
   - **Complex** (`/consultations/complejas`) - Custom analysis requests
9. **Data** (`/fuentes`, `/years`, `/tipos-desegregacion`, `/desegregaciones`) - Data sources and disaggregation types
10. **Responses** - Consultation response management

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JachaAru_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

4. **Set up the database**

   See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

   Quick setup:
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE fundacion_aru_db;"

   # Run the application (TypeORM will auto-create tables)
   npm run start:dev
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3200` (or your configured PORT)

### First Steps

1. **Register a user**: `POST http://localhost:3200/auth/register`
   ```json
   {
     "nombres": "John",
     "apellidos": "Doe",
     "mail": "john.doe@example.com",
     "pass": "password123"
   }
   ```

2. **Login**: `POST http://localhost:3200/auth/login`
   ```json
   {
     "mail": "john.doe@example.com",
     "pass": "password123"
   }
   ```

3. **Use the JWT token** in subsequent requests:
   ```
   Authorization: Bearer <your-token-here>
   ```

## Environment Variables

All environment variables are documented in `.env.example`. Copy it to `.env` and configure:

### Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | PostgreSQL server host | `localhost` | Yes |
| `DB_PORT` | PostgreSQL server port | `5432` | Yes |
| `DB_USERNAME` | Database user | `postgres` | Yes |
| `DB_PASSWORD` | Database password | `postgres` | Yes |
| `DB_NAME` | Database name | `fundacion_aru_db` | Yes |

### Application Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` | No |
| `PORT` | API server port | `3200` | No |

### JWT Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT signing (⚠️ **CHANGE IN PRODUCTION**) | `your_jwt_secret_here` | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` | No |

### Testing Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_HOST` | API host for testing scripts | `http://localhost:3200` | No |

**Security Note**: Always use strong, randomly generated secrets in production!

```bash
# Generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Documentation

### Postman Collection

Import the Postman collection for interactive API testing:

- **Collection**: `postman/Jacha-Aru-API.postman_collection.json`
- **Environment**: `postman/Jacha-Aru-Development.postman_environment.json`

### Swagger/OpenAPI

After starting the server, access the interactive API documentation at:

```
http://localhost:3200/api
```

### Authentication Flow

1. **Register** or **Login** to receive a JWT token
2. Include the token in the `Authorization` header for all protected endpoints:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. All endpoints except `/auth/register` and `/auth/login` require authentication

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT token

#### Users
- `GET /usuarios` - Get all users
- `GET /usuarios/me` - Get current user profile
- `PUT /usuarios/me` - Update current user profile
- `GET /usuarios/:id` - Get user by ID
- `PUT /usuarios/:id` - Update user by ID
- `DELETE /usuarios/:id` - Delete user

#### Consultations
- `GET /consultations/rapidas` - Get quick consultations
- `POST /consultations/rapidas` - Create quick consultation
- `GET /consultations/filtros` - Get filtered consultations
- `POST /consultations/filtros` - Create filtered consultation
- `GET /consultations/complejas` - Get complex consultations
- `POST /consultations/complejas` - Create complex consultation

See the Swagger documentation for the complete API reference.

## Project Structure

```
src/
├── database/              # Database configuration
│   ├── database.module.ts
│   └── database.providers.ts
├── dto/                   # Data Transfer Objects (validation)
│   ├── auth.dto.ts
│   ├── categoria.dto.ts
│   ├── consultations.dto.ts
│   └── ...
├── entities/              # TypeORM entities (database models)
│   ├── base.entity.ts     # Base entity with common fields
│   ├── categoria.entity.ts
│   ├── usuario.entity.ts
│   ├── consulta-*.entity.ts
│   └── ...
├── filters/               # Exception filters
│   └── all-exceptions.filter.ts
├── guards/                # Authentication guards
│   └── jwt-auth.guard.ts
├── interceptors/          # Request/response interceptors
│   └── transform.interceptor.ts
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   ├── usuarios/          # Users module
│   ├── categorias/        # Categories module
│   ├── temas/             # Themes module
│   ├── indicadores/       # Indicators module
│   ├── investigadores/    # Researchers module
│   ├── filtros/           # Filters module
│   ├── consultations/     # Consultations module
│   ├── data/              # Data sources module
│   └── responses/         # Responses module
├── app.module.ts          # Root application module
└── main.ts                # Application entry point
```

### Key Design Patterns

#### Base Entity Pattern
All entities extend `BaseEntity` which provides:
- `id`: Auto-generated primary key
- `status`: Enum status (active, inactive, deleted)
- `createdAt`: Automatic creation timestamp
- `updatedAt`: Automatic update timestamp
- `deletedAt`: Soft delete support

#### Module Structure
Each feature module follows a consistent structure:
- **Controller**: HTTP request handling
- **Service**: Business logic
- **Entity**: Database model
- **DTOs**: Request/response validation

## Available Scripts

### Development
```bash
# Start in development mode with auto-reload
npm run start:dev

# Start in debug mode
npm run start:debug

# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint
```

### Production
```bash
# Build the project
npm run build

# Start in production mode
npm run start:prod
```

### Testing
```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov

# Run endpoint tests
node test-endpoints.js

# Run endpoint tests with verbose output
node test-endpoints.js --verbose

# Test specific module
node test-endpoints.js --module=usuarios
```

## Testing

### Automated Endpoint Testing

A comprehensive test script is included to verify all API endpoints:

```bash
# Test all endpoints
node test-endpoints.js

# Verbose mode (see request/response details)
node test-endpoints.js --verbose

# Test specific module
node test-endpoints.js --module=categorias

# Use custom API host
node test-endpoints.js --host=http://localhost:3000
```

The test script will:
1. Create a test user and obtain authentication token
2. Test all CRUD operations for each module
3. Verify relationships between entities
4. Report success/failure for each endpoint

### Postman Testing

Import the Postman collection (`postman/Jacha-Aru-API.postman_collection.json`) for manual testing with pre-configured requests.

## Data Model Overview

### Consultation Types

The system supports three types of consultations:

1. **Consulta Rápida (Quick Consultation)**
   - Simple data requests using predefined filters
   - Fast turnaround time
   - Suitable for standard reports

2. **Consulta Filtro (Filtered Consultation)**
   - Data requests with custom filtering criteria
   - Assigned to specialized researchers
   - More complex than quick consultations

3. **Consulta Compleja (Complex Consultation)**
   - Custom analysis and research requests
   - Requires detailed methodology (ficha metodológica)
   - Assigned to expert researchers
   - Includes detailed responses and documentation

### Key Relationships

- **Categories** → **Themes** → **Indicators**: Hierarchical data organization
- **Users** create **Consultations**
- **Researchers** (Investigadores) are assigned to **Consultations**
- **Consultations** receive **Responses** (Respuestas)
- **Filters** combine multiple criteria: indicators, sources, years, disaggregations
- **Disaggregations** (data breakdowns) are typed by **Tipo Desegregación**

## Database

### Database Schema

The database consists of 22 main tables:

**Core Entities:**
- `usuario` - System users
- `investigador` - Researchers
- `categoria` - Research categories
- `tema` - Research themes
- `indicador` - Statistical indicators

**Consultation Entities:**
- `consulta_rapida` - Quick consultations
- `consulta_filtro` - Filtered consultations
- `consulta_compleja` - Complex consultations

**Response Entities:**
- `respuesta_consulta_rapida`
- `respuesta_consulta_filtro`
- `respuesta_consulta_compleja`

**Data Management:**
- `filtro` - Filter configurations
- `fuente` - Data sources
- `year` - Years available
- `tipo_desegregacion` - Disaggregation types
- `desegregacion` - Disaggregation values
- `ficha_metodologica` - Methodology documentation

**Junction Tables:**
- `indicador_tema` - Links indicators to themes
- `investigador_area` - Researcher specializations
- `tipo_desegregacion_indicador` - Links disaggregation types to indicators
- `fuente_year` - Available years per source
- `year_desegregacion` - Available disaggregations per year
- `ficha_fuente` - Links methodology to sources

### Migrations

TypeORM is configured to auto-synchronize the schema in development. For production deployments, use migrations:

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific database credentials
- [ ] Disable TypeORM `synchronize` (use migrations instead)
- [ ] Enable HTTPS
- [ ] Configure CORS for specific origins
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Use a process manager (PM2, Docker)

### Environment-Specific Configuration

Create separate `.env` files for each environment:
- `.env.development`
- `.env.staging`
- `.env.production`

Never commit `.env` files to version control!

## Security Considerations

- **Authentication**: JWT tokens expire after 7 days (configurable)
- **Passwords**: Hashed using bcrypt with salt rounds
- **Validation**: All inputs validated using class-validator
- **SQL Injection**: Protected by TypeORM parameterized queries
- **CORS**: Enabled for development, configure for production
- **Soft Deletes**: Data is never truly deleted, only marked as deleted

## Troubleshooting

### Common Issues

**Cannot connect to database**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -c "CREATE DATABASE fundacion_aru_db;"`

**Port already in use**
- Change `PORT` in `.env` file
- Or kill the process using the port: `lsof -ti:3200 | xargs kill`

**JWT token invalid**
- Token may have expired (default: 7 days)
- Login again to get a new token
- Verify `JWT_SECRET` matches between environments

**TypeORM synchronize errors**
- For production, disable synchronize and use migrations
- Drop and recreate database for development: `npm run typeorm schema:drop && npm run start:dev`

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript strict mode
3. Add DTOs for validation
4. Write descriptive commit messages
5. Test all endpoints before submitting
6. Update documentation for new features

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## License

[Your License Here]

## Contact

For questions or support regarding Fundación ARU's Jacha Aru platform, please contact:

[Your Contact Information]

---

**Built with ❤️ by the Fundación ARU development team**