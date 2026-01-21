# 75 Hard Tracker - Backend API

Backend API for the 75 Hard Challenge tracking application. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

✅ **Core Functionality**
- Create and manage 75 Hard challenges
- Track daily task completion with timestamps
- Automatic streak calculation and reset logic
- Progress statistics and analytics
- RESTful API design

✅ **Database Models**
- User model with profile information
- Challenge model (start date, current day, status)
- DailyLog model with all 6 daily tasks
- Task completion timestamps
- Challenge history tracking

✅ **Business Logic**
- Initialize new 75 Hard challenge for users
- Daily task check-in system
- Automatic streak calculation
- Reset logic when a day is missed
- Day counter increment (0-75)
- Validation that all tasks are completed

✅ **Data Validation**
- One active challenge per user
- No future-dating of completions
- No backdating before challenge start
- Timezone-aware date handling
- Proper error handling and responses

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Testing:** Jest + Supertest
- **Code Quality:** TypeScript strict mode

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   └── challengeController.ts
│   ├── services/          # Business logic
│   │   └── challengeService.ts
│   ├── routes/            # API routes
│   │   └── challengeRoutes.ts
│   ├── middleware/        # Express middleware
│   │   └── errorHandler.ts
│   ├── utils/             # Utilities
│   │   ├── prisma.ts
│   │   └── errors.ts
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── tests/                 # Test files
│   ├── challengeService.test.ts
│   └── api.test.ts
├── dist/                  # Compiled JavaScript (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/75hard"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRATION="7d"
   PORT=3000
   NODE_ENV="development"
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:3000`

### Database Setup

If you need to set up PostgreSQL locally:

```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql
createdb 75hard

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb 75hard

# Windows
# Download and install from postgresql.org
# Then create database using pgAdmin or psql
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Documentation

Comprehensive API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Example

**Create a Challenge:**
```bash
POST /api/challenges
{
  "userId": "user-123",
  "startDate": "2024-01-01"
}
```

**Submit Daily Tasks:**
```bash
POST /api/challenges/:id/daily-log
{
  "diet": true,
  "workout1": true,
  "workout2": true,
  "water": true,
  "reading": true,
  "photo": true,
  "photoUrl": "https://example.com/photo.jpg",
  "notes": "Great day!"
}
```

**Get Progress:**
```bash
GET /api/challenges/:id/progress
```

## Testing

The project includes comprehensive unit and integration tests.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

Current test coverage: **70%** overall
- Services: 78.94%
- Controllers: 22%
- Middleware: 80%

## Database Schema

### User
```prisma
model User {
  id         String      @id @default(uuid())
  email      String      @unique
  name       String?
  password   String
  challenges Challenge[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

### Challenge
```prisma
model Challenge {
  id         String     @id @default(uuid())
  userId     String
  user       User       @relation(fields: [userId], references: [id])
  startDate  DateTime   @default(now())
  currentDay Int        @default(0)
  status     String     @default("active")
  dailyLogs  DailyLog[]
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}
```

### DailyLog
```prisma
model DailyLog {
  id           String    @id @default(uuid())
  challengeId  String
  challenge    Challenge @relation(fields: [challengeId], references: [id])
  date         DateTime  @db.Date
  diet         Boolean   @default(false)
  workout1     Boolean   @default(false)
  workout2     Boolean   @default(false)
  water        Boolean   @default(false)
  reading      Boolean   @default(false)
  photo        Boolean   @default(false)
  photoUrl     String?
  notes        String?
  completedAt  DateTime?
  dietTime     DateTime?
  workout1Time DateTime?
  workout2Time DateTime?
  waterTime    DateTime?
  readingTime  DateTime?
  photoTime    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  @@unique([challengeId, date])
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate active challenge)
- `500` - Internal Server Error

## Business Logic Details

### Challenge Rules

1. **One Active Challenge:** Users can only have one active challenge at a time
2. **Consecutive Days:** Progress only advances on consecutive completed days
3. **All Tasks Required:** All 6 daily tasks must be completed to count the day
4. **No Future Dates:** Cannot log tasks for future dates
5. **Automatic Reset:** Missing any task resets the challenge to day 0

### Streak Calculation

The streak is calculated based on:
- Consecutive days with all 6 tasks completed
- Any missed day breaks the streak
- Challenge status updates to "failed" if streak breaks
- Challenge status updates to "completed" at day 75

### Daily Task Validation

- Tasks can be logged for today or past dates only
- Cannot log before the challenge start date
- Each task completion is timestamped
- A day is "complete" when all tasks are true and `completedAt` is set

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configuration (to be added)
- Prettier formatting (to be added)

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Write/update tests
4. Ensure all tests pass
5. Submit pull request

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables (Production)

Ensure these are set in your production environment:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret for JWT tokens
- `PORT` - Server port (default: 3000)
- `NODE_ENV=production`

### Deployment Platforms

Recommended platforms:
- **Railway** - Easy PostgreSQL + Node.js deployment
- **Heroku** - Classic PaaS with PostgreSQL addon
- **AWS ECS** - Containerized deployment
- **DigitalOcean App Platform** - Simple deployment with managed database

## Performance Considerations

- Database indexes on frequently queried fields (userId, challengeId, date)
- Cascading deletes configured for data integrity
- Connection pooling via Prisma
- Efficient query patterns (avoid N+1 queries)

## Security

Current security measures:
- Input validation on all endpoints
- Error messages don't leak sensitive information
- Prepared statements via Prisma (SQL injection protection)

To be implemented:
- Authentication middleware (JWT)
- Rate limiting
- CORS configuration for production
- Input sanitization
- Password hashing (bcrypt)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review existing issues and discussions

---

**Built with ❤️ for the 75 Hard community**
