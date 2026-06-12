from typing import Any, Dict, List, Optional
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title='AI Mock Interview AI Service')

class NLPRequest(BaseModel):
    transcript: str

class EmotionRequest(BaseModel):
    frameData: str

class ResumeRequest(BaseModel):
    resumeUrl: str

class LLMRequest(BaseModel):
    prompt: str

class LLMResponse(BaseModel):
    feedbackText: str
    idealAnswer: str

@app.get('/')
def health_check() -> Dict[str, Any]:
    return {'status': 'ok', 'service': 'ai-service'}

@app.post('/nlp')
def nlp_analysis(payload: NLPRequest) -> Dict[str, Any]:
    transcript = payload.transcript.strip()
    if not transcript:
        raise HTTPException(status_code=400, detail='Transcript is required')

    sentiment_score = 70
    filler_word_count = transcript.lower().count('um') + transcript.lower().count('uh')
    keywords_matched = [word for word in ['leadership', 'architecture', 'communication'] if word in transcript.lower()]

    return {
        'sentimentScore': sentiment_score,
        'fillerWordCount': filler_word_count,
        'keywordsMatched': keywords_matched,
    }

@app.post('/emotion')
def emotion_analysis(payload: EmotionRequest) -> Dict[str, Any]:
    if not payload.frameData:
        raise HTTPException(status_code=400, detail='Frame data is required')

    return {'confidenceScore': 78}

@app.post('/resume')
def parse_resume(payload: ResumeRequest) -> Dict[str, Any]:
    if not payload.resumeUrl:
        raise HTTPException(status_code=400, detail='Resume URL is required')

    questions = [
        'Tell me about a challenging project you delivered end to end.',
        'How do you stay current with emerging AI and machine learning technologies?',
        'Describe a time you resolved a conflict on a cross-functional team.',
    ]

    return {'questions': questions}

@app.post('/llm')
def llm_inference(payload: LLMRequest) -> LLMResponse:
    if not payload.prompt:
        raise HTTPException(status_code=400, detail='Prompt is required')

    return LLMResponse(
        feedbackText='The response is helpful but can benefit from a clearer structure, stronger examples, and tighter storytelling.',
        idealAnswer='A strong answer emphasizes measurable results, a clear problem statement, the actions you took, and the positive outcome achieved.',
    )
