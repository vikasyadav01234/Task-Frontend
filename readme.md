# 🚀 TaskFlow – Manage Your Projects & Tasks

TaskFlow is a full-stack task tracker application that helps users organize, monitor, and complete their tasks across multiple projects. Built using the **MERN stack**, it includes authentication, project/task CRUD, status tracking, and a real-time dashboard.

![TaskFlow Banner](https://via.placeholder.com/1000x300?text=TaskFlow+-+Track+Your+Projects+Easily)

---

## 🔗 Live Demo

- 🖥️ Frontend: [https://task-frontend-one-lilac.vercel.app/](https://task-frontend-one-lilac.vercel.app/)
- 🔙 Backend API: [https://backend-task-vkn7.onrender.com/](https://backend-task-vkn7.onrender.com/)


---

## 📦 Tech Stack

### Frontend:
- React.js (Vite)
- Axios for HTTP requests
- Context API for auth state
- Tailwind CSS / CSS Modules (optional)

### Backend:
- Node.js + Express.js
- MongoDB (via Mongoose)
- JWT for Authentication
- dotenv for config
- CORS + cookie-parser middleware

---

## 🔐 Features

- ✅ User Signup/Login (JWT-based auth)
- ✅ Protected Routes (Projects & Dashboard)
- ✅ Create, Read, Update, Delete Tasks
- ✅ Create Projects (Max 4 per user)
- ✅ Task Status: `Pending`, `In Progress`, `Completed`
- ✅ Dashboard: Project stats + task summary
- ✅ MongoDB-based real-time data
- ✅ Full API tested with Postman
- ✅ Deployment on Render + Vercel

---

## 🔧 Local Setup (Dev Mode)

### 1. Clone this repo

```bash
git clone https://github.com/vikasyadav01234/Task-Frontend
cd Task-Frontend
npm install
```


### 2. Setup Backend
```bash
git clone https://github.com/vikasyadav01234/backend-Task
cd backend-Task
npm install
```


**.env**
```
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend Task
npm install
npm run dev
```

---

## 📬 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | Get all user's projects |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks` | Get all user's tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Dashboard
| GET | `/api/dashboard` | Get task/project stats (protected) |

---

## 💻 Screenshots

> Add some screenshots or demo GIFs of login, dashboard, and task creation for bonus impression.

---

## 🤝 Credits

Built with ❤️ by [Vikas Yadav](https://github.com/vikasyadav01234) as part of a developer trainee assignment.

---

## 📄 License

This project is licensed under the MIT License — free to use, clone, and build upon.
