# Kaito - Expense Tracker & Todo App

Kaito is a full-stack mobile application built with React Native and Node.js that helps users manage their daily expenses, track budgets, and organize tasks efficiently.

---

## Features

### Authentication

- User Registration
- User Login
- JWT-based Authentication
- Persistent Login using AsyncStorage

### Expense Management

- Add Expenses
- Update Expenses
- Delete Expenses
- View Expense History
- Monthly Expense Tracking

### Budget Management

- Set Monthly Budget
- Track Spending Progress
- Remaining Budget Calculation
- Category-wise Budget Tracking

### Todo Management

- Create Tasks
- Update Tasks
- Delete Tasks
- Mark Tasks as Completed
- Filter Tasks by Date

### State Management

- Redux Toolkit
- Async Thunks for API Calls
- Centralized Application State

---

## Tech Stack

### Frontend

- React Native
- Expo
- Redux Toolkit
- React Navigation
- Axios
- AsyncStorage

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt.js

### Deployment

- Backend: Render
- Mobile Build: Expo EAS Build

---

## Project Structure

```bash
kaito/
│
├── client/        # React Native Application
│
├── server/        # Express Backend API
│
└── README.md
```

---

## Getting Started

## Backend Setup

```bash
cd server

npm install

npm run dev
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## Frontend Setup

```bash
cd client

npm install

npm start
```

For Android:

```bash
npm run android
```

For Expo:

```bash
npx expo start
```

## Future Enhancements

- Expense Analytics
- Charts & Reports
- Dark/Light Theme
- Push Notifications
- Cloud Backup
