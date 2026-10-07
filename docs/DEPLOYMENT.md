# Cafe Eleganza - Production Deployment Guide

## 1. Prerequisites
- **Google Cloud Platform (GCP) Account** with Firebase Blaze Plan enabled (pay-as-you-go).
- Node.js 20+ and npm installed.
- Firebase CLI installed (`npm install -g firebase-tools`).
- Docker installed (for containerizing backend to Cloud Run).

## 2. Environment Variables (.env)
Copy `.env.example` to `.env` and fill all required values:
```bash
cp .env.example .env
```
Ensure you set:
- `FIREBASE_PROJECT_ID`
- `ADMIN_EMAILS="admin@cafeeleganza.pk"`
- `WHATSAPP_NUMBER="+923005240034"`
- `NOTIFICATION_EMAILS="orders@cafeeleganza.pk"`

## 3. Local Development
Run the combined client and Express backend server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 4. Deploying Firestore & Storage Rules
Login and set project:
```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

## 5. Building & Deploying the Full-Stack Application
### Frontend to Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

### Backend to Google Cloud Run:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/cafe-eleganza-api
gcloud run deploy cafe-eleganza-api \
  --image gcr.io/YOUR_PROJECT_ID/cafe-eleganza-api \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000
```

## 6. Custom Domain & SSL
1. Go to Firebase Console -> Hosting -> Add custom domain.
2. Enter `cafeeleganza.pk` or `order.cafeeleganza.pk`.
3. Add the provided A and TXT verification records to your domain registrar (e.g. PKNIC / Cloudflare).
4. SSL certificates provision automatically within 1 hour.
