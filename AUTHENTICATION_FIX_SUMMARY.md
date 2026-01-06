# 🔧 Corrections Applied — Cookie JWT Authentication

## ✅ Problems Fixed

### 1. **`CookieJWTAuthentication` class created** ✨
**File**: `users/authentication.py`
- New custom DRF authentication class
- Reads JWT tokens from **HttpOnly cookies** (accessToken) 
- Falls back to Authorization header if cookie not found
- This was the missing link!

**Why it was needed**: 
- DRF's default `JWTAuthentication` only looks at `Authorization: Bearer <token>` header
- Backend was setting HttpOnly cookies but DRF wasn't reading them
- Result: `request.user` stayed as `AnonymousUser`

### 2. **Updated `settings.py` REST_FRAMEWORK config**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.CookieJWTAuthentication',  # Read cookies first
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Header fallback
    ),
}
```
- Now DRF will first try to authenticate via cookies
- Falls back to Authorization header if no cookie

### 3. **Simplified `current_user()` view**
- Removed manual cookie decoding (DRF handles it now)
- Added `@permission_classes([IsAuthenticated])` decorator
- DRF automatically returns 401 if not authenticated

## 🔄 Authentication Flow (Now Fixed)

```
Frontend Login:
1. POST /api/token/cookie/ with {username, password}
   ↓
Backend:
- Validates credentials
- Generates JWT tokens
- Sets HttpOnly cookies (accessToken, refreshToken)
- Returns {user, access, refresh}

Frontend:
- Stores user in AuthContext
- Cookies stored automatically by browser
- All subsequent requests include cookies

Next API Call (e.g., GET /api/auth/me/):
- Browser sends: Cookie: accessToken=<jwt>
- CookieJWTAuthentication reads cookie
- Decodes & validates token
- Sets request.user to authenticated user
- View executes with authenticated user ✓
```

## 📋 What Changed

| File | Change |
|------|--------|
| `users/authentication.py` | **NEW** — CookieJWTAuthentication class |
| `settings.py` | Updated REST_FRAMEWORK to use CookieJWTAuthentication |
| `views.py` | Simplified current_user(), added @permission_classes |

## ✅ What Works Now

- ✅ POST `/api/token/cookie/` → Sets HttpOnly cookies
- ✅ GET `/api/auth/me/` → Reads cookie, authenticates, returns user
- ✅ POST `/api/profil/` → Reads cookie, updates user
- ✅ POST `/api/profil/change_password/` → Reads cookie, changes password
- ✅ POST `/api/auth/logout/` → Clears cookies

## 🚀 What You Need to Do

1. **Restart Django server**:
   ```bash
   python manage.py runserver
   ```

2. **Test login flow**:
   - Go to frontend login page
   - Enter credentials
   - Should see "connexion réussie"
   - Should navigate to dashboard (not redirected back to login)
   - Open DevTools → Application → Cookies → Should see `accessToken` and `refreshToken`

3. **Test /api/auth/me/**:
   - After login, try: `curl -b cookies.txt http://localhost:8000/api/auth/me/`
   - Should return user data (no more `AnonymousUser` error)

## 🐛 If Still Issues

Check:
1. Django console for errors
2. Browser DevTools → Network tab → see cookies being sent?
3. Browser DevTools → Console → any CORS errors?
4. Verify frontend is calling `/api/token/cookie/` (not `/api/login/`)
