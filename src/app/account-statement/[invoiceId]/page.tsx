'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  compliantText: string;
}

export default function InvoiceReceiptPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const invoiceDocQuery = useMemoFirebase(() => {
    if (!firestore || !user || !invoiceId) return null;
    return doc(firestore, `users/${user.uid}/invoices`, invoiceId);
  }, [firestore, user, invoiceId]);

  const { data: invoice, isLoading, error } = useDoc<Invoice>(invoiceDocQuery);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <main className="container mx-auto p-4 md:p-8">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No se pudo cargar el recibo. Verifique que tenga los permisos necesarios o que el recibo exista.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && !invoice && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Encontrado</AlertTitle>
            <AlertDescription>
              El recibo que está buscando no existe.
            </AlertDescription>
          </Alert>
        )}
        
        {invoice && (
          <div>
            <div id="printable-receipt" className="prose max-w-none border p-8 rounded-lg bg-white">
                <pre className='whitespace-pre-wrap font-sans text-sm'>
                    {invoice.compliantText}
                </pre>
            </div>
            <Button onClick={handlePrint} className="w-full mt-4 no-print">
              <Download className="mr-2 h-4 w-4" />
              Imprimir / Descargar PDF
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
