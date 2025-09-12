# Pick-Fresh Backend

This is the backend service for the Pick-Fresh application, built with NestJS, GraphQL, and PostgreSQL.

## Project Overview
- NestJS backend application with GraphQL API
- Clean architecture pattern with modules for user, product, review, auth, and legal
- PostgreSQL database with TypeORM for ORM

## Technical Stack
- Node.js (v18+) with TypeScript
- NestJS framework v11
- GraphQL with Apollo Server
- TypeORM for database ORM
- PostgreSQL database
- Firebase Authentication for user management
- Deployed on Heroku

## Architecture
### Clean Architecture Pattern
- Domain-driven design separating business logic from framework implementation
- Each module follows adapter → domain → usecase pattern
- Dependency injection used throughout for loose coupling

### Module Structure
- User Module: User management and profiles
- Product Module: Product listings
- Review Module: User reviews for products
- Auth Module: Authentication using Firebase
- Legal Module: Legal documents and policies

### Folder Structure
```
src/
├── framework/
│   ├── database/          # Database configuration
│   ├── decorator/         # Custom decorators
│   ├── firebase/          # Firebase integration
│   ├── graphql/           # GraphQL setup
│   ├── guard/             # Authentication guards
│   ├── nest/              # Main application setup
│   ├── typeorm-migration/ # Database migrations
│   └── util/              # Utility functions
└── module/
    └── <feature>/         # Feature modules (user, product, etc.)
        ├── adapter/       # GraphQL resolvers, inputs, outputs
        │   ├── controller/
        │   ├── input/
        │   ├── output/
        │   ├── repository/
        │   └── resolver/
        ├── domain/        # Domain models
        │   └── model/
        ├── usecase/       # Business logic
        │   ├── interface/
        │   └── <feature>.usecase.ts
        └── <feature>.module.ts
```

## Development Environment Setup
1. **Prerequisites**
   - Node.js v18 or higher
   - PostgreSQL database
   - Firebase project

2. **Installation**
   ```bash
   npm install
   ```

3. **Environment Variables**
   The application uses environment variables for configuration. These need to be set up in the following places:
   
   - **Local Development**: Create a `.env` file in the project root
   - **Production**: Configure in Heroku dashboard under Settings > Config Vars
   
   To update these variables:
   - For local development: Edit the `.env` file
   - For production: Update via Heroku dashboard or CLI (`heroku config:set VARIABLE_NAME=value`)

4. **Running the Application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

## Database Management
- PostgreSQL database with TypeORM
- Migration commands:
  ```bash
  # Run migrations
  npm run typeorm:run
  
  # Generate new migration
  npm run typeorm:generate -- src/framework/typeorm-migration/migrations/MigrationName
  
  # Revert last migration
  npm run typeorm:revert
  ```

### Naming Conventions
- Use snake_case for table and column names
- Table names should be singular (e.g., user, product, review)
- Prefix foreign key constraints with FK_
- Prefix indices with IDX_

## Authentication
The application uses Firebase Authentication:
- Custom token-based authentication flow
- JWT validation and verification   
- User management through Firebase Admin SDK
- GraphQL resolvers protected by Guards

## API Endpoints
- GraphQL API available at `/graphql`
- Schema defined in `src/schema.gql`
- Playground available in development mode

## Testing
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment
The application is deployed on Heroku:
- Automatic deployment from the main branch
- Production database migrations using `npm run typeorm:run`
- Environment variables configured in Heroku dashboard

## Monitoring and Logging
- NestJS Logger used for application logging
- Errors handled through custom exception filters
- Monitor application health through Heroku dashboard

ngrok http --domain=pickfresh.ngrok.app 8080

ngrok config add-authtoken 2xjJiB01Zyd4RE7N7W84NBPUbxT_6hFRkEHoyybo8hhX5tDRn


npm run start:dev
   