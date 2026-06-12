import pytest
from fastapi.testclient import TestClient

from ai_service import app

client = TestClient(app)

@pytest.mark.parametrize('endpoint, payload, expected_key', [
    ('/nlp', {'transcript': 'I led a product launch and improved retention.'}, 'sentimentScore'),
    ('/emotion', {'frameData': 'base64encodedstring'}, 'confidenceScore'),
    ('/resume', {'resumeUrl': 'https://example.com/resume.pdf'}, 'questions'),
])
def test_ai_service_endpoints(endpoint, payload, expected_key):
    response = client.post(endpoint, json=payload)
    assert response.status_code == 200
    assert expected_key in response.json()
