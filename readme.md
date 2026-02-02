# MERN Mini Task Manager

A full-stack task management application built using the MERN stack.  
This project supports task creation, status updates, deletion, filtering, analytics, and secure API access with rate limiting.

Live Frontend: (Add your Netlify URL here)  
Live Backend: (Add your Render URL here)

---

## 🚀 Features

- Create, update, and delete tasks
- Task workflow: todo → in_progress → done
- Validation and error handling
- Filtering and sorting
- Metrics and analytics
- Rate-limited APIs
- Loading animations
- Responsive UI
- MongoDB persistent storage

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- express-rate-limit
- CORS
- dotenv

### Deployment
- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

task-manager/
├── backend/
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
└── frontend/
├── src/
└── vite.config.js


---

## ⚙️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/mern-task-manager.git
cd mern-task-manager

cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection_string

Run backend:
npm run dev

Backend will run on:
http://localhost:5000

---------------------------------------------------------------------------------

Frontend Setup
cd frontend
npm install
npm run dev

Frontend will run on:
http://localhost:5173

Production Build (Frontend)
npm run build

------------------------------------------------------------------------------

Example Requests
POST /api/tasks
{
  "title": "Learn MERN"
}

PATCH /api/tasks/:id/status
{
  "status": "in_progress"
}

DELETE /api/tasks/:id

GET /api/tasks/metrics/stats


