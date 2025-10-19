# 75 Hard Tracker - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATIONS                       │
│                  (Frontend / Mobile / CLI Tools)                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP/REST
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                        EXPRESS.JS API                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      ROUTES LAYER                        │   │
│  │  GET  /health                                            │   │
│  │  POST /api/challenges                                    │   │
│  │  GET  /api/challenges/:id                                │   │
│  │  POST /api/challenges/:id/daily-log                      │   │
│  │  PUT  /api/challenges/:id/daily-log/:date                │   │
│  │  GET  /api/challenges/:id/daily-log/today                │   │
│  │  GET  /api/challenges/:id/daily-log/:date                │   │
│  │  GET  /api/challenges/:id/progress                       │   │
│  │  DELETE /api/challenges/:id                              │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │                  CONTROLLERS LAYER                       │   │
│  │  - ChallengeController                                   │   │
│  │    • createChallenge()                                   │   │
│  │    • getChallenge()                                      │   │
│  │    • submitDailyLog()                                    │   │
│  │    • updateDailyLog()                                    │   │
│  │    • getTodayLog()                                       │   │
│  │    • getDailyLog()                                       │   │
│  │    • getProgress()                                       │   │
│  │    • deleteChallenge()                                   │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │                   SERVICES LAYER                         │   │
│  │  - ChallengeService                                      │   │
│  │    • Business Logic                                      │   │
│  │    • Validation Rules                                    │   │
│  │    • Streak Calculation                                  │   │
│  │    • Progress Analytics                                  │   │
│  │    • Reset Logic                                         │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │                 MIDDLEWARE LAYER                         │   │
│  │  - Error Handler                                         │   │
│  │  - CORS                                                  │   │
│  │  - JSON Parser                                           │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ Prisma ORM
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      POSTGRESQL DATABASE                          │
│                                                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│  │    Users    │      │ Challenges  │      │ Daily Logs  │     │
│  ├─────────────┤      ├─────────────┤      ├─────────────┤     │
│  │ id          │──┐   │ id          │──┐   │ id          │     │
│  │ email       │  │   │ userId      │◄─┘   │ challengeId │◄─┐  │
│  │ name        │  └──►│ startDate   │      │ date        │  │  │
│  │ password    │      │ currentDay  │──────┤ diet        │  │  │
│  │ createdAt   │      │ status      │      │ workout1    │  │  │
│  │ updatedAt   │      │ createdAt   │      │ workout2    │  │  │
│  └─────────────┘      │ updatedAt   │      │ water       │  │  │
│                       └─────────────┘      │ reading     │  │  │
│                                            │ photo       │  │  │
│                                            │ photoUrl    │  │  │
│                                            │ notes       │  │  │
│                                            │ completedAt │  │  │
│                                            │ *Time fields│  │  │
│                                            │ createdAt   │  │  │
│                                            │ updatedAt   │  │  │
│                                            └─────────────┘  │  │
│                                                              │  │
│  Relationships:                                              │  │
│  • User → Challenges (1:N)                                   │  │
│  • Challenge → DailyLogs (1:N) ◄────────────────────────────┘  │
│  • Cascading deletes enabled                                    │
│  • Unique constraint: (challengeId, date)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Create Challenge Flow
```
Client Request
    │
    ├─► POST /api/challenges { userId, startDate? }
    │
    ├─► ChallengeController.createChallenge()
    │
    ├─► ChallengeService.createChallenge()
    │   │
    │   ├─► Check for existing active challenge
    │   └─► Create new challenge in database
    │
    └─► Response: Challenge object
```

### 2. Submit Daily Tasks Flow
```
Client Request
    │
    ├─► POST /api/challenges/:id/daily-log { tasks... }
    │
    ├─► ChallengeController.submitDailyLog()
    │
    ├─► ChallengeService.submitDailyLog()
    │   │
    │   ├─► Validate challenge exists and is active
    │   ├─► Validate date (not future, not before start)
    │   ├─► Create/update daily log with timestamps
    │   ├─► Check if all tasks completed
    │   └─► Update challenge progress
    │       │
    │       ├─► Calculate consecutive days
    │       ├─► Update currentDay counter
    │       ├─► Check for missed days
    │       └─► Update status (active/completed/failed)
    │
    └─► Response: DailyLog object
```

### 3. Get Progress Flow
```
Client Request
    │
    ├─► GET /api/challenges/:id/progress
    │
    ├─► ChallengeController.getProgress()
    │
    ├─► ChallengeService.getProgress()
    │   │
    │   ├─► Get challenge with all daily logs
    │   ├─► Calculate task completion counts
    │   ├─► Calculate longest streak
    │   ├─► Calculate completion percentage
    │   └─► Build statistics object
    │
    └─► Response: Progress statistics
```

## Business Logic Rules

### Challenge States
```
┌──────────┐
│  ACTIVE  │ ◄──── Initial state when created
└────┬─────┘
     │
     ├─► All tasks completed daily for 75 days
     │   └─► Status: COMPLETED ✓
     │
     └─► Any task missed or incomplete
         └─► Status: FAILED ✗
             └─► currentDay resets to 0
```

### Streak Calculation
```
Day 1: All tasks ✓ → Streak = 1
Day 2: All tasks ✓ → Streak = 2
Day 3: All tasks ✓ → Streak = 3
...
Day 4: Missing task ✗ → Streak = 0 (RESET)
Day 5: All tasks ✓ → Streak = 1 (Start over)
```

### Daily Log Validation
```
Request Date Check:
    │
    ├─► Is date in the future? → ✗ Error 400
    │
    ├─► Is date before challenge start? → ✗ Error 400
    │
    ├─► Is challenge active? → No → ✗ Error 400
    │
    └─► All checks pass → ✓ Process request
```

## API Response Format

### Success Response
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  ...
}
```

### Error Response
```json
{
  "error": "Descriptive error message",
  "status": 400
}
```

## Testing Strategy

```
Unit Tests
    │
    ├─► ChallengeService
    │   ├─► createChallenge()
    │   ├─► getChallengeById()
    │   ├─► submitDailyLog()
    │   ├─► updateChallengeProgress()
    │   ├─► getProgress()
    │   └─► deleteChallenge()
    │
    └─► API Endpoints
        ├─► Health check
        ├─► Error handling
        ├─► Validation
        └─► 404 handling

Coverage: 70% overall
```

## Technology Stack

```
Runtime:      Node.js 18+
Framework:    Express.js
Language:     TypeScript (strict mode)
Database:     PostgreSQL 14+
ORM:          Prisma
Testing:      Jest + Supertest
Dev Tools:    Nodemon, ts-node
```

## Key Features

✅ **Completed**
- RESTful API design
- Complete CRUD operations
- Automatic streak tracking
- Progress analytics
- Data validation
- Error handling
- Unit testing
- Integration testing
- Comprehensive documentation

🔜 **Future Enhancements**
- JWT Authentication
- Rate limiting
- Image upload handling
- Push notifications
- Social features
- Data export (CSV/PDF)
- WebSocket for real-time updates

## Performance Considerations

- Database indexes on frequently queried fields
- Efficient Prisma queries (avoid N+1)
- Connection pooling
- Proper error handling
- Validation at service layer

## Security Measures

✅ **Implemented**
- Input validation
- SQL injection protection (Prisma)
- Error message sanitization
- Cascading deletes for data integrity

🔜 **To Implement**
- Authentication (JWT)
- Authorization checks
- Rate limiting
- CORS configuration
- Input sanitization
- Password hashing

---

**Built for scalability, reliability, and developer experience** 🚀
