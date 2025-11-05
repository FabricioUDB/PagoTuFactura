
'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth } from './config';
import { loginSchema, signupSchema } from '@/lib/schemas';
import type { z } from 'zod';
import { createUserProfile, getUserProfile } from './firestore';

export async function signUpWithEmail(data: z.infer<typeof signupSchema>) {
  const { email, password } = data;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      email: user.email!,
      name: user.email!.split('@')[0], // Use part of email as name for now
      id: user.uid,
    });
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function signInWithEmail(data: z.infer<typeof loginSchema>) {
  const { email, password } = data;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists, if not, create it
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        email: user.email!,
        name: user.displayName || user.email!.split('@')[0],
        id: user.uid,
      });
    }

    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}
