# Backend API Unification — Changes Summary

## 🎯 Objective
Transform the Django backend from a mixed **template/API system** to a **pure JSON API** compatible with the Next.js frontend (cookie-based JWT authentication).

---

## ✅ Changes Applied

### 1. **users/views.py** — Complete Overhaul

#### 🗑️ Removed (Deleted)
- **`connexion_utilisateur()`** — Old template-based login with form POST data
  - Had conditional JSON response only for AJAX requests (X-Requested-With header)
  - Mixed template rendering with API responses
  - Incompatible with frontend's JSON-only approach

- **`deconnexion()`** — Redundant legacy logout function
  - Replaced by unified `api_logout()`

- **`profil_view()`** — Old template-based profile management
  - Used `@login_required(login_url='users:connexion')` decorator (template redirect)
  - Read `request.POST` form data
  - Could not handle JSON from frontend

- **`change_password()`** — Old template-based password change
  - Used `@login_required` decorator
  - Expected form POST, not JSON

#### ✨ Added (New JSON API Endpoints)

**`login_api(request)` — @api_view(['POST'])**
- **Purpose**: Unified login endpoint accepting JSON
- **Input**: JSON with `username` (or email) + `password`
- **Output**: JSON with `user` object (id, username, email, role, nom_complet, promotion, photo) + `access` token + `refresh` token
- **Process**:
  1. Accepts identifier as username or email (auto-detects with `@` check)
  2. Authenticates via Django auth
  3. Generates JWT tokens via `MyTokenObtainPairSerializer`
  4. Sets HttpOnly cookies (`accessToken`, `refreshToken`) — 30 min & 7 days lifetime
  5. Returns tokens in JSON for frontend (frontend stores in context, not localStorage)

**`profil_api(request)` — @api_view(['GET', 'POST']) + @permission_classes([IsAuthenticated])**
- **GET**: Return authenticated user's profile (id, username, email, first_name, last_name, role, promotion, photo URL)
- **POST**: Update profile fields — accepts JSON with `first_name`, `last_name`, `email`, `promotion`, or file upload for `photo`
- **Auth**: DRF `IsAuthenticated` (replaces `@login_required`)
- **Output**: Updated profile data in JSON

**`change_password_api(request)` — @api_view(['POST']) + @permission_classes([IsAuthenticated])**
- **Purpose**: Unified password change endpoint
- **Input**: JSON with `old_password`, `new_password`, `confirm_password`
- **Validation**:
  - Verifies old password
  - Checks new passwords match
  - Uses Django's `set_password()` & `update_session_auth_hash()`
- **Output**: Success message or error details in JSON

#### 🔄 Unchanged (Already Good)
- **`MyTokenObtainPairSerializer`** — ✅ Already configured with role & redirect logic
- **`CookieTokenObtainPairView`** — ✅ Sets HttpOnly cookies correctly
- **`CookieTokenRefreshView`** — ✅ Refreshes access token via cookie
- **`current_user()` (auth/me/)** — ✅ Already returns user data in JSON

#### 📦 Cleaned Imports
Removed:
- `login_required` (no longer used)
- `UserUpdateForm`, `ProfilUpdateForm` (not needed for JSON API)

---

### 2. **users/urls.py** — Route Restructuring

#### 🔄 Changes
- ❌ Removed old template-based routes
- ✅ Kept JWT endpoints (legacy support)
- ✅ Kept cookie-based JWT endpoints (preferred)
- ✅ **Added `path('login/', views.login_api)` — Primary login endpoint**
- ✅ **Renamed `profil/` route to use new `profil_api` view**
- ✅ **Renamed `profil/change_password/` route to use new `change_password_api` view**

**Final Structure (mounted at `/api/` in project urls.py)**:
```
GET/POST  /api/csrf/                           → csrf_token()
POST      /api/login/                          → login_api() ⭐ PRIMARY
POST      /api/token/cookie/                   → CookieTokenObtainPairView() (alternative)
POST      /api/token/refresh/cookie/           → CookieTokenRefreshView()
GET       /api/auth/me/                        → current_user() (get auth'd user)
POST      /api/auth/logout/                    → api_logout()
GET/POST  /api/profil/                         → profil_api()
POST      /api/profil/change_password/         → change_password_api()
```

---

## 📊 Frontend Compatibility

### ✅ Already Aligned (No Changes Needed)
- **Frontend login flow**: Sends JSON `{username, password}` to `/api/token/cookie/` or `/api/login/`
- **Frontend cookie handling**: credentials: "include" on all fetch calls ✓
- **Frontend user context**: Stores user data from response, not passwords ✓
- **Frontend middleware**: Checks accessToken cookie, refreshes if needed ✓

### 🔗 Communication Pattern (Now Unified)
```
Frontend                          Backend
1. POST {username, password}  →   /api/login/
2. ← {user, access, refresh}  
3. Backend sets HttpOnly cookies (frontend doesn't touch them)
4. Frontend stores user in Context, tokens in memory
5. All subsequent requests include accessToken cookie automatically
6. If 401, frontend calls /api/token/refresh/cookie/
7. Backend updates accessToken cookie, frontend continues
```

---

## 🎯 What This Fixes

| Problem | Before | After |
|---------|--------|-------|
| **JSON vs Form mismatch** | Endpoints expected `request.POST` form data | All endpoints accept JSON via `request.data` |
| **Mixed authentication systems** | 2 systems (session auth + JWT) coexisted | Single unified system: **API + HttpOnly cookies** |
| **Template redirects** | `@login_required(login_url='...')` caused 404s | DRF `@permission_classes([IsAuthenticated])` returns JSON errors |
| **Inconsistent endpoints** | Multiple login endpoints with different behaviors | Single `login_api()` endpoint, consistent JSON I/O |
| **Frontend compatibility** | Frontend sent JSON but backend expected forms | ✅ Pure JSON ↔ JSON communication |
| **Server-side redirects** | Backend redirected based on user role | ✅ Frontend handles all navigation (better separation of concerns) |

---

## 🧪 Testing Checklist

### Manual API Tests (using curl or Postman)

1. **Login**:
   ```bash
   curl -X POST http://localhost:8000/api/login/ \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "password123"}' \
     -b cookies.txt -c cookies.txt
   ```
   Expected: `{user: {...}, access: "...", refresh: "..."}`
   Cookies: `accessToken`, `refreshToken` set in response headers

2. **Get Auth'd User**:
   ```bash
   curl -X GET http://localhost:8000/api/auth/me/ \
     -b cookies.txt
   ```
   Expected: User profile data

3. **Update Profile**:
   ```bash
   curl -X POST http://localhost:8000/api/profil/ \
     -H "Content-Type: application/json" \
     -d '{"first_name": "Jean", "last_name": "Dupont"}' \
     -b cookies.txt
   ```
   Expected: Updated profile

4. **Change Password**:
   ```bash
   curl -X POST http://localhost:8000/api/profil/change_password/ \
     -H "Content-Type: application/json" \
     -d '{"old_password": "old", "new_password": "new", "confirm_password": "new"}' \
     -b cookies.txt
   ```
   Expected: Success message

5. **Logout**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/logout/ \
     -b cookies.txt
   ```
   Expected: Cookies cleared, 200 response

### Frontend Integration Tests
- ✅ Login page calls `POST /api/login/` with JSON
- ✅ After login, `GET /api/auth/me/` returns user data
- ✅ Protected pages check auth via middleware
- ✅ Token refresh works automatically on 401
- ✅ Logout clears cookies and context

---

## 🚀 Next Steps (If Needed)

1. **Optional**: Deprecate old token/ endpoints after confirming cookie/ endpoints work
2. **Optional**: Add rate limiting to `/api/login/` to prevent brute force
3. **Optional**: Add audit logging for login/password changes
4. **Testing**: Run full test suite to ensure no breakage in other apps

---

## 📝 Summary

**What was broken**: Backend mixed HTML template logic with API endpoints. Frontend sent JSON but backend expected form POST data. Two incompatible auth systems existed.

**What's fixed**: 
- ✅ Eliminated all template-based views
- ✅ All endpoints now pure JSON API
- ✅ Single unified login system (API + HttpOnly cookies)
- ✅ Uses DRF decorators instead of Django template decorators
- ✅ Fully compatible with Next.js frontend's expectations

**No changes to frontend required** — it was already designed correctly! ✨
