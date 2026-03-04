# EcoQuest | Gamified Environmental Education

EcoQuest is a production-grade, SIH-level SaaS platform designed to gamify sustainability education in schools and colleges. It features real-time carbon tracking, institutional analytics, and an AI-powered mentorship system.

## 🚀 Features

- **Dual Dashboard System**: Tailored views for Students (XP/Badges) and Teachers (Verification/Analytics).
- **Carbon Audit Engine**: Precise CO2 calculation based on travel, energy, and diet data.
- **AI Eco Mentor**: Personalized sustainability coaching powered by Gemini 2.0 Flash.
- **Learning Hub**: Interactive modules with AI-generated summaries and quizzes.
- **CI/CD Ready**: Includes GitHub Actions for seamless deployment to Firebase App Hosting.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, ShadCN UI.
- **Backend**: Firebase (Auth, Firestore).
- **AI**: Genkit with Google Gemini 2.0 Flash.

## 📦 How to Push to GitHub

Since I am an AI assistant, I cannot execute the `git push` command for you. Please follow these steps in your local terminal:

1. **Create a new repository** on [GitHub](https://github.com/new).
2. **Open your terminal** in the project root.
3. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EcoQuest Production Build"
   ```
4. **Link to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
5. **Push**:
   ```bash
   git push -u origin main
   ```

## ⚙️ Firebase Setup

Ensure you have your Firebase configuration updated in `src/firebase/config.ts`. 
- **Required Services**: Auth (Google/Password), Firestore (Production Mode), App Hosting.
- **Environment Variables**: Set `NEXT_PUBLIC_FIREBASE_API_KEY`, etc., in your GitHub Secrets or App Hosting dashboard.

---
Built for a greener tomorrow.