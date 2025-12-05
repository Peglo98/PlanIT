import sqlite3
import os
import bcrypt
import jwt
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# M8: Security Misconfiguration - FIXED: Debug mode disabled in production
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_urlsafe(32))
CORS(app)

DB_FILE = 'planitbroken.db'
JWT_SECRET = os.getenv('JWT_SECRET', secrets.token_urlsafe(32))
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# M10: Insufficient Cryptography - FIXED: Using bcrypt for secure password hashing
def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password, hashed):
    """Verify password against bcrypt hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id, username):
    """Generate JWT token for authenticated user"""
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# M3: Insecure Authentication/Authorization - FIXED: Authentication middleware
def require_auth(f):
    """Decorator to require JWT authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({"error": "Invalid authorization header"}), 401
        
        if not token:
            return jsonify({"error": "Authentication required"}), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        request.current_user = payload
        return f(*args, **kwargs)
    return decorated_function

# M4: Insufficient Input Validation - FIXED: Input validation helper
def validate_input(data, required_fields, max_lengths=None):
    """Validate input data"""
    errors = []
    
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
        elif max_lengths and field in max_lengths:
            if len(str(data[field])) > max_lengths[field]:
                errors.append(f"{field} exceeds maximum length of {max_lengths[field]}")
    
    # Sanitize string inputs to prevent SQL injection
    if max_lengths:
        for field in data:
            if isinstance(data[field], str) and field in max_lengths:
                # Remove potentially dangerous characters
                data[field] = data[field].replace("'", "''").replace(";", "").replace("--", "")
    
    return errors

@app.route('/register', methods=['POST'])
def register():
    """M10: FIXED - Using bcrypt for password hashing"""
    data = request.json or {}
    
    # M4: Input validation
    errors = validate_input(data, ['username', 'password'], {
        'username': 50,
        'password': 100
    })
    
    if errors:
        return jsonify({"error": "; ".join(errors)}), 400
    
    username = data.get('username').strip()
    password = data.get('password')
    
    # Password strength check
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    hashed_pw = hash_password(password)
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_pw))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists"}), 409
    except Exception as e:
        # M8: FIXED - Generic error message, log details server-side
        app.logger.error(f"Registration error: {str(e)}")
        return jsonify({"error": "Registration failed"}), 500
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    """M3: FIXED - Returns JWT token instead of raw user_id"""
    data = request.json or {}
    
    # M4: Input validation
    errors = validate_input(data, ['username', 'password'])
    if errors:
        return jsonify({"error": "; ".join(errors)}), 400
    
    username = data.get('username').strip()
    password = data.get('password')
    
    conn = get_db_connection()
    try:
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500
    finally:
        conn.close()
    
    if user and verify_password(password, user['password']):
        token = generate_token(user['id'], user['username'])
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user_id": user['id'],
            "username": user['username']
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/tasks', methods=['GET'])
@require_auth
def get_tasks():
    """M3: FIXED - IDOR prevention: Only return tasks for authenticated user"""
    # Get user_id from JWT token, not from query parameter
    user_id = request.current_user['user_id']
    
    conn = get_db_connection()
    try:
        # M4: FIXED - Parameterized query (already was, but now enforced)
        tasks = conn.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,)).fetchall()
        return jsonify([dict(task) for task in tasks])
    except Exception as e:
        app.logger.error(f"Get tasks error: {str(e)}")
        return jsonify({"error": "Failed to retrieve tasks"}), 500
    finally:
        conn.close()

@app.route('/tasks', methods=['POST'])
@require_auth
def add_task():
    """M3: FIXED - IDOR prevention: Tasks are assigned to authenticated user"""
    data = request.json or {}
    
    # M4: Input validation
    errors = validate_input(data, ['title'], {
        'title': 200,
        'description': 1000
    })
    
    if errors:
        return jsonify({"error": "; ".join(errors)}), 400
    
    # Get user_id from JWT token, not from request body
    user_id = request.current_user['user_id']
    title = data.get('title').strip()
    description = data.get('description', '').strip()
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)', 
                     (user_id, title, description))
        conn.commit()
        return jsonify({"message": "Task added"}), 201
    except Exception as e:
        app.logger.error(f"Add task error: {str(e)}")
        return jsonify({"error": "Failed to add task"}), 500
    finally:
        conn.close()

@app.route('/tasks/search', methods=['GET'])
@require_auth
def search_tasks():
    """M4: FIXED - SQL Injection prevention: Parameterized query"""
    query = request.args.get('q', '').strip()
    user_id = request.current_user['user_id']
    
    if not query:
        return jsonify({"error": "Search query is required"}), 400
    
    # M4: FIXED - Parameterized query instead of string concatenation
    conn = get_db_connection()
    try:
        # Sanitize query for LIKE pattern
        search_pattern = f"%{query}%"
        tasks = conn.execute(
            'SELECT * FROM tasks WHERE user_id = ? AND title LIKE ?',
            (user_id, search_pattern)
        ).fetchall()
        conn.close()
        return jsonify([dict(task) for task in tasks])
    except Exception as e:
        # M8: FIXED - Generic error message
        app.logger.error(f"Search error: {str(e)}")
        return jsonify({"error": "Search failed"}), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@require_auth
def update_task(task_id):
    """Update task - only owner can update"""
    data = request.json or {}
    user_id = request.current_user['user_id']
    
    conn = get_db_connection()
    try:
        # Verify task belongs to user
        task = conn.execute('SELECT * FROM tasks WHERE id = ? AND user_id = ?', 
                           (task_id, user_id)).fetchone()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        title = data.get('title', task['title']).strip()
        description = data.get('description', task['description'] or '').strip()
        is_done = data.get('is_done', task['is_done'])
        
        conn.execute(
            'UPDATE tasks SET title = ?, description = ?, is_done = ? WHERE id = ? AND user_id = ?',
            (title, description, is_done, task_id, user_id)
        )
        conn.commit()
        return jsonify({"message": "Task updated"}), 200
    except Exception as e:
        app.logger.error(f"Update task error: {str(e)}")
        return jsonify({"error": "Failed to update task"}), 500
    finally:
        conn.close()

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@require_auth
def delete_task(task_id):
    """Delete task - only owner can delete"""
    user_id = request.current_user['user_id']
    
    conn = get_db_connection()
    try:
        result = conn.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', 
                             (task_id, user_id))
        conn.commit()
        
        if result.rowcount == 0:
            return jsonify({"error": "Task not found"}), 404
        
        return jsonify({"message": "Task deleted"}), 200
    except Exception as e:
        app.logger.error(f"Delete task error: {str(e)}")
        return jsonify({"error": "Failed to delete task"}), 500
    finally:
        conn.close()

@app.route('/events', methods=['GET'])
@require_auth
def get_events():
    """M3: FIXED - IDOR prevention: Only return events for authenticated user"""
    user_id = request.current_user['user_id']
    
    conn = get_db_connection()
    try:
        events = conn.execute('SELECT * FROM events WHERE user_id = ?', (user_id,)).fetchall()
        return jsonify([dict(e) for e in events])
    except Exception as e:
        app.logger.error(f"Get events error: {str(e)}")
        return jsonify({"error": "Failed to retrieve events"}), 500
    finally:
        conn.close()

@app.route('/events', methods=['POST'])
@require_auth
def add_event():
    """M3: FIXED - IDOR prevention: Events are assigned to authenticated user"""
    data = request.json or {}
    
    # M4: Input validation
    errors = validate_input(data, ['title', 'date'], {
        'title': 200,
        'date': 20
    })
    
    if errors:
        return jsonify({"error": "; ".join(errors)}), 400
    
    user_id = request.current_user['user_id']
    title = data.get('title').strip()
    date = data.get('date').strip()
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO events (user_id, title, date) VALUES (?, ?, ?)',
                     (user_id, title, date))
        conn.commit()
        return jsonify({"message": "Event added"}), 201
    except Exception as e:
        app.logger.error(f"Add event error: {str(e)}")
        return jsonify({"error": "Failed to add event"}), 500
    finally:
        conn.close()

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    # M8: FIXED - Generic error message in production
    app.logger.error(f"Internal error: {str(error)}")
    return jsonify({"error": "An internal error occurred"}), 500

if __name__ == '__main__':
    # M5: Note - For local development, HTTP is acceptable
    # In production, use HTTPS with proper SSL certificates
    # For emulator: http://10.0.2.2:5000
    # For production: https://your-domain.com
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])
