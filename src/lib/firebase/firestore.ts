'use server';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import type { Invoice, InvoiceFormData } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const INVOICES_COLLECTION = 'invoices';

export async function addInvoice(invoiceData: InvoiceFormData, userId: string) {
  try {
    // Generate a unique invoice number
    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

    const dataToSave = {
        ...invoiceData,
        invoiceNumber,
        userId,
        invoiceDate: Timestamp.fromDate(invoiceData.invoiceDate),
        dueDate: Timestamp.fromDate(invoiceData.dueDate),
        totalAmount: invoiceData.items.reduce((acc, item) => acc + item.quantity * item.price, 0),
    };

    addDoc(collection(db, INVOICES_COLLECTION), dataToSave)
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: INVOICES_COLLECTION,
                    operation: 'create',
                    requestResourceData: dataToSave,
                })
            )
        });

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getInvoices(userId: string): Promise<Invoice[]> {
  const q = query(
    collection(db, INVOICES_COLLECTION),
    where('userId', '==', userId),
    orderBy('invoiceDate', 'desc')
  );

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Invoice[];
  } catch (error) {
    errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
            path: INVOICES_COLLECTION,
            operation: 'list',
        })
    );
    // Return empty array on error to prevent crashes
    return [];
  }
}

export async function getInvoiceById(invoiceId: string, userId: string): Promise<Invoice | null> {
    const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userId === userId) {
            return { id: docSnap.id, ...docSnap.data() } as Invoice;
        } else {
            // If the doc doesn't exist, it's not a permission error.
            // If it exists but userId doesn't match, it's an application-level concern,
            // but a permission error would have already been thrown by rules if set up correctly.
            // If rules are loose, we still might get here.
            if (docSnap.exists() && docSnap.data().userId !== userId) {
                 errorEmitter.emit(
                    'permission-error',
                    new FirestorePermissionError({
                        path: docRef.path,
                        operation: 'get',
                    })
                );
            }
            return null;
        }
    } catch (error) {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: docRef.path,
                operation: 'get',
            })
        );
        return null;
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']) {
    const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
    try {
        await updateDoc(docRef, { status });
        return { success: true, error: null };
    } catch(error) {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: { status }
            })
        );
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteInvoice(invoiceId: string) {
    const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
    try {
        await deleteDoc(docRef);
        return { success: true, error: null };
    } catch (error) {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            })
        );
        return { success: false, error: (error as Error).message };
    }
}
