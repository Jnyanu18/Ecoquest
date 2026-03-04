# EcoQuest | Gamified Environmental Education

EcoQuest is a production-grade, SIH-level SaaS platform designed to gamify sustainability education in schools and colleges. It features real-time carbon tracking, institutional analytics, and an AI-powered mentorship system.

## 🚀 Features

- **Dual Dashboard System**: Tailored views for Students (XP/Badges) and Teachers (Verification/Analytics).
- **Carbon Audit Engine**: Precise CO2 calculation based on travel, energy, and diet data.
- **AI Eco Mentor**: Personalized sustainability coaching powered by Gemini 2.0 Flash.
- **Learning Hub**: Interactive modules with AI-generated summaries and quizzes.
- **Gamification**: XP-based leveling, streaks, and impact badges.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, ShadCN UI.
- **Backend**: Firebase (Auth, Firestore).
- **AI**: Genkit with Google Gemini.

## 📦 How to Push to GitHub

To push this project to your own GitHub repository, follow these steps:

1. **Create a new repository** on GitHub (do not initialize with a README).
2. **Open your terminal** in the project root.
3. **Initialize Git**:
   ```bash
   git init
   ```
4. **Add your files**:
   ```bash
   git add .
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "Initial commit: EcoQuest Platform"
   ```
6. **Rename branch** (optional but recommended):
   ```bash
   git branch -M main
   ```
7. **Add Remote**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
8. **Push**:
   ```bash
   git push -u origin main
   ```

## ⚙️ Firebase Setup

Ensure you have your Firebase configuration updated in `src/firebase/config.ts`. You will also need to enable:
- Email/Password and Google Authentication.
- Cloud Firestore in Production mode.

---
Built for a greener tomorrow.