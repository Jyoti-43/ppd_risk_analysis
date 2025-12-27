"use client"

import { useEffect } from "react"
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"

export function AnonymousAuthInit() {
  useEffect(() => {
    const auth = getAuth()
    let unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((e) => console.warn("Anonymous sign-in failed", e))
      }
    })
    return () => unsub?.()
  }, [])

  return null
}
