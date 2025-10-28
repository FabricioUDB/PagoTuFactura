'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/auth-provider';
import { getInvoices } from '@/lib/firebase/firestore';
import type { Invoice } from '@/lib/types';
import InvoiceStatusBadge from '@/components/invoice/invoice-status-badge';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getInvoices(user.uid)
        .then(data => {
          setInvoices(data);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleRowClick = (invoiceId: string) => {
    router.push(`/dashboard/invoices/${invoiceId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Facturas</CardTitle>
          <CardDescription>Gestiona tus facturas aquí.</CardDescription>
        </div>
        <Button asChild size="sm" className="gap-1">
          <Link href="/dashboard/invoices/new">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Nueva Factura</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factura</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando facturas...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron facturas. <Link href="/dashboard/invoices/new" className="text-primary hover:underline">Crea una ahora</Link>!
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} onClick={() => handleRowClick(invoice.id)} className="cursor-pointer">
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    {format(invoice.invoiceDate.toDate(), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    ${invoice.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
