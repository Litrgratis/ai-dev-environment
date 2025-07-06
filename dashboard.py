from flask import Flask, render_template_string, send_from_directory, abort, request, redirect, url_for
import os
import subprocess

app = Flask(__name__)

LLM_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'llm-output')

@app.route('/')
def index():
    # List all files in llm-output and subfolders
    file_list = []
    for root, dirs, files in os.walk(LLM_OUTPUT_DIR):
        for file in files:
            rel_dir = os.path.relpath(root, LLM_OUTPUT_DIR)
            rel_file = os.path.join(rel_dir, file) if rel_dir != '.' else file
            file_list.append(rel_file)
    return render_template_string('''
    <html>
    <head>
        <title>LLM Output Dashboard</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    </head>
    <body class="container mt-4">
        <h1>LLM Output Dashboard</h1>
        <form method="post" action="/run-analysis" class="mb-3">
            <input type="text" name="code" class="form-control mb-2" placeholder="Wklej kod do analizy">
            <button type="submit" class="btn btn-primary">Analizuj kod</button>
        </form>
        <ul class="list-group">
        {% for file in files %}
            <li class="list-group-item">
                <a href="/view/{{ file }}">{{ file }}</a>
            </li>
        {% else %}
            <li class="list-group-item">No files found in llm-output/</li>
        {% endfor %}
        </ul>
    </body>
    </html>
    ''', files=file_list)

@app.route('/view/<path:filename>')
def view_file(filename):
    abs_path = os.path.join(LLM_OUTPUT_DIR, filename)
    if not os.path.isfile(abs_path):
        abort(404)
    with open(abs_path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    return render_template_string('''
    <html>
    <head>
        <title>View: {{ filename }}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    </head>
    <body class="container mt-4">
        <h2>{{ filename }}</h2>
        <pre style="background:#f8f9fa; padding:1em; border-radius:5px;">{{ content }}</pre>
        <a href="/" class="btn btn-secondary mt-3">Back</a>
    </body>
    </html>
    ''', filename=filename, content=content)

@app.route('/run-analysis', methods=['POST'])
def run_analysis():
    code = request.form.get('code', '')
    if not code.strip():
        return redirect(url_for('index'))
    # Prosty przykład: uruchom flake8 na kodzie
    try:
        with open('/tmp/_dashboard_code.py', 'w') as f:
            f.write(code)
        result = subprocess.run(['flake8', '/tmp/_dashboard_code.py'], capture_output=True, text=True)
        output = result.stdout.strip() or 'Brak błędów flake8.'
    except Exception as e:
        output = f'Błąd analizy: {e}'
    return render_template_string('''
    <html>
    <head>
        <title>Wynik analizy</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    </head>
    <body class="container mt-4">
        <h2>Wynik analizy kodu</h2>
        <pre style="background:#f8f9fa; padding:1em; border-radius:5px;">{{ output }}</pre>
        <a href="/" class="btn btn-secondary mt-3">Powrót</a>
    </body>
    </html>
    ''', output=output)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
