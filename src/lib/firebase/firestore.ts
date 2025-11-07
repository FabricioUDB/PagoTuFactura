
'use client';

import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from './config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface UserProfile {
    id: string;
    name: string;
    email: string;
}

interface InvoiceItem {
    description: string;
    amount: number;
}

interface Invoice {
    customerName: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
    items: InvoiceItem[];
    compliantText: string;
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

/**
 * Adds a new invoice for a user.
 * @param userId The ID of the user for whom the invoice is being created.
 * @param invoiceData The data for the new invoice.
 */
export async function addInvoice(userId: string, invoiceData: Invoice) {
    const invoicesCollectionRef = collection(db, 'users', userId, 'invoices');
    try {
        await addDoc(invoicesCollectionRef, {
            userId: userId, // Add the userId to the invoice data for security rules
            ...invoiceData
        });
    } catch (error) {
         errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: invoicesCollectionRef.path,
                operation: 'create',
                requestResourceData: { userId, ...invoiceData }
            })
        );
        console.error("Error adding invoice: ", error);
        // Re-throw the error to be caught by the calling function's try/catch block
        throw error;
    }
}
