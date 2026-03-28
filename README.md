# SentraAI 🚀

AI-powered Intelligent Customer Complaint Dashboard.

## Features
- **Smart Categorization**: Automatically identifies payment, delivery, or auth issues.
- **Sentiment Analysis**: Detects customer mood from text.
- **Duplicate Detection**: Finds similar past complaints to avoid redundant work.
- **AI-Generated Resolutions**: Suggests professional replies using LLMs.
- **SLA & Escalation**: Tracks resolution deadlines and automatically escalates critical issues.

## Tech Stack
- **Backend:** Node.js, Express, Mongoose, OpenAI, Transformers (via fallback)
- **Frontend:** React.js, Axios, Modern CSS
- **Database:** MongoDB

## Getting Started

### 1. Backend Setup
1.  Go to the `backend` folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Configure environment variables in `.env`:
    - `MONGO_URI`: Your MongoDB connection string.
    - `OPENAI_API_KEY`: Your OpenAI API key of choice.
    - `PORT`: Server port (default 5000).
4.  Launch the server: `npm run dev`

> [!NOTE]
> If MongoDB is not running locally, the server will log a warning but keep running. Full functionality requires a valid database connection.

### 2. Frontend Setup
1.  Go to the `frontend` folder: `cd frontend`
2.  Install dependencies: `npm install`
3.  Launch the app: `npm start`
4.  Open `http://localhost:3000` in your browser.

## Troubleshooting 💡
- **AI modules not working?** I've implemented lightweight fallbacks to ensure the project runs without native module errors on all platforms.
- **Database issues?** Ensure MongoDB is installed and running, or provide a cloud connection string from MongoDB Atlas in `backend/.env`.

---
*Built with Sentra AI 🧠*
