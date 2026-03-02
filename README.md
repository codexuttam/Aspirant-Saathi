# Aspirant-Saathi 🚀

Aspirant-Saathi is a web application designed to help competitive exam aspirants (UPSC, State PSC, CAPF, etc.) improve their answer-writing skills through instant, AI-driven, and examiner-style evaluations.

## 📁 Project Structure

This repository is organized as a monorepo containing two main parts:

- **`client/`** — React frontend application (Create React App + React Router)
- **`server/`** — Node.js & Express backend (MongoDB + Google Gemini AI integration)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Routing:** React Router DOM
- **Styling:** Vanilla CSS with custom modern glassmorphism and modern UI
- **Auth:** Google OAuth (\`@react-oauth/google\`), JWT

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose)
- **AI Integration:** Google Generative AI (Gemini 2.5 Flash)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Email Service:** Nodemailer (SMTP based OTPs & Notifications)
- **Image Upload:** Multer

---

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas Cloud URI)
- A Google Cloud Platform (GCP) account for OAuth Client ID
- Google Gemini API Key
- (Optional) App password for a Gmail account to send out emails (Nodemailer)

---

## 🚀 Quick Start (Development Setup)

### 1. Install Dependencies
Run the following commands from the **root** of the project to install all required dependencies for both the frontend and the backend.

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Variables Integration

Create a **`.env`** file inside both the `client` and `server` folders with the respective variables:

**`server/.env`**:
```env
# Database and Server
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname

# AI and Auth
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=models/gemini-2.5-flash
JWT_SECRET=super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Email (Nodemailer using Gmail App Passwords)
EMAIL_USER=your_support_email@gmail.com
EMAIL_PASS=your_app_password
```

**`client/.env`**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Run the Development Servers

You will need to run the client and the server simultaneously in two separate terminals.

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
*The server will start on port 5000 (usually `http://localhost:5000`).*

**Terminal 2 (Frontend React App):**
```bash
cd client
npm start
```
*The frontend will start on port 3000 (usually `http://localhost:3000`).*

---

## 📦 Build for Production

To create an optimized production build of the frontend, run:

```bash
cd client
npm run build
```
This will compile the React app into static files in the `client/build` folder, which can be deployed to Vercel, Netlify, or served via Express.

---

## 📝 Key Features

- **AI Answer Evaluation:** Evaluate typed or handwritten images against exam-specific rubrics.
- **Model Answers:** Automatically generate perfect "Topper" answers for benchmarkings.
- **Progress Tracking:** Interactive dashboards showing total submissions, streaks, and focus areas.
- **Secure Authentication:** OTP email verification and one-click Google Sign-in.
- **Professional Analytics:** Modern stats cards tracking the user's daily progression.

---

## 🤝 Need Help?
Contact Support: [aspirantsaathisuppport@gmail.com](mailto:aspirantsaathisuppport@gmail.com)
