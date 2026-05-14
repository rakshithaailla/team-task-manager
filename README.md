TEAM TASK MANAGER – FULL STACK APPLICATION

Project Overview:
Team Task Manager is a full-stack web application developed to manage projects, assign tasks, track progress, and monitor team productivity with role-based access control.

Features:
1. User Authentication (Signup/Login)
2. Role-Based Access Control (Admin / Member)
3. Create and Delete Projects (Admin Only)
4. Create, Assign, Update, and Delete Tasks
5. Task Status Tracking
6. Priority-Based Task Management
7. Dashboard Analytics
8. Pie Chart Visualization
9. Dark Mode Toggle
10. Task Search and Filters
11. Due Date Monitoring
12. File Upload Support
13. Toast Notifications
14. Responsive UI Design

Technology Stack:

Frontend:
- React.js
- Tailwind CSS
- Axios
- Recharts
- React Toastify

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer

Database:
- MongoDB Atlas

Project Structure:

team-task-manager/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── components/
│
└── README.txt

Main Functionalities:
- Admin can create/delete projects
- Admin can create/delete tasks
- Members can update task status
- Dashboard shows analytics and charts
- Tasks support file attachments
- Search and filtering available
- Overdue tasks highlighted automatically

API Endpoints:

Authentication:
POST /api/auth/signup
POST /api/auth/login

Projects:
GET /api/projects
POST /api/projects
DELETE /api/projects/:id

Tasks:
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Installation Steps:

1. Clone Repository:
git clone https://github.com/rakshithaailla/team-task-manager.git

2. Backend Setup:
cd backend
npm install
npm run dev

3. Frontend Setup:
cd frontend
npm install
npm run dev

Environment Variables (.env):

Backend:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Deployment:
Frontend and backend deployed using Railway.

GitHub Repository:
https://github.com/rakshithaailla/team-task-manager

Developed By:
Rakshitha Ailla
