# AI Real-Time Chat

A production-ready minimal real-time chat application with AI integration, built using Next.js, Node.js, Socket.IO, Google OAuth, Gemini API, and Razorpay.

## Features
- Google OAuth Authentication
- Real-Time Messaging (Socket.IO)
- AI Suggestions & Chat Summarization (Gemini API)
- Premium Feature Unlock via Razorpay

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Update the `.env` file with your credentials (Google Client ID, Gemini API Key, Razorpay Keys).
4. Run `node server.js` to start the backend server on port 5000.

### Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Update the `.env.local` file with your `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
4. Run `npm run dev` to start the Next.js development server.
5. Open `http://localhost:3000` in your browser.

## Deployment
- **Frontend**: Deploy on Vercel by importing the `frontend` directory. Ensure to add environment variables.
- **Backend**: Deploy on Render. Set up environment variables and start command as `node server.js`.

## Tech Stack
- Frontend: Next.js (App Router, TailwindCSS)
- Backend: Node.js, Express
- Real-time: Socket.IO
- Auth: Google OAuth
- Payments: Razorpay
- AI: Google Gemini API
