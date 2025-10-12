import sqlite3
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# M8: Security Misconfiguration - Debug mode enabled in production code
app.config['DEBUG'] = True
CORS(app)

DB_FILE = 'planitbroken.db'

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# M10: Insufficient Cryptography - Using Base64 as "encryption"
def insecure_hash(password):
    return base64.b64encode(password.encode()).decode()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    hashed_pw = insecure_hash(password)

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_pw))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists"}), 409
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    # Vulnerable logic: Fetch user and check "hash" manually
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()

    if user and user['password'] == insecure_hash(password):
        # M3: Insecure Authentication - Returning the raw User ID to be used by the client
        return jsonify({
            "message": "Login successful",
            "user_id": user['id'], 
            "username": user['username']
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/tasks', methods=['GET'])
def get_tasks():
    # M3: Insecure Authorization (IDOR) - Trusting user_id from query param
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()

    return jsonify([dict(task) for task in tasks])

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    user_id = data.get('user_id')
    title = data.get('title')
    description = data.get('description', '')

    conn = get_db_connection()
    conn.execute('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)', 
                 (user_id, title, description))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"}), 201

@app.route('/tasks/search', methods=['GET'])
def search_tasks():
    query = request.args.get('q')
    
    # M4: Insufficient Input Validation (SQL Injection)
    # Directly concatenating the query string
    sql = f"SELECT * FROM tasks WHERE title LIKE '%{query}%'"
    
    conn = get_db_connection()
    try:
        print(f"Executing SQL: {sql}") # M8: Logging sensitive info (SQL queries)
        cursor = conn.execute(sql)
        tasks = cursor.fetchall()
        conn.close()
        return jsonify([dict(task) for task in tasks])
    except Exception as e:
        # M8: Security Misconfiguration - Returning full stack trace/error
        return jsonify({"error": str(e), "sql_executed": sql}), 500

@app.route('/events', methods=['GET', 'POST'])
def events():
    # Simple endpoint for calendar (inherits similar vulnerabilities implicitly)
    if request.method == 'POST':
        data = request.json
        conn = get_db_connection()
        conn.execute('INSERT INTO events (user_id, title, date) VALUES (?, ?, ?)',
                     (data['user_id'], data['title'], data['date']))
        conn.commit()
        conn.close()
        return jsonify({"message": "Event added"}), 201
    else:
        user_id = request.args.get('user_id')
        conn = get_db_connection()
        events = conn.execute('SELECT * FROM events WHERE user_id = ?', (user_id,)).fetchall()
        conn.close()
        return jsonify([dict(e) for e in events])

if __name__ == '__main__':
    # Host 0.0.0.0 to allow access from Emulator/LAN
    app.run(host='0.0.0.0', port=5000, debug=True)
