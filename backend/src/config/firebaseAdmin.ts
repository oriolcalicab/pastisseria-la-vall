import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getRequiredEnv } from './env.js'

const createFirebaseApp = () =>
  initializeApp({
    credential: cert({
      projectId: getRequiredEnv('FIREBASE_PROJECT_ID'),
      clientEmail: getRequiredEnv('FIREBASE_CLIENT_EMAIL'),
      privateKey: getRequiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
  })

export const firebaseAuth = getAuth(getApps().length > 0 ? getApp() : createFirebaseApp())