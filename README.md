# Blogi

## 📌 Description
Blogi is a full-stack blogging platform that allows users to create, read, and interact with blog posts. It is built with **Next.js** for the frontend and **FastAPI** for the backend, using **PostgreSQL** as the database. The project is containerized with Docker for seamless deployment.

## 🚀 Features
- User authentication using NextAuth
- Create, update, and delete blog posts
- Secure API with JWT-based authentication
- Dockerized setup for easy deployment

## 🛠 Tech Stack
- **Frontend:** Next.js (React, TypeScript, TailwindCSS)
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **Containerization:** Docker & Docker Compose

## 📥 Cloning the Repository
To get started, clone the repository:

```bash
git clone https://github.com/sanjeevreddy12/Blogi.git
cd Blogi
```

## ⚙️ Running with Docker
Ensure you have **Docker**  installed.

### 1️⃣ **Build & Start Containers**
```bash
docker-compose up --build -d
```

### 2️⃣ **Check Running Containers**
```bash
docker ps
```

### 3️⃣ **Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API Docs:** http://localhost:8000/docs

### 4️⃣ **Stop Containers**
```bash
docker-compose down
```

## 🛠 Manual Setup (Without Docker)
### **Backend (FastAPI) Setup**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate.bat
pip install -r requirements.txt
python main.py
```

### **Frontend (Next.js) Setup**
```bash
cd frontend
npm install
npm run dev
```


Happy Coding! 🚀

