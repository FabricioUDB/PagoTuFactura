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

const INVOICES_COLLECTION = 'invoices';

export async function addInvoice(invoiceData: InvoiceFormData, userId: string) {
  try {
    // Generate a unique invoice number
    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

    await addDoc(collection(db, INVOICES_COLLECTION), {
      ...invoiceData,
      invoiceNumber,
      userId,
      invoiceDate: Timestamp.fromDate(invoiceData.invoiceDate),
      dueDate: Timestamp.fromDate(invoiceData.dueDate),
      totalAmount: invoiceData.items.reduce((acc, item) => acc + item.quantity * item.price, 0),
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
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Invoice[];
}

export async function getInvoiceById(invoiceId: string, userId: string): Promise<Invoice | null> {
  const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists() && docSnap.data().userId === userId) {
    return { id: docSnap.id, ...docSnap.data() } as Invoice;
  } else {
    return null;
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']) {
    const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
    try {
        await updateDoc(docRef, { status });
        return { success: true, error: null };
    } catch(error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteInvoice(invoiceId: string) {
    const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
    try {
        await deleteDoc(docRef);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
