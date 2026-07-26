import json
from groq import AsyncGroq
from ..config import settings
from ..schemas.application import (
    AIAnalysisResult, CVSuggestion, InterviewPrepResult
)

client = AsyncGroq(api_key=settings.groq_api_key)


async def analyze_job_offer(position: str, company: str, job_description: str) -> AIAnalysisResult:
    prompt = f"""You are an expert career coach and ATS specialist. Analyze this job offer and provide actionable CV optimization advice.

POSITION: {position}
COMPANY: {company}
JOB DESCRIPTION:
{job_description}

Respond with a JSON object following this exact schema:
{{
  "match_score": <integer 0-100, overall fit score for a typical candidate>,
  "summary": "<2-3 sentence summary of what the role requires>",
  "key_requirements": ["<requirement 1>", "<requirement 2>", ...],
  "cv_suggestions": [
    {{"section": "<CV section name>", "suggestion": "<specific actionable advice>", "priority": "<high|medium|low>"}},
    ...
  ],
  "keywords_to_add": ["<keyword1>", "<keyword2>", ...],
  "red_flags": ["<potential concern 1>", ...]
}}

Rules:
- key_requirements: list exactly 5-7 requirements
- cv_suggestions: list 4-6 specific, actionable suggestions targeting real CV sections (Summary, Experience, Skills, etc.)
- keywords_to_add: list 6-10 ATS keywords from the job description
- red_flags: list 0-3 things to watch for (empty array if none)
- All text must be in the same language as the job description"""

    resp = await client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    data = json.loads(resp.choices[0].message.content)
    data["cv_suggestions"] = [CVSuggestion(**s) for s in data.get("cv_suggestions", [])]
    return AIAnalysisResult(**data)


async def generate_interview_prep(position: str, company: str, job_description: str | None) -> InterviewPrepResult:
    jd_section = f"\nJOB DESCRIPTION:\n{job_description}" if job_description else ""

    prompt = f"""You are a senior interview coach. Generate a comprehensive interview preparation guide.

POSITION: {position}
COMPANY: {company}{jd_section}

Respond with a JSON object following this exact schema:
{{
  "likely_questions": [
    {{"question": "<interview question>", "type": "<behavioral|technical|situational|company>", "tip": "<short answering tip>"}},
    ...
  ],
  "company_research_tips": ["<research point 1>", ...],
  "skills_to_highlight": ["<skill 1>", ...],
  "preparation_checklist": ["<checklist item 1>", ...]
}}

Rules:
- likely_questions: provide exactly 8 questions covering behavioral, technical, situational, and company types
- company_research_tips: 4-5 specific things to research about the company before the interview
- skills_to_highlight: 5-7 skills/experiences to emphasize during the interview
- preparation_checklist: 6-8 concrete preparation tasks (e.g., "Prepare 3 STAR examples for teamwork")
- All text must be in the same language as the job description (or French if no description)"""

    resp = await client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.5,
    )

    data = json.loads(resp.choices[0].message.content)
    return InterviewPrepResult(**data)
