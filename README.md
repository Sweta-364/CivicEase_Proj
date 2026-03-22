# CivicEase — Community Civic Response Platform

A full-stack civic complaint management system with:
- **Mobile App** (Flutter) — Android APK + Web
- **Web Frontend** (React + Vite + TailwindCSS)
- **Backend API** (FastAPI + PostgreSQL + Cloudinary)

---

## 🏗️ Project Structure

```
CivicEase/
├── backend/          # FastAPI Python backend
│   ├── main.py       # API endpoints
│   ├── database.py   # SQLAlchemy DB config
│   ├── models.py     # DB models
│   ├── schemas.py    # Pydantic schemas
│   ├── requirements.txt
│   ├── build.sh      # Render build script
│   └── .env          # Environment variables (local)
├── frontend/         # React + Vite web frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── mobile/           # Flutter mobile + web app
│   ├── lib/
│   │   ├── config.dart        # API URL config (dart-define)
│   │   ├── services/api_service.dart
│   │   ├── screens/
│   │   ├── models/
│   │   └── widgets/
│   ├── android/
│   └── pubspec.yaml
├── render.yaml       # Render Blueprint (backend + frontend)
└── README.md
```

---

## 🚀 Deployment Guide

### 1. Backend → Render Web Service

#### Option A: Using Render Blueprint (Recommended)
1. Push your code to GitHub/GitLab
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New → Blueprint** and connect your repo
4. Render will auto-detect `render.yaml` and create both services
5. Set the following **Environment Variables** in the Render dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

#### Option B: Manual Setup
1. Create a **New Web Service** on Render
2. Connect your repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
   - **Environment**: Python 3
4. Add the same environment variables as above
5. Deploy

Your backend will be available at: `https://your-service-name.onrender.com`

---

### 2. Web Frontend → Render Static Site

#### Option A: Via Blueprint
Already included in `render.yaml`. Just set the `VITE_API_URL` environment variable to your deployed backend URL.

#### Option B: Manual Setup
1. Create a **New Static Site** on Render
2. Connect your repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
5. Add a **Rewrite Rule**: `/*` → `/index.html` (for SPA routing)

---

### 3. Flutter Mobile APK — Direct Distribution

#### Build the APK
```bash
# Replace YOUR_BACKEND_URL with your deployed Render backend URL
export ANDROID_HOME=~/Android/Sdk

flutter build apk --release \
  --dart-define=API_BASE_URL=https://your-backend.onrender.com
```

The APK will be at: `mobile/build/app/outputs/flutter-apk/app-release.apk`

#### Distribute the APK
- Upload to **Google Drive**, a website, or any file-sharing service
- Share the direct download link
- Users need to enable "Install from Unknown Sources" on their Android device

#### For Play Store (Future)
1. Generate a signing keystore:
   ```bash
   keytool -genkey -v -keystore ~/civicease-release.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias civicease
   ```
2. Create `mobile/android/key.properties`:
   ```properties
   storePassword=your_password
   keyPassword=your_password
   keyAlias=civicease
   storeFile=/path/to/civicease-release.jks
   ```
3. Update `build.gradle.kts` to use the release signing config

---

## 🛠️ Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Flutter (Chrome)
```bash
cd mobile
flutter run -d chrome --web-port=3456
```

### Flutter (Android Emulator)
```bash
cd mobile
flutter run -d emulator-5554 \
  --dart-define=API_BASE_URL=http://10.0.2.2:8000
```

---

## ⚙️ Configuration

### API Base URL (Flutter)
Configured via `--dart-define` at build time:

| Environment | Command |
|-------------|---------|
| Local dev (default) | `flutter run` (defaults to `http://localhost:8000`) |
| Android Emulator | `flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000` |
| Production APK | `flutter build apk --dart-define=API_BASE_URL=https://your-api.onrender.com` |
| Production Web | `flutter build web --dart-define=API_BASE_URL=https://your-api.onrender.com` |

### API Base URL (React Frontend)
Set via `VITE_API_URL` environment variable:
- **Dev**: empty (Vite proxy forwards to `localhost:8000`)
- **Production**: set to full backend URL (e.g., `https://civicease-api.onrender.com`)

### Backend Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (prod) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

---

## 📱 Android Permissions
The app requests:
- `INTERNET` — Required for API communication
- `ACCESS_NETWORK_STATE` — Check network availability

---

## 🔒 Security Notes
- `.env` files are gitignored and never committed
- Signing keystores (`.jks`, `.keystore`) are gitignored
- `key.properties` is gitignored
- APK files are gitignored (distribute separately)
- CORS is configured to allow all origins (suitable for mobile app + multi-frontend)

---

## 📦 Build Outputs

| Artifact | Location | Size |
|----------|----------|------|
| Android APK | `mobile/build/app/outputs/flutter-apk/app-release.apk` | ~48MB |
| Web Frontend | `frontend/dist/` | ~500KB |
| Flutter Web | `mobile/build/web/` | ~2MB |

---

## 🧪 Tech Stack
- **Backend**: Python 3.12 · FastAPI · SQLAlchemy · PostgreSQL · Cloudinary
- **Frontend**: React 19 · Vite 7 · TailwindCSS 4 · Axios
- **Mobile**: Flutter 3.41 · Dart 3.11 · http · image_picker
- **Database**: PostgreSQL (Neon) · SQLite (local fallback)
- **Hosting**: Render (backend + frontend)

---

© 2026 CivicEase. A Government of India Initiative.
