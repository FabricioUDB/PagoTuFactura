'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ExternalLink, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  issueDate: string;
}

// Mock data for invoices from January to November 2025
const mockInvoices: Invoice[] = [
  { id: 'inv-nov-2025', issueDate: '2025-11-24T00:00:00Z' },
  { id: 'inv-oct-2025', issueDate: '2025-10-24T00:00:00Z' },
  { id: 'inv-sep-2025', issueDate: '2025-09-24T00:00:00Z' },
  { id: 'inv-aug-2025', issueDate: '2025-08-24T00:00:00Z' },
  { id: 'inv-jul-2025', issueDate: '2025-07-24T00:00:00Z' },
  { id: 'inv-jun-2025', issueDate: '2025-06-24T00:00:00Z' },
  { id: 'inv-may-2025', issueDate: '2025-05-24T00:00:00Z' },
  { id: 'inv-apr-2025', issueDate: '2025-04-24T00:00:00Z' },
  { id: 'inv-mar-2025', issueDate: '2025-03-24T00:00:00Z' },
  { id: 'inv-feb-2025', issueDate: '2025-02-24T00:00:00Z' },
  { id: 'inv-jan-2025', issueDate: '2025-01-24T00:00:00Z' },
];

export default function AccountStatementPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Using mock data instead of Firestore query
  const invoices = mockInvoices;
  const isLoading = false; // Mock loading state
  const error = null; // Mock error state

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Estado de cuenta</h1>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Historial de Recibos</CardTitle>
          <CardDescription>Aquí puede ver y descargar sus recibos anteriores.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {/* Error alert removed since we are mocking data and error is always null */}

          {!isLoading && !error && (
            !invoices || invoices.length === 0 ? (
              <p>No se encontraron recibos.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Generado</TableHead>
                    <TableHead>Fecha de Corte</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="capitalize">{format(new Date(invoice.issueDate), 'MMMM yyyy', { locale: es })}</TableCell>
                      <TableCell>{format(new Date(invoice.issueDate), 'MMM dd yyyy', { locale: es })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/account-statement/${invoice.id}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                          </Button>
                        </div>
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
  );
}
