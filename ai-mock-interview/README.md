# AI Mock Interview Ecosystem

## Project Overview

AI Mock Interview Ecosystem is a production-ready interview coaching platform that combines a React + Vite frontend, a Node.js + Express backend, and a Python FastAPI AI microservice. The system supports interview session management, intelligent feedback generation, resume parsing, and admin analytics.

## Features

- User authentication and profile management
- Role-based access controls for students and admins
- Interview session lifecycle: start, submit answers, end, review
- AI-powered feedback using natural language processing and emotion analysis
- Resume parsing with question generation
- Admin dashboard with usage analytics and user management
- Docker Compose orchestration for local full-stack deployment
- CI/CD pipeline for linting, test execution, and Docker image builds

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js 22, Express.js, MongoDB, Redis, Mongoose
- AI Service: Python 3.12, FastAPI, Uvicorn
- Containerization: Docker, Docker Compose
- CI/CD: GitHub Actions

## Architecture Overview

The architecture separates concerns into three layers:

- Frontend: client UI and API consumption
- Backend: business logic, authentication, persistence, and API endpoints
- AI Service: FastAPI endpoints for NLP, emotion analysis, LLM inference, and resume parsing

Services are orchestrated by Docker Compose along with MongoDB and Redis.

## Installation Steps

1. Clone the repository:

```bash
git clone <repo-url>
cd AI_Mock_Interview_Ecosystem
```

2. Copy the environment example:

```bash
cp ai-mock-interview/.env.example ai-mock-interview/.env
```

3. Populate `.env` with your production or local development values.

## Environment Setup

The `.env.example` file includes:

- `MONGO_URI`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `REDIS_URL`
- `CLOUDINARY_*`
- `OPENAI_API_KEY`
- SMTP credentials
- `FRONTEND_URL`
- `BACKEND_URL`
- `AI_SERVICE_URL`

## Docker Setup

From the `ai-mock-interview` directory, run:

```bash
docker compose up --build
```

This command starts the frontend, backend, AI service, MongoDB, and Redis.

## Running Locally

### Start the full stack

```bash
cd ai-mock-interview
docker compose up --build
```

### Access endpoints

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- AI Service: `http://localhost:8000`

## API Documentation

See `docs/api_docs.md` for full API reference, request/response examples, and status codes.

## Screenshots

See the `docs/screenshots/` directory for sample UI and infrastructure diagrams.

## Future Enhancements

- Add end-to-end tests for the full interview flow
- Implement refresh token rotation and secure cookie handling
- Integrate a production-grade LLM provider with rate limiting
- Add role-based analytics and paid subscription support
- Improve AI service with additional conversational context and multimodal data

## Contributing Guide

Contributions are welcome via pull requests.

- Fork the repository
- Create a feature branch
- Add tests for new functionality
- Open a pull request with a clear description

## License

This project is licensed under the MIT License. See `LICENSE`.
