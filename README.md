# 75 Day Hard Tracker

A comprehensive web application to track and manage the 75 Hard challenge - a transformative mental toughness program that requires completing five daily tasks for 75 consecutive days.

## 📋 Project Overview

The 75 Hard Tracker is a Progressive Web Application (PWA) designed to help users successfully complete the 75 Hard challenge by providing an intuitive interface for daily habit tracking, progress visualization, and motivational insights. The application ensures accountability through streak tracking and offers both online and offline functionality.

### What is 75 Hard?

The 75 Hard challenge consists of completing these five tasks every day for 75 days:
1. Follow a diet (no cheat meals or alcohol)
2. Complete two 45-minute workouts (one must be outdoors)
3. Drink 1 gallon of water
4. Read 10 pages of a non-fiction book
5. Take a progress photo

Missing any task means starting over from day 1.

## ✨ Features

### Core Functionality
- **Daily Habit Tracking**: Check off each of the five daily tasks with timestamp recording
- **Streak Management**: Automatic streak counting with reset on missed days
- **Progress Visualization**: Interactive charts and graphs showing completion rates and trends
- **Calendar View**: Visual month/week calendar displaying completed vs. missed days
- **Progress Photos**: Upload and gallery view of daily progress photos
- **Motivational Dashboard**: Daily quotes, completion percentage, and milestone celebrations

### User Experience
- **Authentication & User Profiles**: Secure login with personalized tracking
- **PWA Capabilities**: Install on mobile devices, offline support, push notifications
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme toggle for comfortable viewing
- **Data Export**: Export progress data as CSV or PDF reports

### Advanced Features
- **Social Sharing**: Share milestones and progress on social media
- **Reminders & Notifications**: Daily task reminders and encouragement
- **Notes & Reflections**: Add daily journal entries about your journey
- **Challenge History**: View past attempts and compare progress

## 🛠️ Tech Stack

### Frontend
- **React 18+**: Component-based UI architecture
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Redux Toolkit** or **Zustand**: State management
- **Chart.js** or **Recharts**: Data visualization
- **date-fns**: Date manipulation and formatting

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **PostgreSQL**: Primary database for user data and progress
- **Prisma** or **TypeORM**: Database ORM
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### Infrastructure & Tools
- **Vercel** or **Netlify**: Frontend hosting
- **Railway** or **Heroku**: Backend hosting
- **AWS S3** or **Cloudinary**: Image storage for progress photos
- **GitHub Actions**: CI/CD pipeline
- **Jest** & **React Testing Library**: Unit and integration testing
- **Cypress**: End-to-end testing
- **ESLint** & **Prettier**: Code quality and formatting

### PWA Features
- **Workbox**: Service worker management
- **Web App Manifest**: Install prompt and app metadata
- **IndexedDB**: Local data persistence for offline mode

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/zordhalo/75-day-hard-tracker.git
cd 75-day-hard-tracker

# Install backend dependencies
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# Run database migrations
npm run migrate

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with API endpoint

# Start development server
npm run dev
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/75hard
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
PORT=3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=75 Day Hard Tracker
```

## 📁 Project Structure

```
75-day-hard-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── prisma/              # Database schema and migrations
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   ├── services/        # API calls
│   │   ├── utils/           # Helper functions
│   │   ├── assets/          # Images, fonts, etc.
│   │   └── styles/          # Global styles
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   └── service-worker.js
│   ├── tests/               # Frontend tests
│   └── package.json
├── docs/                    # Additional documentation
├── .github/
│   └── workflows/           # CI/CD workflows
└── README.md
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend Deployment (Railway)

1. Connect your GitHub repository to Railway
2. Configure environment variables in Railway dashboard
3. Deploy automatically on git push

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository** and create your branch from `main`
2. **Clone your fork** locally
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** and commit: `git commit -m 'Add amazing feature'`
5. **Write/update tests** for your changes
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with a clear description

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep PRs focused on a single feature or fix

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components and hooks in React
- Write self-documenting code with clear variable names
- Add comments for complex logic

### Reporting Issues

Found a bug or have a feature request? Please create an issue with:
- Clear, descriptive title
- Detailed description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Project Maintainer** - [zordhalo](https://github.com/zordhalo)

## 🙏 Acknowledgments

- Inspired by Andy Frisella's 75 Hard challenge
- Built with love for the fitness and self-improvement community
- Special thanks to all contributors

## 📞 Support

Have questions or need help? 
- Open an [issue](https://github.com/zordhalo/75-day-hard-tracker/issues)
- Check out the [documentation](docs/)
- Join our community discussions

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features and friend challenges
- [ ] Integration with fitness trackers
- [ ] Customizable challenge rules
- [ ] Multi-language support
- [ ] AI-powered insights and recommendations

---

**Ready to start your 75 Hard journey? Let's build mental toughness together! 💪**
