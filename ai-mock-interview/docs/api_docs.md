# API Documentation

## Authentication APIs

### Register a new user

`POST /api/auth/register`

Request:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SuperSecure123"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "64123aa5...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "student",
      "avatar": null,
      "resumeUrl": null
    },
    "token": "eyJhbGci..."
  }
}
```

Status codes:
- `201 Created`
- `400 Bad Request`
- `409 Conflict`
- `500 Internal Server Error`

### Login

`POST /api/auth/login`

Request:
```json
{
    "email": "jane@example.com",
    "password": "SuperSecure123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64123aa5...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "student",
      "avatar": null,
      "resumeUrl": null
    },
    "token": "eyJhbGci..."
  }
}
```

Status codes:
- `200 OK`
- `401 Unauthorized`
- `400 Bad Request`

### Logout

`POST /api/auth/logout`

Headers:
- `Authorization: Bearer <JWT>`

Response:
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

Status codes:
- `200 OK`
- `401 Unauthorized`

### Get profile

`GET /api/auth/profile`

Headers:
- `Authorization: Bearer <JWT>`

Response:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "64123aa5...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student",
    "avatar": null,
    "resumeUrl": null,
    "createdAt": "2026-06-09T12:34:56.789Z"
  }
}
```

Status codes:
- `200 OK`
- `401 Unauthorized`

### Update profile

`PUT /api/auth/profile`

Request:
```json
{
  "name": "Jane Doe Updated",
  "email": "jane.new@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

Status codes:
- `200 OK`
- `400 Bad Request`
- `401 Unauthorized`

### Upload avatar

`POST /api/auth/upload-avatar`

Form Data:
- `avatar`: image file

Response:
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

Status codes:
- `200 OK`
- `400 Bad Request`
- `401 Unauthorized`

## User APIs

### Get all questions

`GET /api/questions`

Headers:
- `Authorization: Bearer <JWT>`

Response:
```json
{
  "success": true,
  "message": "Questions retrieved successfully",
  "data": [ ... ]
}
```

Status codes:
- `200 OK`
- `401 Unauthorized`

### Get question by ID

`GET /api/questions/:id`

Response:
- `200 OK`
- `404 Not Found`

### Get questions by domain

`GET /api/questions/domain/:domain`

Response:
- `200 OK`
- `404 Not Found`

### Create question

`POST /api/questions`

Request:
```json
{
  "text": "Explain dependency injection.",
  "domain": "software engineering",
  "difficulty": "medium",
  "type": "technical",
  "tags": ["architecture", "design"]
}
```

Response:
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`

### Update question

`PUT /api/questions/:id`

Response:
- `200 OK`
- `403 Forbidden`
- `404 Not Found`

### Delete question

`DELETE /api/questions/:id`

Response:
- `200 OK`
- `403 Forbidden`
- `404 Not Found`

## Resume APIs

### Parse resume and generate questions

The backend uses the AI service to parse resume content.

`POST /api/feedback/generate`

Payload:
```json
{
  "sessionId": "64123aa5...",
  "transcript": "I led...",
  "questionId": "65123bb6...",
  "frameData": "base64encodedimage"
}
```

Response:
```json
{
  "success": true,
  "message": "Feedback generated successfully",
  "data": {
    "feedback": { ... },
    "idealAnswer": "A strong answer emphasizes..."
  }
}
```

Status codes:
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

## Interview APIs

### Start session

`POST /api/interview/start`

Request:
```json
{
  "domain": "frontend",
  "questions": ["Explain React hooks."]
}
```

Response:
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`

### Submit answer

`POST /api/interview/submit-answer`

Request:
```json
{
  "sessionId": "64123aa5...",
  "answer": "I use hooks to manage state..."
}
```

Response:
- `200 OK`
- `404 Not Found`

### End session

`POST /api/interview/end`

Request:
```json
{
  "sessionId": "64123aa5...",
  "duration": 420
}
```

Response:
- `200 OK`
- `404 Not Found`

### Get session by ID

`GET /api/interview/:id`

Response:
- `200 OK`
- `403 Forbidden`
- `404 Not Found`

### Get all sessions

`GET /api/interview/all`

Response:
- `200 OK`
- `401 Unauthorized`

## AI Feedback APIs

### Generate feedback

`POST /api/feedback/generate`

This endpoint proxies transcript and frame data to the AI microservice.

Status codes:
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

### Feedback by session

`GET /api/feedback/session/:sessionId`

Response:
- `200 OK`
- `404 Not Found`

### Feedback by ID

`GET /api/feedback/:id`

Response:
- `200 OK`
- `404 Not Found`

## Report APIs

The backend can expose report data through admin endpoints.

### Get dashboard stats

`GET /api/admin/stats`

Response:
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "userCount": 12,
    "sessionCount": 88,
    "questionCount": 34,
    "feedbackCount": 210
  }
}
```

Status codes:
- `200 OK`
- `401 Unauthorized`

## Admin APIs

### List users

`GET /api/admin/users`

Response:
- `200 OK`
- `401 Unauthorized`

### Get user by ID

`GET /api/admin/users/:id`

Response:
- `200 OK`
- `404 Not Found`

### Delete user

`DELETE /api/admin/users/:id`

Response:
- `200 OK`
- `404 Not Found`

### Dashboard data

`GET /api/admin/dashboard`

Response:
- `200 OK`

## Status Codes Summary

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation or request data error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Unexpected server failure

## Environment Configuration

The stack requires the following environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `REDIS_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `OPENAI_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `FRONTEND_URL`
- `BACKEND_URL`
- `AI_SERVICE_URL`

See `../.env.example` for the template.
