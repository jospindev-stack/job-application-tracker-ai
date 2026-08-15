# Job Application Tracker AI

> An AI-powered job application tracker built with **React**, **FastAPI**, **MongoDB**, and **Groq**, helping users organize job applications, analyze job offers, optimize resumes, and prepare for interviews.

![CI](https://github.com/jospindev-stack/job-application-tracker-ai/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## About

Job Application Tracker AI is a full-stack web application designed to simplify the job search process while leveraging AI to provide personalized career assistance.

The application allows users to organize job applications, monitor their progress, analyze job descriptions, identify missing skills, receive resume improvement suggestions, and generate tailored interview preparation.

The project combines a React frontend, FastAPI backend, MongoDB persistence, Groq-powered AI features, automated backend tests, Docker-based local orchestration, and continuous integration with GitHub Actions.

---

## Technology Stack

| Category | Technology |
| --- | --- |
| Frontend | React 18 + Vite |
| Backend | FastAPI |
| Database | MongoDB 7 / Motor |
| AI | Groq (Llama 3.3 70B) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Validation | Pydantic |
| Containerization | Docker + Docker Compose |
| Web Server / Proxy | Nginx |
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
| Dockerized Stack | Run frontend, backend, and MongoDB with one Compose command |
| Continuous Integration | Run backend tests and validate Docker builds on GitHub Actions |

---

## Project Structure

```text
job-application-tracker-ai/
|
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- .dockerignore
|-- .env.example
|-- docker-compose.yml
|
|-- backend/
|   |-- Dockerfile
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
    |-- Dockerfile
    |-- nginx.conf
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
Browser
  |
  v
Nginx / React frontend :8080
  |
  | /api
  v
FastAPI backend :8000
  |
  +--------------------+
  |                    |
  v                    v
MongoDB 7          Groq API
```

The frontend uses relative `/api` requests. In the Docker stack, Nginx serves the React build and proxies `/api` traffic to the FastAPI container.

---

## Quick Start with Docker

### Prerequisites

- Docker Desktop or Docker Engine with Docker Compose
- Groq API key

Clone the repository:

```bash
git clone https://github.com/jospindev-stack/job-application-tracker-ai.git
cd job-application-tracker-ai
```

Create the environment file:

Linux / macOS:

```bash
cp .env.example .env
```

Windows:

```powershell
copy .env.example .env
```

Set your Groq API key in `.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Build and start the complete stack:

```bash
docker compose up --build
```

Application:

```text
http://localhost:8080
```

The Compose stack starts:

- `frontend`: React production build served by Nginx on port `8080`
- `backend`: FastAPI service on the internal Docker network on port `8000`
- `mongo`: MongoDB 7 with a persistent `mongo-data` volume

Stop the stack:

```bash
docker compose down
```

Remove containers and the local MongoDB volume:

```bash
docker compose down -v
```

---

## Local Development without Docker

### Prerequisites

- Python 3.11 or later
- Node.js 18 or later
- MongoDB Atlas account or local MongoDB instance
- Groq API key

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

Run the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

API documentation:

```text
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
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

GitHub Actions runs automatically for pushes to `main`, `test/**` and `chore/**` branches, as well as pull requests targeting `main`.

The workflow contains two validation jobs:

```text
backend-tests
  -> install Python dependencies
  -> run pytest with coverage

docker-build
  -> validate docker compose configuration
  -> build backend image
  -> build frontend image
```

The backend test job does not require live MongoDB or Groq services, while the Docker job verifies that the container configuration and application images build successfully before merge.

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
- container environment variables for runtime configuration

---

## Environment Variables

| Variable | Description |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string; provided automatically by Compose for the backend container |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | Groq model |
| `PORT` | Backend server port |

---

## Deployment

The application is container-ready. The backend image runs FastAPI with Uvicorn, and the frontend image uses a multi-stage Node build followed by Nginx for static serving and reverse proxying.

For local or compatible container hosting environments:

```bash
docker compose up --build
```

The frontend can also be deployed independently to Vercel or Netlify, and the backend to a Python or container hosting platform.

---

## Roadmap

Planned improvements include:

- OAuth authentication
- resume upload and PDF parsing
- AI-powered CV rewriting
- cover letter generation
- email reminders
- calendar integration
- frontend component tests
- end-to-end tests
- deployment automation

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Jospin Meka**

Software Developer

- GitHub: https://github.com/jospindev-stack
