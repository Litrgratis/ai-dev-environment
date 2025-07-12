from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# Konfiguracja restrykcyjnych policy CORS (dev + prod)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://your-frontend-domain.com"]}}, supports_credentials=True)

@app.route('/api/predict', methods=['POST'])
def predict():
    # ... kod predykcji ...
    return {"result": "ok"}, 200

if __name__ == "__main__":
    app.run()
