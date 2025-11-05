
'use client';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface UserProfile {
    id: string;
    name: string;
    email: string;
}

/**
 * Creates a user profile document in Firestore.
 * @param userId The user's unique ID.
 * @param data The user profile data to save.
 */
export async function createUserProfile(userId: string, data: UserProfile) {
    const userDocRef = doc(db, 'users', userId);
    setDoc(userDocRef, data).catch((error) => {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: data,
            })
        );
        console.error("Error creating user profile: ", error);
    });
}

/**
 * Retrieves a user profile from Firestore.
 * @param userId The user's unique ID.
 * @returns The user profile data or null if it doesn't exist.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, 'users', userId);
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch(error) {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'get',
            })
        );
        console.error("Error getting user profile: ", error);
        return null;
    }
}
