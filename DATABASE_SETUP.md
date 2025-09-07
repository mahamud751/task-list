# PostgreSQL Database Setup for Next.js Application

This document explains how to set up and use the PostgreSQL database with the Next.js application.

## Prerequisites

1. PostgreSQL database server running locally or remotely
2. Node.js and npm installed
3. This Next.js project cloned

## Database Configuration

The database connection is configured through environment variables in the `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jira?schema=public"
```

Make sure to update this URL to match your PostgreSQL setup:
- `postgres` (username) - Replace with your PostgreSQL username
- `postgres` (password) - Replace with your PostgreSQL password
- `localhost:5432` - Replace with your PostgreSQL host and port
- `jira` - Replace with your database name

## Prisma Schema

The database schema is defined in `prisma/schema.prisma` with the following models:
- `User` - Represents users in the system
- `Column` - Represents columns in the Kanban board
- `Task` - Represents tasks/cards in the system

## Setting Up the Database

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```
   This command creates the necessary tables in your database based on the Prisma schema.

3. **Seed the database with sample data**:
   ```bash
   npm run seed
   ```
   This command populates the database with sample columns, users, and tasks.

## Database Operations

### API Endpoints

The application provides the following API endpoints for database operations:

- `GET /api/columns` - Fetch all columns with their tasks
- `POST /api/columns` - Create a new column
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task

### Direct Database Access

For direct database access, the application uses Prisma Client through:
- `src/lib/prisma.ts` - Prisma client initialization
- `src/services/taskService.ts` - Database service functions

## Development

### Adding New Models

To add new models to the database:
1. Update `prisma/schema.prisma` with your new model
2. Run `npx prisma migrate dev --name your_migration_name` to create and apply the migration
3. Update the service files in `src/services/` to include operations for the new model

### Updating Existing Models

To modify existing models:
1. Update `prisma/schema.prisma` with your changes
2. Run `npx prisma migrate dev --name your_migration_name` to create and apply the migration

## Troubleshooting

### Common Issues

1. **Connection refused**: Make sure your PostgreSQL server is running and the connection URL is correct
2. **Authentication failed**: Check your username and password in the DATABASE_URL
3. **Database does not exist**: Create the database specified in your DATABASE_URL

### Useful Prisma Commands

- `npx prisma studio` - Open Prisma Studio to view and edit data in the browser
- `npx prisma migrate reset` - Reset the database and reapply all migrations
- `npx prisma generate` - Regenerate Prisma Client after schema changes

## Testing Database Operations

You can test the API endpoints using curl or any HTTP client:

```bash
# Fetch all columns
curl http://localhost:3000/api/columns

# Fetch all tasks
curl http://localhost:3000/api/tasks

# Create a new column
curl -X POST http://localhost:3000/api/columns \
  -H "Content-Type: application/json" \
  -d '{"title": "New Column", "order": 4}'

# Create a new task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description", "priority": "medium", "columnId": "column-id-here"}'
```