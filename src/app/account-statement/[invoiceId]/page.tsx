'use client';

import { useUser } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InvoiceReceiptPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handlePrint = () => {
    window.print();
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // Parse invoice ID to get date context (e.g., inv-nov-2025)
  const getInvoiceData = (id: string) => {
    try {
      const parts = id.split('-');
      if (parts.length !== 3) throw new Error('Invalid ID');

      const monthMap: Record<string, string> = {
        'jan': 'Enero', 'feb': 'Febrero', 'mar': 'Marzo', 'apr': 'Abril',
        'may': 'Mayo', 'jun': 'Junio', 'jul': 'Julio', 'aug': 'Agosto',
        'sep': 'Septiembre', 'oct': 'Octubre', 'nov': 'Noviembre', 'dec': 'Diciembre'
      };

      const monthNumMap: Record<string, string> = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
      };

      const monthKey = parts[1];
      const year = parts[2];
      const monthName = monthMap[monthKey] || monthKey;
      const monthNum = monthNumMap[monthKey] || '01';

      // Generate consistent random-ish data based on ID
      const randomId = parseInt(year + monthNum) * 123;

      return {
        date: `24/${monthNum}/${year}`,
        time: '10:30:00 AM',
        transactionId: `705${randomId.toString().slice(0, 3)}`,
        authNumber: `496${randomId.toString().slice(0, 3)}`,
        reference: `${monthName}-${year}`,
        description: `Pago de recibo de agua - ${monthName} ${year}`,
        amount: '$45.60'
      };
    } catch (e) {
      // Fallback for unknown IDs
      return {
        date: '24/11/2025',
        time: '10:30:00 AM',
        transactionId: '705913',
        authNumber: '496205',
        reference: 'Noviembre-2025',
        description: 'Pago de recibo de agua - Noviembre 2025',
        amount: '$45.60'
      };
    }
  };

  const data = getInvoiceData(invoiceId);

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
            margin: 0;
            padding: 20px;
            border: none;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure background graphics (colors) are printed */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center">

        <div id="printable-receipt" className="w-full max-w-2xl bg-white p-8 rounded-lg border shadow-sm text-slate-800">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b pb-6">
            <div className="flex gap-4">
              <div className="text-blue-600">
                <Droplets className="h-12 w-12" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900">ADACECAM S.A. de C.V.</h1>
                <p className="text-sm text-slate-600">Calle de la pureza 123, Colonia Hidratación, C.P. 54321</p>
                <p className="text-sm text-slate-600">Tel: 555-123-4567</p>
              </div>
            </div>
            <div className="text-right text-sm font-medium">
              <p>Fecha:</p>
              <p className="mb-1">{data.date}</p>
              <p>Hora:</p>
              <p>{data.time}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Comprobante de Pago</h2>
          </div>

          {/* Information Grid */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Información</h3>
            <div className="grid grid-cols-1 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Id Transacción:</span>
                <span>{data.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Número Tarjeta:</span>
                <span>############1234</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Código Cliente:</span>
                <span>1234</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Tipo Tarjeta:</span>
                <span>Crédito/Débito</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Nombre:</span>
                <span className="capitalize">{user?.displayName || 'Cliente'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Marca Tarjeta:</span>
                <span>N/A</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Forma de Pago:</span>
                <span>Pago Electrónico</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Banco:</span>
                <span>POS ADACECAM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Fecha:</span>
                <span>{data.date} {data.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Número Autorización:</span>
                <span>{data.authNumber}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-slate-700">Monto Total:</span>
                <span className="font-bold text-lg">{data.amount}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-bold text-slate-700">Referencia:</span>
                <span>{data.reference}</span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="mb-8">
            <div className="flex justify-between border-b pb-2 mb-2 font-bold text-sm">
              <span>Descripción</span>
              <div className="flex gap-8">
                <span>Cantidad</span>
                <span>Precio</span>
              </div>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span>{data.description}</span>
              <div className="flex gap-12">
                <span className="w-8 text-center">1</span>
                <span>{data.amount}</span>
              </div>
            </div>
            <div className="border-t mt-4"></div>
          </div>
        </div>

        <Button onClick={handlePrint} className="w-full max-w-2xl mt-6 no-print" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Imprimir / Descargar PDF
        </Button>

      </main>
    </>
  );
}
