'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  useUser,
  useFirestore,
  useMemoFirebase,
  useCollection,
} from '@/firebase';

import { collection, query, orderBy } from 'firebase/firestore';

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

interface Invoice {
  id: string;
  issueDate: string;
}

export default function AccountStatementPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Redirigir a /login si no hay usuario
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/invoices`),
      orderBy('issueDate', 'desc'),
    );
  }, [firestore, user]);

  const {
    data: invoices,
    isLoading,
    error,
  } = useCollection<Invoice>(invoicesQuery);

  // Estado de carga inicial o cuando aún no hay usuario resuelto
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
              <div className="mt-4 space-y-2">
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
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudieron cargar sus recibos. Por favor, intente de nuevo
                más tarde.
              </AlertDescription>
            </Alert>
          )}

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
                      <TableCell className="capitalize">
                        {format(new Date(invoice.issueDate), 'MMMM yyyy', {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.issueDate), 'MMM dd yyyy', {
                          locale: es,
                        })}
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
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
