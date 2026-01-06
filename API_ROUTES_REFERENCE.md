# API Routes Overview (After Backend Unification)

## Authentication Routes
All routes mounted under `/api/` prefix via project `urls.py`

### Login & Token Management
| Method | Endpoint | Handler | Input | Output |
|--------|----------|---------|-------|--------|
| POST | `/api/login/` | `login_api()` | `{username, password}` | `{user, access, refresh}` + HttpOnly cookies |
| POST | `/api/token/cookie/` | `CookieTokenObtainPairView` | `{username, password}` | `{access, refresh, role, redirect}` + HttpOnly cookies |
| POST | `/api/token/refresh/cookie/` | `CookieTokenRefreshView` | (reads refreshToken cookie) | `{access}` + updates accessToken cookie |
| POST | `/api/token/` | `MyTokenObtainPairView` | `{username, password}` | `{access, refresh, role, redirect}` (no cookies) |
| POST | `/api/token/refresh/` | `TokenRefreshView` | `{refresh}` | `{access}` |

### User Authentication Endpoints
| Method | Endpoint | Handler | Auth | Input | Output |
|--------|----------|---------|------|-------|--------|
| GET | `/api/auth/me/` | `current_user()` | JWT cookie/header | - | `{id, username, email, role, nom_complet, promotion, photo}` |
| POST | `/api/auth/logout/` | `api_logout()` | JWT cookie/header | - | `{detail: "logged out"}` + clear cookies |
| GET | `/api/csrf/` | `csrf_token()` | - | - | `{csrfToken: "..."}` |

### User Profile Endpoints
| Method | Endpoint | Handler | Auth | Input | Output |
|--------|----------|---------|------|-------|--------|
| GET | `/api/profil/` | `profil_api()` | IsAuthenticated | - | `{id, username, email, first_name, last_name, role, promotion, photo}` |
| POST | `/api/profil/` | `profil_api()` | IsAuthenticated | `{first_name?, last_name?, email?, promotion?}` or file upload | `{message, profil: {...}}` |
| POST | `/api/profil/change_password/` | `change_password_api()` | IsAuthenticated | `{old_password, new_password, confirm_password}` | `{message: "Password changed successfully"}` |

---

## Frontend Integration Points

### 1. Login Flow
```
Frontend → POST /api/login/ with {username, password}
Backend  → Returns {user, access, refresh} + sets HttpOnly cookies
Frontend → Stores user in AuthContext, uses cookies for subsequent requests
```

### 2. Session Refresh (Automatic)
```
Frontend → API call includes accessToken cookie (automatic)
Backend  → If 401, frontend calls POST /api/token/refresh/cookie/
Backend  → Updates accessToken cookie
Frontend → Retries original request
```

### 3. Protected Route Access
```
Frontend → GET /api/auth/me/ (with cookie)
Backend  → Returns current user data or 401
Frontend → If 401, redirect to /login
Frontend → If success, render dashboard
```

### 4. Profile Updates
```
Frontend → POST /api/profil/ with JSON or multipart form-data
Backend  → Updates user/profil, returns updated data
Frontend → Updates AuthContext
```

### 5. Logout
```
Frontend → POST /api/auth/logout/
Backend  → Clears cookies
Frontend → Clears AuthContext, redirects to /login
```

---

## Data Schema

### Login Response
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "etudiant|admin|encadreur|coordinateur",
    "nom_complet": "John Doe",
    "promotion": "2024",
    "photo": "https://example.com/photo.jpg" | null
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Profile Response (GET /api/profil/)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "etudiant",
  "promotion": "2024",
  "photo": "https://example.com/photo.jpg" | null
}
```

### Error Response
```json
{
  "detail": "Invalid credentials" | "Authentication credentials were not provided." | etc.
}
```

---

## Cookie Management

### Set on Login (`POST /api/login/` or `/api/token/cookie/`)
```
Set-Cookie: accessToken=<jwt>; Max-Age=1800; HttpOnly; Path=/; SameSite=Lax
Set-Cookie: refreshToken=<jwt>; Max-Age=604800; HttpOnly; Path=/; SameSite=Lax
```

### Sent on Every Request
```
Cookie: accessToken=<jwt>; refreshToken=<jwt>
```

### Cleared on Logout
```
Set-Cookie: accessToken=; Max-Age=0; HttpOnly; Path=/
Set-Cookie: refreshToken=; Max-Age=0; HttpOnly; Path=/
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (Next.js)                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User submits login form                                      │
│  2. POST /api/login/ {username, password}                        │
│     ↓                                                            │
│  3. Backend validates, generates JWT, sets HttpOnly cookies      │
│  4. Response: {user, access, refresh}                            │
│     ↓                                                            │
│  5. AuthContext stores {user, isAuthenticated, role}             │
│  6. Cookies automatically sent on all requests                   │
│     ↓                                                            │
│  7. Protected pages check AuthContext.isAuthenticated            │
│  8. If needed, call GET /api/auth/me/ to verify session          │
│     ↓                                                            │
│  9. On logout: POST /api/auth/logout/                            │
│     → Backend clears cookies, Frontend clears context            │
│     → Redirect to /login                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backwards Compatibility

### Old Routes (Still Available, Not Recommended)
- `POST /api/token/` — Returns tokens without cookies (legacy)
- `POST /api/token/refresh/` — Requires refresh token in body (legacy)

**Recommendation**: Use cookie-based routes (`/api/token/cookie/`) or new unified `/api/login/` endpoint.

---

## Status: ✅ READY

All endpoints are now:
- ✅ Pure JSON API (no HTML/template rendering)
- ✅ Compatible with Next.js frontend
- ✅ Using DRF decorators (@api_view, @permission_classes)
- ✅ Returning consistent JSON error responses
- ✅ Using HttpOnly cookies for JWT tokens
- ✅ No server-side redirects (frontend handles navigation)
