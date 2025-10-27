import type { Timestamp } from 'firebase/firestore';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: Timestamp;
  dueDate: Timestamp;
  items: InvoiceItem[];
  totalAmount: number;
  status: InvoiceStatus;
  userId: string;
  notes?: string;
}
