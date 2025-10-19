# 75 Hard Tracker - Quick Start Guide

This guide will help you set up and run the 75 Hard Tracker backend API.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- PostgreSQL 14 or higher installed and running
- Git (for cloning the repository)

## Setup Steps

### 1. Clone and Navigate to Backend

```bash
git clone https://github.com/zordhalo/75-day-tracker.git
cd 75-day-tracker/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all necessary packages including:
- Express.js (web framework)
- Prisma (database ORM)
- TypeScript (for type safety)
- Jest (for testing)

### 3. Set Up Database

#### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create a database named '75hard'
createdb 75hard

# Or using psql
psql -U postgres
CREATE DATABASE 75hard;
\q
```

#### Option B: Using Docker

If you prefer Docker:

```bash
docker run --name 75hard-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=75hard \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and update the DATABASE_URL:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/75hard"

# For Docker PostgreSQL
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/75hard"

# Other settings
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRATION="7d"
PORT=3000
NODE_ENV="development"
```

**Important:** Replace `username`, `password` with your actual PostgreSQL credentials.

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 6. Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create all necessary tables (users, challenges, daily_logs)
- Set up relationships and constraints
- Apply the database schema

When prompted for a migration name, you can enter: `init`

### 7. Start the Development Server

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
📊 Health check: http://localhost:3000/health
📝 API base: http://localhost:3000/api
```

### 8. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "75 Hard Tracker API is running"
}
```

## Testing the API

### Create a Challenge

```bash
curl -X POST http://localhost:3000/api/challenges \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123"}'
```

Response:
```json
{
  "id": "challenge-uuid",
  "userId": "user-123",
  "startDate": "2024-01-01T00:00:00.000Z",
  "currentDay": 0,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Save the `id` value for the next steps.

### Submit Daily Tasks

```bash
curl -X POST http://localhost:3000/api/challenges/[CHALLENGE-ID]/daily-log \
  -H "Content-Type: application/json" \
  -d '{
    "diet": true,
    "workout1": true,
    "workout2": true,
    "water": true,
    "reading": true,
    "photo": true,
    "photoUrl": "https://example.com/photo.jpg",
    "notes": "Great first day!"
  }'
```

### Get Progress

```bash
curl http://localhost:3000/api/challenges/[CHALLENGE-ID]/progress
```

## Running Tests

```bash
npm test
```

This will run all tests and show coverage report.

## Common Issues

### Issue: "Environment variable not found: DATABASE_URL"

**Solution:** Make sure you created the `.env` file and it contains a valid `DATABASE_URL`.

### Issue: "Can't reach database server"

**Solution:** 
- Verify PostgreSQL is running: `pg_isready` or `docker ps`
- Check your connection string in `.env`
- Ensure the database exists: `psql -l | grep 75hard`

### Issue: "Prisma schema loading error"

**Solution:** Run `npm run prisma:generate` to regenerate the Prisma Client.

### Issue: "Error: P1001: Can't reach database server"

**Solution:** 
- Check if PostgreSQL is running
- Verify port 5432 is not blocked by firewall
- Test connection: `psql -U username -d 75hard`

## Development Tools

### Prisma Studio

View and edit your database with a GUI:

```bash
npm run prisma:studio
```

This opens a browser interface at `http://localhost:5555`

### Watch Mode for Tests

```bash
npm run test:watch
```

### Build for Production

```bash
npm run build
npm start
```

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Next Steps

1. ✅ Backend is now running
2. 🔜 Set up authentication (JWT)
3. 🔜 Build frontend application
4. 🔜 Deploy to production

## Support

If you encounter issues:
1. Check the [README.md](./README.md) for more details
2. Review the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Open an issue on GitHub

Happy tracking! 💪
