from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
UTILS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/src/utils'))
if UTILS_PATH not in sys.path:
    sys.path.append(UTILS_PATH)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/src/services')))
from secure_code_generation import generate_code

app = Flask(__name__)
# Konfiguracja restrykcyjnych policy CORS (dev + prod)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://your-frontend-domain.com"]}}, supports_credentials=True)

@app.route('/api/predict', methods=['POST'])
def predict():
    # Pobierz dane wejściowe
    data = request.get_json(force=True)
    user_input = data.get("prompt", "")
    try:
        result = generate_code(user_input)
        return jsonify({"result": result}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Sandbox error: {str(e)}"}), 503

if __name__ == "__main__":
    app.run()
