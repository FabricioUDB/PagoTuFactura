'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GenerateInvoiceDialog } from '@/components/accountant/generate-invoice-dialog';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
}

export default function UserInvoicesPage() {
  const firestore = useFirestore();
  const params = useParams();
  const userId = params.userId as string;
  const { user: accountantUser } = useUser();

  const [isGenerateDialogOpen, setGenerateDialogOpen] = useState(false);

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return query(collection(firestore, `users/${userId}/invoices`));
  }, [firestore, userId]);
  
  const userDocQuery = useMemoFirebase(() => {
    if(!firestore || !userId) return null;
    return doc(firestore, 'users', userId);
  }, [firestore, userId]);
  
  // We don't use the result of useDoc, but it's here to show how you might fetch user data
  // const { data: customerUser, isLoading: isUserLoading } = useDoc(userDocQuery);
  const [customerUser, setCustomerUser] = useState({ name: '' }); // Placeholder

  const { data: invoices, isLoading, error } = useCollection<Invoice>(invoicesQuery);

  const statusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Sent': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusTranslation = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'Pagado';
      case 'Sent': return 'Enviado';
      case 'Overdue': return 'Vencido';
      case 'Draft': return 'Borrador';
      default: return status;
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/accountant">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Recibos del Cliente</h1>
                    <p className="text-muted-foreground">Viendo los recibos para el usuario {userId}</p>
                </div>
            </div>
            <Button onClick={() => setGenerateDialogOpen(true)}>
                <PlusCircle className="mr-2" />
                Generar Recibo
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Lista de Recibos</CardTitle>
                <CardDescription>
                    Un resumen de todos los recibos generados para este cliente.
                </CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        No se pudieron cargar los recibos. Es posible que no tenga los permisos necesarios.
                    </AlertDescription>
                </Alert>
            )}

            {!isLoading && !error && (
                !invoices || invoices.length === 0 ? (
                    <p>No se encontraron recibos para este usuario.</p>
                ) : (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Nro. Recibo</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha Emisión</TableHead>
                            <TableHead>Fecha Venc.</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.customerName}</TableCell>
                                <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant(invoice.status)}>
                                        {getStatusTranslation(invoice.status)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                )
            )}
            </CardContent>
        </Card>
      </div>
      <GenerateInvoiceDialog 
        isOpen={isGenerateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        userId={userId}
        customerName={customerUser?.name || 'Cliente'} // Fallback name
      />
    </div>
  );
}
