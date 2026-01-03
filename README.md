# PlanItSecure - Bezpieczna Aplikacja do Zarządzania Zadaniami

Mobilna aplikacja do zarządzania zadaniami zbudowana przy użyciu React Native (Expo) i Flask, demonstrująca najlepsze praktyki bezpieczeństwa OWASP Mobile Top 10.

## ⚠️ Dwie wersje projektu

Projekt zawiera **dwie wersje** aplikacji:

1. **Wersja podatna (vulnerable)** - z celowo wprowadzonymi podatnościami OWASP Mobile Top 10
2. **Wersja zabezpieczona (secure)** - z wszystkimi poprawkami bezpieczeństwa

Zobacz [VERSION_SWITCH_GUIDE.md](VERSION_SWITCH_GUIDE.md) aby dowiedzieć się jak przełączać między wersjami.

## Funkcjonalności

- ✅ Rejestracja i uwierzytelnianie użytkowników (JWT w wersji secure)
- ✅ Zarządzanie zadaniami (operacje CRUD)
- ✅ Zarządzanie kalendarzem/wydarzeniami
- ✅ Bezpieczne przechowywanie danych (w wersji secure)
- ✅ Nowoczesny, responsywny interfejs użytkownika

## Funkcje Bezpieczeństwa (Wersja Secure)

Wszystkie podatności z listy OWASP Mobile Top 10 zostały zidentyfikowane i naprawione:

1. **M1: Niewłaściwe użycie poświadczeń** - Brak zahardkodowanych sekretów, zmienne środowiskowe
2. **M3: Niebezpieczne uwierzytelnianie** - Tokeny JWT, autoryzacja po stronie serwera
3. **M4: Walidacja danych wejściowych** - Zapytania parametryzowane, sanityzacja danych
4. **M5: Niebezpieczna komunikacja** - Konfiguracja gotowa na HTTPS
5. **M8: Błędna konfiguracja bezpieczeństwa** - Wyłączony tryb debugowania, ogólne komunikaty błędów
6. **M9: Niebezpieczne przechowywanie danych** - SecureStore dla danych wrażliwych
7. **M10: Niewystarczająca kryptografia** - Hashowanie haseł bcrypt

Zobacz [SECURITY_FIXES.md](SECURITY_FIXES.md) dla szczegółowej dokumentacji.

## Struktura Projektu

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
├── tests/                   # Testy eksploatacyjne bezpieczeństwa
├── VULNERABILITY_GUIDE.md   # Dokumentacja podatności
├── SECURITY_FIXES.md        # Dokumentacja poprawek
├── VERSION_SWITCH_GUIDE.md  # Przewodnik przełączania wersji
└── BEST_PRACTICES.md         # Najlepsze praktyki
```

## Szybki Start

### Konfiguracja Backend (Wersja Secure)

1. Przejdź do katalogu backend:
```bash
cd backend
```

2. Skopiuj wersję secure:
```bash
copy secure\app.py app.py
copy secure\requirements.txt requirements.txt
```

3. Stwórz wirtualne środowisko:
```bash
python -m venv venv
source venv/bin/activate  # Na Windows: venv\Scripts\activate
```

4. Zainstaluj zależności:
```bash
pip install -r requirements.txt
```

5. Skonfiguruj zmienne środowiskowe:
```bash
copy .env.example .env
# Edytuj .env i ustaw swoje sekrety
```

6. Zainicjuj bazę danych:
```bash
python init_db.py
```

7. Uruchom serwer:
```bash
python app.py
```

### Konfiguracja Backend (Wersja Vulnerable)

1. Przejdź do katalogu backend:
```bash
cd backend
```

2. Skopiuj wersję vulnerable:
```bash
copy vulnerable\app.py app.py
copy vulnerable\requirements.txt requirements.txt
```

3. Zainstaluj zależności:
```bash
pip install -r requirements.txt
```

4. Uruchom serwer:
```bash
python app.py
```

### Konfiguracja Aplikacji Mobilnej (Wersja Podatna)

```bash
cd mobile
npm install
npm start
# Następnie naciśnij 'a' dla Androida lub 'i' dla iOS
```

### Konfiguracja Aplikacji Mobilnej (Wersja Zabezpieczona)

```bash
cd mobile-secured
npm install
npm start
# Następnie naciśnij 'a' dla Androida lub 'i' dla iOS
```

## Testowanie

### Testy Bezpieczeństwa

Uruchom testy eksploatacyjne, aby zweryfikować podatności:
```bash
cd backend
python ../tests/exploit_tests.py
```

**Oczekiwane Wyniki:**
- **Wersja vulnerable:** Testy powinny ZDAĆ (potwierdzając istnienie podatności)
- **Wersja secure:** Testy powinny OBLAĆ (potwierdzając naprawienie podatności)

## Dokumentacja

- [VULNERABILITY_GUIDE.md](VULNERABILITY_GUIDE.md) - Oryginalne podatności i jak je wykorzystać
- [SECURITY_FIXES.md](SECURITY_FIXES.md) - Szczegółowa dokumentacja wszystkich poprawek bezpieczeństwa
- [VERSION_SWITCH_GUIDE.md](VERSION_SWITCH_GUIDE.md) - Jak przełączać się między wersjami
- [BEST_PRACTICES.md](BEST_PRACTICES.md) - Najlepsze praktyki programistyczne
- [ANALIZA_WYMAGAN.md](ANALIZA_WYMAGAN.md) - Analiza wymagań

## Technologie

- **Frontend:** React Native (Expo), React Navigation
- **Backend:** Flask, SQLite
- **Bezpieczeństwo:** JWT, bcrypt, expo-secure-store (wersja secure)
- **Testowanie:** Jest, Python requests

## Licencja

Projekt edukacyjny w celach demonstracji bezpieczeństwa.