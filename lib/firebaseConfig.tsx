import { initializeApp, getApps } from "firebase/app"
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics"

import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR-xek0iOGwOONALgeIdjFB9jXZMimSs4",
  authDomain: "epdsscreening-8b06d.firebaseapp.com",
  projectId: "epdsscreening-8b06d",
  storageBucket: "epdsscreening-8b06d.firebasestorage.app",
  messagingSenderId: "911801919098",
  appId: "1:911801919098:web:71f758fc106ae7bc13fdc3",
  measurementId: "G-LV6ZCLS2EW"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Analytics is only available in the browser; guard to avoid SSR errors
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) getAnalytics(app)
  })
}

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app


