# 75 Hard Tracker API Documentation

## Overview

This API provides endpoints for managing the 75 Hard challenge, including creating challenges, tracking daily tasks, and monitoring progress.

**Base URL:** `http://localhost:3000/api`

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "75 Hard Tracker API is running"
}
```

---

### Challenge Management

#### POST /api/challenges
Create a new 75 Hard challenge for a user.

**Request Body:**
```json
{
  "userId": "string (required)",
  "startDate": "ISO 8601 date (optional, defaults to today)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "startDate": "2024-01-01T00:00:00.000Z",
  "currentDay": 0,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Missing userId
- `409 Conflict` - User already has an active challenge

---

#### GET /api/challenges/:id
Get details of a specific challenge.

**Parameters:**
- `id` (path) - Challenge UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "startDate": "2024-01-01T00:00:00.000Z",
  "currentDay": 5,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-05T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "dailyLogs": [
    {
      "id": "uuid",
      "challengeId": "uuid",
      "date": "2024-01-05T00:00:00.000Z",
      "diet": true,
      "workout1": true,
      "workout2": true,
      "water": true,
      "reading": true,
      "photo": true,
      "photoUrl": "https://example.com/photo.jpg",
      "notes": "Great day!",
      "completedAt": "2024-01-05T22:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `404 Not Found` - Challenge does not exist

---

#### DELETE /api/challenges/:id
Delete a challenge.

**Parameters:**
- `id` (path) - Challenge UUID

**Response:** `200 OK`
```json
{
  "message": "Challenge deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Challenge does not exist

---

### Daily Logs

#### POST /api/challenges/:id/daily-log
Submit or update daily tasks for a challenge.

**Parameters:**
- `id` (path) - Challenge UUID

**Request Body:**
```json
{
  "date": "ISO 8601 date (optional, defaults to today)",
  "diet": true,
  "workout1": true,
  "workout2": true,
  "water": true,
  "reading": true,
  "photo": true,
  "photoUrl": "https://example.com/photo.jpg",
  "notes": "Great workout today!"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "date": "2024-01-05T00:00:00.000Z",
  "diet": true,
  "workout1": true,
  "workout2": true,
  "water": true,
  "reading": true,
  "photo": true,
  "photoUrl": "https://example.com/photo.jpg",
  "notes": "Great workout today!",
  "dietTime": "2024-01-05T10:00:00.000Z",
  "workout1Time": "2024-01-05T11:00:00.000Z",
  "workout2Time": "2024-01-05T17:00:00.000Z",
  "waterTime": "2024-01-05T20:00:00.000Z",
  "readingTime": "2024-01-05T21:00:00.000Z",
  "photoTime": "2024-01-05T22:00:00.000Z",
  "completedAt": "2024-01-05T22:00:00.000Z",
  "createdAt": "2024-01-05T10:00:00.000Z",
  "updatedAt": "2024-01-05T22:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid date (future date or before challenge start)
- `400 Bad Request` - Challenge is not active
- `404 Not Found` - Challenge does not exist

---

#### PUT /api/challenges/:id/daily-log/:date
Update daily log for a specific date.

**Parameters:**
- `id` (path) - Challenge UUID
- `date` (path) - Date in YYYY-MM-DD format

**Request Body:**
```json
{
  "diet": true,
  "workout1": true,
  "workout2": false,
  "water": true,
  "reading": false,
  "photo": false,
  "photoUrl": null,
  "notes": "Updated notes"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "date": "2024-01-05T00:00:00.000Z",
  "diet": true,
  "workout1": true,
  "workout2": false,
  "water": true,
  "reading": false,
  "photo": false,
  "photoUrl": null,
  "notes": "Updated notes",
  "completedAt": null,
  "createdAt": "2024-01-05T10:00:00.000Z",
  "updatedAt": "2024-01-05T15:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid date
- `404 Not Found` - Challenge does not exist

---

#### GET /api/challenges/:id/daily-log/today
Get today's daily log for a challenge.

**Parameters:**
- `id` (path) - Challenge UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "date": "2024-01-05T00:00:00.000Z",
  "diet": true,
  "workout1": false,
  "workout2": false,
  "water": false,
  "reading": false,
  "photo": false
}
```

Or if no log exists for today:
```json
{
  "message": "No log for today yet"
}
```

---

#### GET /api/challenges/:id/daily-log/:date
Get daily log for a specific date.

**Parameters:**
- `id` (path) - Challenge UUID
- `date` (path) - Date in YYYY-MM-DD format

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "date": "2024-01-05T00:00:00.000Z",
  "diet": true,
  "workout1": true,
  "workout2": true,
  "water": true,
  "reading": true,
  "photo": true
}
```

Or if no log exists:
```json
{
  "message": "No log for this date"
}
```

---

### Progress Tracking

#### GET /api/challenges/:id/progress
Get progress statistics for a challenge.

**Parameters:**
- `id` (path) - Challenge UUID

**Response:** `200 OK`
```json
{
  "currentDay": 5,
  "totalDays": 75,
  "completionPercentage": 6.67,
  "longestStreak": 5,
  "status": "active",
  "tasksCompletedByCategory": {
    "diet": 5,
    "workout1": 5,
    "workout2": 4,
    "water": 5,
    "reading": 5,
    "photo": 5
  },
  "dailyLogs": [
    {
      "id": "uuid",
      "date": "2024-01-01T00:00:00.000Z",
      "diet": true,
      "workout1": true,
      "workout2": true,
      "water": true,
      "reading": true,
      "photo": true,
      "completedAt": "2024-01-01T22:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `404 Not Found` - Challenge does not exist

---

## Data Models

### User
```typescript
{
  id: string;          // UUID
  email: string;       // Unique email
  name?: string;       // Optional name
  password: string;    // Hashed password
  createdAt: Date;
  updatedAt: Date;
}
```

### Challenge
```typescript
{
  id: string;          // UUID
  userId: string;      // Foreign key to User
  startDate: Date;     // Challenge start date
  currentDay: number;  // Current consecutive day count (0-75)
  status: string;      // "active" | "completed" | "failed"
  createdAt: Date;
  updatedAt: Date;
}
```

### DailyLog
```typescript
{
  id: string;           // UUID
  challengeId: string;  // Foreign key to Challenge
  date: Date;           // Date of the log (normalized to midnight)
  diet: boolean;        // Task 1: Follow diet
  workout1: boolean;    // Task 2: First 45-min workout
  workout2: boolean;    // Task 3: Second 45-min workout (outdoor)
  water: boolean;       // Task 4: Drink 1 gallon of water
  reading: boolean;     // Task 5: Read 10 pages
  photo: boolean;       // Task 6: Take progress photo
  photoUrl?: string;    // URL to progress photo
  notes?: string;       // Optional daily notes
  completedAt?: Date;   // Timestamp when all 6 tasks completed
  dietTime?: Date;      // Timestamp when diet task completed
  workout1Time?: Date;  // Timestamp when workout1 completed
  workout2Time?: Date;  // Timestamp when workout2 completed
  waterTime?: Date;     // Timestamp when water task completed
  readingTime?: Date;   // Timestamp when reading completed
  photoTime?: Date;     // Timestamp when photo uploaded
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Business Logic

### Challenge Creation
- Only one active challenge per user is allowed
- Start date defaults to current date if not provided
- Challenge begins at day 0

### Daily Task Tracking
- Tasks can only be logged for today or past dates (not future)
- Tasks cannot be logged before the challenge start date
- Each task completion is timestamped
- A day is considered "completed" when all 6 tasks are marked true
- The `completedAt` timestamp is set when all tasks are completed

### Streak Calculation
- Current day increments for each consecutive day with all tasks completed
- If a day is missed (not all tasks completed by midnight), streak resets to 0
- Challenge status changes to "failed" if streak is broken
- Challenge status changes to "completed" when day 75 is reached

### Challenge Reset
- If any task is missed on a given day, the challenge automatically resets
- Users must start over from day 1
- Previous logs are preserved for history

### Progress Updates
- Progress is automatically recalculated after each daily log submission
- Longest streak tracks the maximum consecutive days achieved
- Category completion counts track individual task performance

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message",
  "status": 400
}
```

**Common Status Codes:**
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error or invalid input
- `404 Not Found` - Resource does not exist
- `409 Conflict` - Resource conflict (e.g., duplicate active challenge)
- `500 Internal Server Error` - Unexpected server error

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Building for Production

```bash
npm run build
npm start
```

---

## Example Usage

### Create a Challenge
```bash
curl -X POST http://localhost:3000/api/challenges \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "startDate": "2024-01-01"
  }'
```

### Submit Daily Tasks
```bash
curl -X POST http://localhost:3000/api/challenges/challenge-id/daily-log \
  -H "Content-Type: application/json" \
  -d '{
    "diet": true,
    "workout1": true,
    "workout2": true,
    "water": true,
    "reading": true,
    "photo": true,
    "photoUrl": "https://example.com/photo.jpg",
    "notes": "Great day!"
  }'
```

### Get Progress
```bash
curl http://localhost:3000/api/challenges/challenge-id/progress
```

---

## Future Enhancements

- User authentication and authorization
- Image upload handling for progress photos
- Push notifications for daily reminders
- Social features and friend challenges
- Export data as CSV/PDF
- Mobile app integration
