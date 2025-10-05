# PlanItSecure - Secure Task Management App

A mobile task management application built with React Native (Expo) and Flask, demonstrating OWASP Mobile Top 10 security best practices.

## ⚠️ Dwie wersje projektu

Projekt zawiera **dwie wersje** aplikacji:

1. **Wersja podatna (vulnerable)** - z celowo wprowadzonymi podatnościami OWASP Mobile Top 10
2. **Wersja zabezpieczona (secure)** - z wszystkimi poprawkami bezpieczeństwa

Zobacz [VERSION_SWITCH_GUIDE.md](VERSION_SWITCH_GUIDE.md) aby dowiedzieć się jak przełączać między wersjami.

## Features

- ✅ User registration and authentication (JWT w wersji secure)
- ✅ Task management (CRUD operations)
- ✅ Calendar/Events management
- ✅ Secure data storage (w wersji secure)
- ✅ Modern, responsive UI

## Security Features (Wersja Secure)

All OWASP Mobile Top 10 vulnerabilities have been identified and fixed:

1. **M1: Improper Credential Usage** - No hardcoded secrets, environment variables
2. **M3: Insecure Authentication** - JWT tokens, server-side authorization
3. **M4: Input Validation** - Parameterized queries, input sanitization
4. **M5: Insecure Communication** - HTTPS-ready configuration
5. **M8: Security Misconfiguration** - Debug mode disabled, generic errors
6. **M9: Insecure Data Storage** - SecureStore for sensitive data
7. **M10: Insufficient Cryptography** - bcrypt password hashing

See [SECURITY_FIXES.md](SECURITY_FIXES.md) for detailed documentation.

## Project Structure

```
.
├── backend/
│   ├── vulnerable/          # Wersja podatna
│   │   ├── app.py
│   │   └── requirements.txt
│   ├── secure/              # Wersja zabezpieczona
│   │   ├── app.py
│   │   └── requirements.txt
│   ├── app.py               # Obecnie aktywna wersja
│   ├── init_db.py
│   └── requirements.txt
├── mobile/                  # Wersja podatna aplikacji mobilnej
│   ├── src/
│   │   ├── config.js        (z hardcoded API_KEY)
│   │   └── screens/
│   └── package.json
├── mobile-secured/           # Wersja zabezpieczona aplikacji mobilnej
│   ├── src/
│   │   ├── config.js        (bez hardcoded secrets)
│   │   ├── services/        (authService z SecureStore)
│   │   └── screens/
│   └── package.json
├── tests/                   # Security exploit tests
├── VULNERABILITY_GUIDE.md   # Dokumentacja podatności
├── SECURITY_FIXES.md        # Dokumentacja poprawek
├── VERSION_SWITCH_GUIDE.md  # Przewodnik przełączania wersji
└── BEST_PRACTICES.md         # Best practices
```

## Quick Start

### Backend Setup (Wersja Secure)

1. Navigate to backend directory:
```bash
cd backend
```

2. Skopiuj wersję secure:
```bash
copy secure\app.py app.py
copy secure\requirements.txt requirements.txt
```

3. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables:
```bash
copy .env.example .env
# Edit .env and set your secrets
```

6. Initialize database:
```bash
python init_db.py
```

7. Run server:
```bash
python app.py
```

### Backend Setup (Wersja Vulnerable)

1. Navigate to backend directory:
```bash
cd backend
```

2. Skopiuj wersję vulnerable:
```bash
copy vulnerable\app.py app.py
copy vulnerable\requirements.txt requirements.txt
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run server:
```bash
python app.py
```

### Mobile App Setup (Wersja Podatna)

```bash
cd mobile
npm install
npm start
# Then press 'a' for Android or 'i' for iOS
```

### Mobile App Setup (Wersja Zabezpieczona)

```bash
cd mobile-secured
npm install
npm start
# Then press 'a' for Android or 'i' for iOS
```

## Testing

### Security Tests

Run exploit tests to verify vulnerabilities:
```bash
cd backend
python ../tests/exploit_tests.py
```

**Expected Results:**
- **Wersja vulnerable:** Tests should PASS (proving vulnerabilities exist)
- **Wersja secure:** Tests should FAIL (proving vulnerabilities are fixed)

## Documentation

- [VULNERABILITY_GUIDE.md](VULNERABILITY_GUIDE.md) - Original vulnerabilities and how to exploit them
- [SECURITY_FIXES.md](SECURITY_FIXES.md) - Detailed documentation of all security fixes
- [VERSION_SWITCH_GUIDE.md](VERSION_SWITCH_GUIDE.md) - How to switch between versions
- [BEST_PRACTICES.md](BEST_PRACTICES.md) - Development best practices
- [ANALIZA_WYMAGAN.md](ANALIZA_WYMAGAN.md) - Requirements analysis (Polish)

## Technologies

- **Frontend:** React Native (Expo), React Navigation
- **Backend:** Flask, SQLite
- **Security:** JWT, bcrypt, expo-secure-store (wersja secure)
- **Testing:** Jest, Python requests

## License

Educational project for security demonstration purposes.
