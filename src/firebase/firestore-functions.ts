'use client';

import {
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  orderBy,
  collectionGroup,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Invoice, InvoiceFormData } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function getInvoicesCollection(userId: string) {
    return collection(db, 'users', userId, 'invoices');
}

function getInvoiceDoc(userId: string, invoiceId: string) {
    return doc(db, 'users', userId, 'invoices', invoiceId);
}

export async function addInvoice(invoiceData: InvoiceFormData, userId: string) {
  try {
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

    const invoicesCollection = getInvoicesCollection(userId);
    addDoc(invoicesCollection, dataToSave).catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: invoicesCollection.path,
          operation: 'create',
          requestResourceData: dataToSave,
        })
      );
    });

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getInvoices(userId: string): Promise<Invoice[]> {
  const invoicesCollection = getInvoicesCollection(userId);
  const q = query(
    invoicesCollection,
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
        path: invoicesCollection.path,
        operation: 'list',
      })
    );
    return [];
  }
}

export async function getInvoiceById(invoiceId: string, userId: string): Promise<Invoice | null> {
    const docRef = getInvoiceDoc(userId, invoiceId);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Invoice;
        } else {
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

export async function updateInvoiceStatus(invoiceId: string, userId: string, status: Invoice['status']) {
    const docRef = getInvoiceDoc(userId, invoiceId);
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

export async function deleteInvoice(invoiceId: string, userId: string) {
    const docRef = getInvoiceDoc(userId, invoiceId);
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
