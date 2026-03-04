
# EcoQuest | Gamified Environmental Education Platform

EcoQuest is a production-grade, SIH-level SaaS platform designed to gamify sustainability education in schools and colleges. It features real-time carbon tracking, institutional analytics, and an AI-powered mentorship system.

## 🚀 Key Features

- **Dual Dashboard System**: Adaptive UI for Students (XP, Streaks, Badges) and Teachers (Verification, Analytics).
- **Carbon Audit Engine**: High-precision CO2 calculation for travel, electricity, and diet.
- **AI Eco Mentor**: Personalized sustainability coaching powered by **Gemini 2.0 Flash**.
- **Institutional Analytics**: Real-time aggregation of school-wide impact metrics.
- **Verification Loop**: Teacher-led proof-of-work verification system with image support.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, ShadCN UI.
- **Backend**: Firebase (Authentication, Firestore, App Hosting).
- **AI Engine**: Google Genkit + Gemini 2.0 Flash.
- **Monitoring**: Integrated Firebase Error Emitter for Security Rules debugging.

## 📦 How to Push to GitHub

To push this project to your repository, run the following commands in your local terminal:

```bash
git init
git add .
git commit -m "Initial commit: EcoQuest Production"
git branch -M main
git remote add origin https://github.com/Jnyanu18/Ecoquest.git
git push -u origin main
```

## ⚙️ Deployment & CI/CD

This project is configured for **Firebase App Hosting**. A GitHub Action is included in `.github/workflows/firebase-app-hosting.yml` to automate builds.

### Environment Variables:
Ensure the following secrets are set in your GitHub repository and Firebase Console:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `GEMINI_API_KEY`

---
Built for a greener tomorrow.
