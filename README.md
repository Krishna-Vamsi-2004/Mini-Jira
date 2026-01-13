````md
# Mini-Jira ✅

Mini-Jira is a full-stack Jira clone with user authentication and task management.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT

## Setup

### 1) Clone
```bash
git clone https://github.com/Krishna-Vamsi-2004/Mini-Jira.git
cd Mini-Jira
````

### 2) Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```

Run backend:

```bash
npm start
```

### 3) Frontend

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

## Notes

✅ `.env` and `node_modules` are ignored using `.gitignore`.

```
```
