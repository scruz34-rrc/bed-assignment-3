# Event Management API

A REST API for managing events, built with Express, TypeScript, and Firebase Firestore.

## Project Overview

This API allows users to create, retrieve, update, and delete events. It is designed for applications that need to manage event data with support for categories, capacity tracking, and status management.

## Installation

**Prerequisites:** Node.js v18+

1. Clone the repository
```bash
git clone https://github.com/scruz34-rrc/bed-assignment-3.git
cd bed-assignment-3
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Fill in your Firebase credentials in the `.env` file.

4. Start the server
```bash
npm start
```

## API Request Examples

### Get All Events
```bash
curl -X GET http://localhost:3000/api/v1/events
```
**Response (200 OK):**
```json
{
  "message": "Events retrieved",
  "count": 1,
  "data": [...]
}
```

### Create an Event
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"name": "Tech Conference 2025", "date": "2025-12-15T10:00:00Z", "capacity": 100}'
```
**Response (201 Created):**
```json
{
  "message": "Event created",
  "data": { "id": "evt_000001", ... }
}
```

### Delete an Event
```bash
curl -X DELETE http://localhost:3000/api/v1/events/evt_000001
```
**Response (200 OK):**
```json
{
  "message": "Event deleted"
}
```

## Documentation

- **Public API docs:** https://scruz34-rrc.github.io/bed-assignment-3
- **Local Swagger UI:** http://localhost:3000/api-docs