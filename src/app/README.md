
# EcoQuest | Gamified Environmental Education

EcoQuest is a production-grade, SIH-level SaaS platform designed to gamify sustainability education in schools and colleges.

## 🚀 How to Push to GitHub

Run these commands in your local terminal:

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EcoQuest Production Build"
   ```
2. **Link to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/Jnyanu18/Ecoquest.git
   ```
3. **Push**:
   ```bash
   git push -u origin main
   ```

## ⚙️ Firebase Setup

Ensure you have your Firebase configuration updated in `src/firebase/config.ts`. 
- **Required Services**: Auth (Google/Password), Firestore (Production Mode), App Hosting.
- **Environment Variables**: Set `NEXT_PUBLIC_FIREBASE_API_KEY`, etc., in your GitHub Secrets or App Hosting dashboard.

---
Built for a greener tomorrow.
