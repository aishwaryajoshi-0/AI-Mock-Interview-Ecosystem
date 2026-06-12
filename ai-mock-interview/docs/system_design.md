# System Design

## High-Level Architecture

```mermaid
flowchart LR
  A[Frontend (React + Vite)] -->|REST / GraphQL| B[Backend (Node.js + Express)]
  B --> C[MongoDB]
  B --> D[Redis]
  B --> E[AI Service (FastAPI)]
  E -->|NLP / LLM / Emotion| B
  B --> F[Cloudinary]
```

## Frontend Architecture

The frontend uses React with Vite for a lightweight, fast build environment. Key responsibilities include:

- Client-side routing and protected routes
- User authentication and profile management
- Interview session flow UI
- Feedback and analytics dashboards
- API integration with backend endpoints

The frontend is served as a static SPA using Nginx in production.

## Backend Architecture

The backend is implemented with Node.js 22 and Express. It follows MVC principles:

- `controllers/` handle HTTP requests and response formatting
- `models/` define MongoDB schemas with Mongoose
- `routes/` define REST endpoints and middleware chains
- `services/` encapsulate business logic and external API integration
- `middleware/` provides auth, validation, rate limiting, and error handling
- `utils/` contains shared helpers for token generation, scoring, and API responses

The backend also integrates with:

- MongoDB for persistent storage
- Redis for caching, session management, and rate limiting
- Cloudinary for uploaded media assets
- AI service for NLP, emotion detection, and model inference

## AI Service Architecture

The AI service is built with Python 3.12 and FastAPI:

- `/nlp` processes transcript text and returns sentiment analysis
- `/emotion` processes frame metadata and returns confidence scores
- `/resume` parses resume references into question suggestions
- `/llm` returns model-generated feedback and ideal answer guidance

The service is containerized separately to allow independent scaling.

## Database Design

### MongoDB Collections

- `users`
  - `name`, `email`, `password`, `role`, `avatar`, `resumeUrl`, `createdAt`

- `questions`
  - `text`, `domain`, `difficulty`, `type`, `tags`, `createdBy`, `createdAt`

- `sessions`
  - `userId`, `domain`, `questions[]`, `answers[]`, `scores[]`, `overallScore`, `duration`, `status`, `createdAt`

- `feedback`
  - `sessionId`, `userId`, `questionId`, `transcript`, `sentimentScore`, `fillerWordCount`, `keywordsMatched[]`, `contentScore`, `finalScore`, `suggestions[]`, `createdAt`

## Authentication Flow

1. User registers with name, email, and password.
2. Password is hashed using bcrypt.
3. Backend issues a JWT signed using `JWT_SECRET`.
4. Frontend stores the token and includes it in `Authorization: Bearer` headers.
5. Protected routes validate JWT and attach user context to requests.
6. Refresh tokens are managed with a separate `REFRESH_TOKEN_SECRET`.

## Interview Workflow

1. User starts a session with selected domain and question set.
2. Backend creates a session record in MongoDB with `ongoing` status.
3. User submits answers via the interview endpoint.
4. Backend forwards answers and context to the AI service for feedback.
5. The AI service returns sentiment, keyword analysis, and model evaluation.
6. The backend stores scores and feedback.
7. When the user ends the session, the backend marks the session `completed` and calculates the final score.

## Scalability Considerations

- Containerized services allow independent scaling of frontend, backend, AI service, MongoDB, and Redis.
- MongoDB and Redis use persistent volumes for data durability.
- The AI service is decoupled to support horizontal scaling and specialized resources.
- Nginx static hosting reduces backend load for frontend assets.
- Rate limiting protects APIs from abuse and spikes.
- Caching with Redis improves response times for repeated queries.
- CI/CD builds Docker images to support consistent production deployments.
