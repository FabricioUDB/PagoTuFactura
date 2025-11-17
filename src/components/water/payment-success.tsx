'use client';

import { Button } from '@/components/ui/button';
import { Droplet, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@/firebase';
import type { BillDetails } from './water-bill-form';

interface PaymentSuccessProps {
  billDetails: BillDetails;
  cardHolder: string;
  cardNumber: string;
  onReset: () => void;
}

export function PaymentSuccess({ billDetails, cardHolder, cardNumber, onReset }: PaymentSuccessProps) {
  const { user } = useUser();
  const paymentDate = new Date();
  const transactionId = Math.floor(100000 + Math.random() * 900000);
  const authNumber = Math.floor(100000 + Math.random() * 900000);
  const maskedCardNumber = `############${cardNumber.slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 2rem;
              font-family: sans-serif;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              border: 1px solid #ccc;
              padding: 2rem;
              border-radius: 0.5rem;
            }
            h1, h2, h3, p {
              margin: 0;
            }
          }
        `}
      </style>
      <div id="printable-area" className="w-full max-w-2xl mx-auto font-sans">
        <div className="border rounded-lg p-6 md:p-8 space-y-8 print-container">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b">
            <div className="flex items-center gap-4">
              <Droplet className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-xl font-bold">ADACECAM S.A. de C.V.</h1>
                <p className="text-sm text-muted-foreground">
                  Calle de la pureza 123, Colonia Hidratación, C.P. 54321
                </p>
                <p className="text-sm text-muted-foreground">Tel: 555-123-4567</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">Fecha:</p>
              <p>{format(paymentDate, 'dd/MM/yyyy')}</p>
              <p className="font-semibold mt-2">Hora:</p>
              <p>{format(paymentDate, 'HH:mm:ss a')}</p>
            </div>
          </div>
          
          <div className="text-center">
             <h2 className="text-2xl font-semibold">Comprobante de Pago</h2>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Información</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between"><span className="font-semibold">Id Transacción:</span><span>{transactionId}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Número Tarjeta:</span><span>{maskedCardNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Código Cliente:</span><span>{billDetails.accountNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Tipo Tarjeta:</span><span>Crédito/Débito</span></div>
                <div className="flex justify-between"><span className="font-semibold">Nombre:</span><span>{cardHolder}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Marca Tarjeta:</span><span>N/A</span></div>
                <div className="flex justify-between"><span className="font-semibold">Forma de Pago:</span><span>Pago Electrónico</span></div>
                <div className="flex justify-between"><span className="font-semibold">Banco:</span><span>POS ADACECAM</span></div>
                <div className="flex justify-between"><span className="font-semibold">Fecha:</span><span>{format(paymentDate, "dd/MM/yyyy HH:mm:ss a")}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Número Autorización:</span><span>{authNumber}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Monto Total:</span><span className="font-bold text-base">${billDetails.amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Referencia:</span><span>{billDetails.period.replace(' ', '-')}</span></div>
            </div>
          </div>
          
          {/* Details Table */}
          <div className="border-t pt-4">
              <table className="w-full text-sm">
                  <thead>
                      <tr className="border-b">
                          <th className="text-left font-semibold p-2">Descripción</th>
                          <th className="text-center font-semibold p-2">Cantidad</th>
                          <th className="text-right font-semibold p-2">Precio</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td className="p-2">Pago de recibo de agua - <span className="capitalize">{billDetails.period}</span></td>
                          <td className="text-center p-2">1</td>
                          <td className="text-right p-2">${billDetails.amount.toFixed(2)}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-8 no-print">
          <Button onClick={handlePrint} className="w-full">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Comprobante
          </Button>
          <Button onClick={onReset} variant="outline" className="w-full">
            Realizar otro pago
          </Button>
        </div>
      </div>
    </>
  );
}
