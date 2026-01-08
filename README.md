# Node.js Express MongoDB Project

This is a starter project with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/jin_db
   ```

## Usage

Start the development server:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

## Structure

- `src/server.js`: Entry point
- `src/app.js`: Express app setup
- `src/config/db.js`: Database connection
- `src/routes`: API routes
- `src/controllers`: Request handlers
- `src/models`: Mongoose models
