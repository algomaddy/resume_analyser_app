# AI Resume Analyzer

A sleek, lightweight FastAPI web application that evaluates candidate resumes against corporate job descriptions. Powered by Google's **Gemini 2.5 Flash** model, it performs data-driven analysis to identify core technical and soft skills, calculate a tailored match score, and highlight any critical demands missing from the resume.

## Features

- **Automated Resume Parsing**: Upload resumes in PDF format, and the app will extract the text for analysis.
- **Dynamic API Key Input**: Securely provide your own Google Gemini API key via the web interface.
- **Smart Evaluation**: Compares the candidate's skills and experience directly against specific job demands.
- **Actionable Feedback**: Generates an overarching match score, highlights identified skills, and provides a clear list of missing requirements.
- **Modern UI**: A fully responsive, premium user interface with a glassmorphism design and interactive score visualizations.

## Tech Stack

- **Backend**: Python, FastAPI, Pydantic (for structured AI output validation), `pypdf` (for PDF text extraction).
- **AI/ML**: Google GenAI SDK (`gemini-2.5-flash`).
- **Frontend**: Vanilla HTML5, CSS3 (with custom variables and animations), and JavaScript.

## Getting Started

### Prerequisites

- Python 3.9+
- A valid Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/algomaddy/resume_analyser_app.git
   cd resume_analyser_app
   ```

2. Create a virtual environment and install the required dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

4. Open your browser and navigate to `http://localhost:8000` to start analyzing resumes!

## Usage

1. Enter your **Gemini API Key** in the provided input field.
2. Paste the exact **Job Description** (corporate demands, requirements) into the text area.
3. Upload the candidate's **Resume** (must be a PDF).
4. Click **Analyze Candidate** and view the detailed evaluation results.

## Docker Support

You can also run this application using Docker Compose:

```bash
docker-compose up --build
```
The app will be accessible at `http://localhost:8000`.
