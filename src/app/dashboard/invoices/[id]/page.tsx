'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { getInvoiceById, deleteInvoice } from '@/lib/firebase/firestore';
import type { Invoice } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import InvoiceStatusBadge from '@/components/invoice/invoice-status-badge';
import { format } from 'date-fns';
import { CompliantInvoiceDialog } from '@/components/invoice/compliant-invoice-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';


export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && id) {
      getInvoiceById(id as string, user.uid)
        .then(data => {
          if (data) {
            setInvoice(data);
          } else {
            router.push('/dashboard'); // Not found or not authorized
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          router.push('/dashboard');
        });
    }
  }, [user, id, router]);
  
  const handleDelete = async () => {
    if (!invoice) return;
    setDeleting(true);
    const result = await deleteInvoice(invoice.id);
    setDeleting(false);
    if (result.success) {
      toast({ title: "Éxito", description: "Factura eliminada."});
      router.push('/dashboard');
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive'});
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!invoice) {
    return <div className="text-center py-10">Factura no encontrada.</div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Facturas
            </Button>
            <div className="flex gap-2">
                <CompliantInvoiceDialog invoice={invoice} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={deleting}>
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente esta factura.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Factura {invoice.invoiceNumber}</CardTitle>
              <CardDescription>
                Para: {invoice.customerName} ({invoice.customerEmail})
              </CardDescription>
            </div>
            <InvoiceStatusBadge status={invoice.status} className="text-base px-4 py-1" />
          </div>
          <div className="flex space-x-8 text-sm text-muted-foreground pt-4">
            <div>
              <p className="font-semibold text-foreground">Fecha de Factura</p>
              <p>{format(invoice.invoiceDate.toDate(), 'PPP')}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Fecha de Vencimiento</p>
              <p>{format(invoice.dueDate.toDate(), 'PPP')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${invoice.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6">
                <h4 className="font-semibold">Notas</h4>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
