
# EcoQuest | Gamified Environmental Education

EcoQuest is a production-grade, SIH-level SaaS platform designed to gamify sustainability education in schools and colleges.

## 🚀 How to Push to GitHub

If your push was **rejected**, it is because the GitHub repo has files (like a default README) that your local project doesn't have. Run these commands:

1. **Force Push (Recommended for first-time setup)**:
   ```bash
   git push -u origin main --force
   ```

2. **Alternative (Merge Remote Changes)**:
   ```bash
   git pull origin main --rebase
   git push -u origin main
   ```

## ⚙️ Firebase Setup

Ensure you have your Firebase configuration updated in `src/firebase/config.ts`. 
- **Required Services**: Auth (Google/Password), Firestore (Production Mode), App Hosting.
- **Environment Variables**: Set `NEXT_PUBLIC_FIREBASE_API_KEY`, etc., in your GitHub Secrets or App Hosting dashboard.

---
Built for a greener tomorrow.
