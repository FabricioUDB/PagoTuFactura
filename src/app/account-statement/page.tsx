'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useUser, useFirestore } from '@/firebase';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import {
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';

interface Invoice {
  id: string;
  issueDate: string;
}

export default function AccountStatementPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirigir a /login si no hay usuario
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Cargar facturas desde Firestore
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user || !firestore) return;

      try {
        setIsLoading(true);
        setError(null);

        const invoicesRef = collection(
          firestore,
          `users/${user.uid}/invoices`,
        );
        const q = query(invoicesRef, orderBy('issueDate', 'desc'));
        const snapshot = await getDocs(q);

        const data: Invoice[] = snapshot.docs.map((doc) => {
          const docData = doc.data() as DocumentData;
          return {
            id: doc.id,
            issueDate: String(docData.issueDate),
          };
        });

        setInvoices(data);
      } catch (err) {
        console.error('Error loading invoices', err);
        setError(
          'No se pudieron cargar sus recibos. Por favor, intente de nuevo más tarde.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!isUserLoading && user) {
      fetchInvoices();
    }
  }, [user, isUserLoading, firestore]);

  // Skeleton mientras se verifica el usuario
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
          <CardDescription>
            Aquí puede ver y descargar sus recibos anteriores.
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
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <>
              {invoices.length === 0 ? (
                <p className="mt-2">No se encontraron recibos.</p>
              ) : (
                <Table className="mt-4">
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
                        <TableCell className="capitalize">
                          {format(
                            new Date(invoice.issueDate),
                            'MMMM yyyy',
                            { locale: es },
                          )}
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(invoice.issueDate),
                            'MMM dd yyyy',
                            { locale: es },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={`/account-statement/${invoice.id}`}
                              target="_blank"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
