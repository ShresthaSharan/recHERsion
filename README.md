# CycleSense AI

## Firebase setup

1. Create a Firebase project and register a web app.
2. Enable **Authentication → Email/Password** and create a Cloud Firestore database.
3. Copy `.env.example` to `.env.local` and fill in the Firebase web app configuration values. These are public client configuration values; do not put service-account credentials or private keys in this file.
4. Deploy the included user-scoped Firestore rules with `firebase deploy --only firestore:rules` from a Firebase CLI session authenticated to your project.
5. Restart Vite with `npm run dev` after changing environment variables.

Until all required Firebase environment variables are present, sign-up and sign-in are disabled and protected application routes require a real authenticated Firebase user. Cycle and journal records, profile data, and preferences are stored under `users/{uid}`. Gemini is not configured.

## Commands

- `npm run dev` — start the Vite development server
- `npm run build` — type-check and build the production frontend
"# recHERsion" 
