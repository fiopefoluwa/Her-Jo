# HerJo Backend API

Express.js API server for the HerJo culturally grounded fintech platform.

## Quick Start

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3001`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users/:id` | Get user profile |
| GET | `/api/users/:id/trust-score` | Get trust score |
| GET | `/api/circles` | List all circles |
| GET | `/api/circles/:id` | Get circle details |
| POST | `/api/circles` | Create new circle |
| GET | `/api/contributions` | Recent activity |
| POST | `/api/contributions` | Record contribution |

## Architecture

```
backend/
├── src/
│   ├── server.js          # Express app entry
│   ├── routes/
│   │   ├── users.js       # User profile endpoints
│   │   ├── circles.js     # Savings circle endpoints
│   │   └── contributions.js # Activity & contributions
│   ├── middleware/
│   │   └── auth.js        # Authentication (placeholder)
│   └── data/
│       └── mockData.js    # In-memory mock data
└── package.json
```
