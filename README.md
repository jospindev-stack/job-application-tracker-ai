# Job Application Tracker AI

> An AI-powered job application tracker built with **React**, **FastAPI**, **MongoDB**, and **Groq**, helping users organize job applications, analyze job offers, optimize resumes, and prepare for interviews.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Motor-47A248?logo=mongodb)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## About

Job Application Tracker AI is a full-stack web application designed to simplify the job search process while leveraging AI to provide personalized career assistance.

The application allows users to organize job applications, monitor their progress, analyze job descriptions, identify missing skills, receive resume improvement suggestions, and generate tailored interview preparation.

The project demonstrates modern AI-assisted full-stack development using React, FastAPI, MongoDB, and Groq.

---

## Technology Stack

| Category          | Technology           |
| ----------------- | -------------------- |
| Frontend          | React 18 + Vite      |
| Backend           | FastAPI              |
| Database          | MongoDB Atlas        |
| AI                | Groq (Llama 3.3 70B) |
| Styling           | Tailwind CSS         |
| Charts            | Recharts             |
| API Documentation | OpenAPI / Swagger    |

---

## Features

| Feature                   | Description                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Application Tracking**  | Track company, position, location, status, salary, recruiter contact, and personal notes                     |
| **Status Pipeline**       | Manage applications through Applied, Interview, Offer, Rejected, and Withdrawn stages                        |
| **AI CV Analysis**        | Evaluate resume compatibility, identify missing requirements, extract ATS keywords, and suggest improvements |
| **Interview Preparation** | Generate technical, behavioral, and situational interview questions with personalized recommendations        |
| **Analytics Dashboard**   | Monitor response rate, interview rate, offer rate, application timeline, and status distribution             |
| **Search & Filtering**    | Search applications by company or position and filter by status                                              |

---

## Project Structure

```text
job-application-tracker-ai/
│
├── .env.example
│
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── schemas/
│       │   └── application.py
│       ├── routers/
│       │   ├── applications.py
│       │   └── ai.py
│       └── services/
│           └── groq_service.py
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── hooks/
        │   └── useApplications.js
        └── components/
            ├── Dashboard.jsx
            ├── ApplicationList.jsx
            ├── ApplicationForm.jsx
            ├── ApplicationDetail.jsx
            ├── AIAnalysis.jsx
            └── StatusBadge.jsx
```

---

## Architecture

```text
React Application
        │
        ▼
FastAPI REST API
        │
        ├───────────────┐
        ▼               ▼
MongoDB Atlas      Groq API
```

---

## AI Workflow

```text
User saves a job application
        │
        ▼
FastAPI retrieves the job description
        │
        ▼
Prompt sent to Groq
        │
        ▼
AI analyzes the offer
        │
        ▼
Structured JSON response
        │
        ▼
Dashboard displays:
• Match score
• Resume improvements
• ATS keywords
• Interview questions
```

---

## Prerequisites

- Python 3.11 or later
- Node.js 18 or later
- MongoDB Atlas account (or local MongoDB)
- Groq API key

---

## Installation

Clone the repository:

```bash
git clone https://github.com/jospindev-stack/job-application-tracker-ai.git
cd job-application-tracker-ai
```

### Backend

```bash
cd backend

python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Configure the environment:

Linux / macOS

```bash
cp ../.env.example .env
```

Windows

```powershell
copy ..\.env.example .env
```

Update:

```env
MONGODB_URL=your_connection_string

GROQ_API_KEY=your_api_key

GROQ_MODEL=llama-3.3-70b-versatile

PORT=8000
```

### Frontend

```bash
cd ../frontend

npm install
```

---

## Running the Project

Backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

API Documentation:

```
http://localhost:8000/docs
```

---

## REST API

### Applications

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/applications`       | List applications    |
| POST   | `/api/applications`       | Create application   |
| GET    | `/api/applications/{id}`  | Retrieve application |
| PATCH  | `/api/applications/{id}`  | Update application   |
| DELETE | `/api/applications/{id}`  | Delete application   |
| GET    | `/api/applications/stats` | Dashboard statistics |

### AI

| Method | Endpoint                      | Description                                   |
| ------ | ----------------------------- | --------------------------------------------- |
| POST   | `/api/ai/analyze/{id}`        | Analyze a saved job description               |
| POST   | `/api/ai/interview-prep/{id}` | Generate interview preparation                |
| POST   | `/api/ai/analyze`             | Analyze an arbitrary job description          |
| POST   | `/api/ai/interview-prep`      | Generate interview preparation without saving |

---

## Example AI Response

```json
{
  "match_score": 78,
  "summary": "Strong technical fit.",
  "key_requirements": ["AWS", "Python", "Docker"],
  "cv_suggestions": [
    {
      "section": "Experience",
      "suggestion": "Quantify API project results.",
      "priority": "high"
    }
  ],
  "keywords_to_add": ["Terraform", "CI/CD", "Kubernetes"],
  "red_flags": ["French fluency is required but not mentioned."]
}
```

---

## Security

The application includes:

- Environment-based secret management
- Input validation using Pydantic
- Configurable CORS policy
- Server-side AI requests
- Structured API responses

---

## Environment Variables

| Variable       | Description               |
| -------------- | ------------------------- |
| `MONGODB_URL`  | MongoDB connection string |
| `GROQ_API_KEY` | Groq API key              |
| `GROQ_MODEL`   | Groq model                |
| `PORT`         | Backend server port       |

---

## Deployment

### Backend

Suitable for:

- Railway
- Render

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend

Suitable for:

- Vercel
- Netlify

```bash
cd frontend

npm run build
```

Output:

```text
frontend/dist
```

Configure `VITE_API_URL` to point to the deployed backend.

---

## Roadmap

Planned improvements include:

- OAuth authentication
- Resume upload (PDF)
- AI-powered CV rewriting
- Cover letter generation
- Email reminders
- Calendar integration
- Docker support
- Unit tests
- Integration tests

---

## License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute it under the terms of the license.

---

## Author

**Jospin Meka**

Software Developer

- GitHub: https://github.com/jospindev-stack
