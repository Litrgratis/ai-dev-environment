import pytest
from flask import Flask
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ai_experiment')))
from api import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_predict_valid(client):
    response = client.post('/api/predict', json={"prompt": "print('Hello')"})
    assert response.status_code == 200
    assert "result" in response.get_json()

def test_predict_disallowed(client):
    response = client.post('/api/predict', json={"prompt": "os.system('rm -rf /')"})
    assert response.status_code == 400
    assert "error" in response.get_json()

def test_predict_too_long(client):
    long_input = "a" * 3000
    response = client.post('/api/predict', json={"prompt": long_input})
    assert response.status_code == 400
    assert "error" in response.get_json()
