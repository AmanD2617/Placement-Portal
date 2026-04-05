# GradPlacifyr - Local Setup Guide

Quick guide to get the project running on your machine.

## Prerequisites

- Node.js v18+ (v22 recommended)
- PostgreSQL installed and running
- Git

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd GradPlacifyr-main
```

## 2. Backend Setup

```bash
cd placement-portal-backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

- `DB_PASSWORD` — your local PostgreSQL password
- `DATABASE_URL` — update the password in the connection string (URL-encode special characters, e.g. `@` becomes `%40`)
- `SMTP_USER` / `SMTP_PASSWORD` — Gmail address + App Password (see below)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — get from team lead or Google Cloud Console

### Create the Database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE placement_portal;
```

### Sync Schema to Database

```bash
npx prisma db push
npx prisma generate
```

### Start the Backend

```bash
npm run dev
```

Server runs on http://localhost:3000

## 3. Frontend Setup

```bash
cd placement-portal-frontend
npm install
```

Create a `.env` file:

```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

(Get the Client ID from your team lead)

### Start the Frontend

```bash
npm run dev
```

App runs on http://localhost:5173

## 4. Gmail App Password (for OTP emails)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to https://myaccount.google.com/apppasswords
4. Create an app password named "Placement Portal"
5. Copy the 16-character password into your `.env` as `SMTP_PASSWORD`

## Common Issues

### "Named export 'PrismaClient' not found"
Run `npx prisma generate` in the backend folder.

### "Invalid data provided to database query"
Run `npx prisma db push` to sync the schema to your database.

### "Email service is not configured"
Add SMTP variables to your backend `.env` (see step 4 above).

### "Google Sign-In is not configured"
Add `VITE_GOOGLE_CLIENT_ID` to your frontend `.env` file and restart the dev server.
