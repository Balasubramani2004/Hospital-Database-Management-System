# HDBMS (Hospital Database Management System)

Simple hospital management web app with separate backend (Express + MySQL) and frontend (React).

**Features**
- User authentication and role-based routes (admin, doctor, patient)
- Patient registration and full history views
- File uploads for patient images stored in `backend/uploads/`

**Repository layout**
- [backend/server.js](backend/server.js): Express server entry
- [backend/db.js](backend/db.js): MySQL connection (reads from environment)
- [backend](backend): Backend source and uploads
- [frontend](frontend): React frontend app

**Environment**
Create a `.env` file in the `backend` folder (an example already exists at `backend/.env`) with these values:

```
PORT=5000
DB_HOST=localhost
DB_USER=hdbms_user
DB_PASSWORD=hdbms123
DB_NAME=hospital_db
```

**Backend setup & run**

```bash
cd backend
npm install
# start server (reads .env)
node server.js
```

The backend listens on `process.env.PORT` (default 5000).

**Frontend setup & run**

```bash
cd frontend
npm install
npm start
```

**Git / Deployment notes**
- `backend/uploads/` is ignored by `.gitignore` to avoid committing user uploads.
- Commit changes and push to your GitHub remote (example):

```bash
git add .
git commit -m "Add README and project setup"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

**Contributing**
Open issues or send PRs. Keep environment secrets out of version control.

**License**
MIT
