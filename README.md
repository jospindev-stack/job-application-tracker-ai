# Job Application Tracker AI

> An AI-powered job application tracker built with **React**, **FastAPI**, **MongoDB**, and **Groq**, helping users organize job applications, analyze job offers, optimize resumes, and prepare for interviews.

![CI](https://github.com/jospindev-stack/job-application-tracker-ai/actions/workflows/ci.yml/badge.svg)
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

The project combines a React frontend with a FastAPI backend, MongoDB persistence, Groq-powered AI features, automated backend tests, and continuous integration with GitHub Actions.

---

## Technology Stack

| Category | Technology |
| --- | --- |
| Frontend | React 18 + Vite |
| Backend | FastAPI |
| Database | MongoDB Atlas / Motor |
| AI | Groq (Llama 3.3 70B) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Validation | Pydantic |
| Testing | pytest, pytest-asyncio, pytest-cov |
| CI | GitHub Actions |
| API Documentation | OpenAPI / Swagger |

---

## Features

| Feature | Description |
| --- | --- |
| Application Tracking | Track company, position, location, status, salary, recruiter contact, and personal notes |
| Status Pipeline | Manage applications through Applied, Interview, Offer, Rejected, and Withdrawn stages |
| AI CV Analysis | Evaluate job compatibility, identify requirements, extract ATS keywords, and suggest improvements |
| Interview Preparation | Generate technical, behavioral, situational, and company-focused interview preparation |
| Analytics Dashboard | Monitor response rate, interview rate, offer rate, application timeline, and status distribution |
| Search & Filtering | Search applications by company or position and filter by status |
| Automated Backend Tests | Validate API behavior, statistics, error handling, and AI routes without external API calls |
| Continuous Integration | Run backend tests automatically on pushes and pull requests |

---

## Project Structure

```text
job-application-tracker-ai/
|
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|
|-- backend/
|   |-- requirements.txt
|   |-- requirements-dev.txt
|   |-- app/
|   |   |-- main.py
|   |   |-- config.py
|   |   |-- database.py
|   |   |-- schemas/
|   |   |   `-- application.py
|   |   |-- routers/
|   |   |   |-- applications.py
|   |   |   `-- ai.py
|   |   `-- services/
|   |       `-- groq_service.py
|   `-- tests/
|       |-- conftest.py
|       |-- test_applications.py
|       `-- test_ai.py
|
`-- frontend/
    |-- package.json
    |-- vite.config.js
    `-- src/
        |-- App.jsx
        |-- hooks/
        |   `-- useApplications.js
        `-- components/
            |-- Dashboard.jsx
            |-- ApplicationList.jsx
            |-- ApplicationForm.jsx
            |-- ApplicationDetail.jsx
            |-- AIAnalysis.jsx
            `-- StatusBadge.jsx
```

---

## Architecture

```text
React Application
        |
        v
FastAPI REST API
        |
        +---------------+
        |               |
        v               v
MongoDB Atlas      Groq API
```

---

## AI Workflow

```text
Job application or job description
        |
        v
FastAPI request validation
        |
        v
Prompt sent to Groq
        |
        v
Structured AI response
        |
        v
Frontend displays:
- Match score
- CV improvement suggestions
- ATS keywords
- Interview preparation
```

---

## Prerequisites

- Python 3.11 or later
- Node.js 18 or later
- MongoDB Atlas account or local MongoDB instance
- Groq API key

---

## Installation

```bash
git clone https://github.com/jospindev-stack/job-application-tracker-ai.git
cd job-application-tracker-ai
```

### Backend

```bash
cd backend
python -m venv venv
```

Linux / macOS:

```bash
source venv/bin/activate
```

Windows:

```powershell
venv\Scripts\activate
```

Install runtime dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment:

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
cd backend
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

API documentation:

```text
http://localhost:8000/docs
```

---

## REST API

### Applications

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/{id}` | Retrieve application |
| PATCH | `/api/applications/{id}` | Update application |
| DELETE | `/api/applications/{id}` | Delete application |
| GET | `/api/applications/stats` | Dashboard statistics |

### AI

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/ai/analyze/{id}` | Analyze a saved job description |
| POST | `/api/ai/interview-prep/{id}` | Generate preparation for a saved application |
| POST | `/api/ai/analyze` | Analyze an arbitrary job description |
| POST | `/api/ai/interview-prep` | Generate interview preparation without saving |

---

## Testing

Backend tests run without requiring a live MongoDB instance or real Groq API calls. Database behavior is isolated with lightweight asynchronous fakes and AI services are mocked at the router boundary.

Install development dependencies:

```bash
cd backend
pip install -r requirements-dev.txt
```

Run the test suite:

```bash
pytest -q
```

Run with coverage:

```bash
pytest -q --cov=app --cov-report=term-missing
```

The current suite covers:

- application creation, retrieval, update, and deletion
- invalid application IDs and missing resources
- dashboard status counts and monthly timeline
- response, interview, and offer rate calculations
- AI job analysis endpoints with mocked Groq services
- interview preparation endpoints
- provider failure handling and HTTP error responses

---

## Continuous Integration

GitHub Actions runs the backend test suite automatically for pushes to `main`, test branches, and pull requests targeting `main`.

The CI workflow uses Python 3.12 and executes:

```text
checkout -> install backend test dependencies -> run pytest with coverage
```

External MongoDB and Groq services are not required by the test job.

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
  "red_flags": []
}
```

---

## Security

The application includes:

- environment-based secret management
- input validation using Pydantic
- configurable CORS policy
- server-side AI requests
- structured API responses

---

## Environment Variables

| Variable | Description |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | Groq model |
| `PORT` | Backend server port |

---

## Deployment

### Backend

Suitable for Railway, Render, or another Python hosting platform.

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend

Suitable for Vercel or Netlify.

```bash
cd frontend
npm run build
```

Build output:

```text
frontend/dist
```

Configure `VITE_API_URL` to point to the deployed backend.

---

## Roadmap

Planned improvements include:

- OAuth authentication
- resume upload and PDF parsing
- AI-powered CV rewriting
- cover letter generation
- email reminders
- calendar integration
- Docker support
- frontend component tests
- end-to-end tests

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Jospin Meka**

Software Developer

- GitHub: https://github.com/jospindev-stack
