'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserList() {
  const firestore = useFirestore();
  const { user } = useUser();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users'));
  }, [firestore, user]);

  const { data: users, isLoading, error } = useCollection<User>(usersQuery);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                No se pudieron cargar los usuarios. Es posible que no tenga los permisos necesarios.
            </AlertDescription>
        </Alert>
    );
  }

  if (!users || users.length === 0) {
    return <p>No se encontraron usuarios.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Correo Electrónico</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name || 'N/A'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link href={`/accountant/users/${user.id}/invoices`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Recibos
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
