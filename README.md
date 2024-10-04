# Quiz API

A RESTful API for managing quizzes with user authentication. This API allows users to create accounts, log in, and manage their quizzes.

## Base URL

```
https://144ghj4asc.execute-api.eu-north-1.amazonaws.com
```

## Authentication

The API uses JWT (JSON Web Token) Bearer authentication. After logging in, include the token in the Authorization (Bearer token). Token is valid for 1H.

## API Endpoints

### Authentication

#### Sign Up
- **URL**: `/signup`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

#### Login
- **URL**: `/login`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response**: Returns a JWT token for authentication

### Quiz Operations

#### Create Quiz
- **URL**: `/quiz`
- **Method**: `POST`
- **Authentication**: Required
- **Body**:
```json
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
```

#### Get All Quizzes
- **URL**: `/quiz`
- **Method**: `GET`

#### Get Quiz by ID
- **URL**: `/quiz/{id}`
- **Method**: `GET`
- **Parameters**: 
  - `id` (path parameter): The UUID of the quiz
 
#### Update Quiz
- **URL**: `/quiz`
- **Method**: `PUT`
- **Authentication**: Required
- **Body**:
```json
{
  "quizId": "string",
  "title": "string",
  "questions": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
```

#### Delete Quiz
- **URL**: `/quiz/{id}`
- **Method**: `DELETE`
- **Authentication**: Required
- **Parameters**: 
  - `id` (path parameter): The UUID of the quiz


## Example Quiz Format
```json
{
  "title": "General Knowledge Quiz",
  "questions": [
    {
      "question": "What is the capital of France?",
      "answer": "Paris"
    },
    {
      "question": "What is 2 + 2?",
      "answer": "4"
    },
    {
      "question": "Who wrote 'To Kill a Mockingbird'?",
      "answer": "Harper Lee"
    }
  ]
}
```

## Authentication Flow
1. Create an account using the `/signup` endpoint
2. Log in using the `/login` endpoint to receive a JWT token
3. Include the JWT token in the Authorization header for all protected endpoints
