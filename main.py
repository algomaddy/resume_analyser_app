import io
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from pypdf import PdfReader
from google import genai
from google.genai import types

app = FastAPI()

class CandidateEvaluation(BaseModel):
    skills: list[str] = Field(description="List of technical and soft skills")
    years_of_experience: int = Field(description="Total years of experience")
    match_score: int = Field(ge=1, le=100, description="Match score from 1 to 100 indicating how well the candidate fits the job description")
    missing_requirements: list[str] = Field(description="List of critical demands from the JD that are not on the resume")

import os
# Initialize google-genai client dynamically per request now
# client = genai.Client(...) is removed from global scope

@app.post("/analyze-resume")
async def analyze_resume(
    api_key: str = Form(...),
    job_description: str = Form(...),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Read PDF content from memory
    try:
        contents = await file.read()
        pdf_reader = PdfReader(io.BytesIO(contents))
        resume_text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                resume_text += page_text + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

    prompt = f"Evaluate this candidate's resume against the specific corporate demands listed in the job description.\n\nJob Description:\n{job_description}\n\nCandidate Resume:\n{resume_text}"

    try:
        # Instantiate client with user-provided key
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CandidateEvaluation,
                temperature=0.1,
                system_instruction="You are a strict, data-driven technical recruiter."
            ),
        )
        # Parse the JSON string from the model and return it directly
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating candidate: {str(e)}")

# Mount static files to serve the frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")
