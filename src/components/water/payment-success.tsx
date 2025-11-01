'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Printer } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentSuccessProps {
  amount: number;
  onReset: () => void;
}

export function PaymentSuccess({ amount, onReset }: PaymentSuccessProps) {
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
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <div id="printable-area">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <CardTitle className="text-2xl">Pago Exitoso</CardTitle>
            <CardDescription>El pago de ${amount.toFixed(2)} ha sido procesado.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 grid gap-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de Pago:</span>
                    <span className="font-semibold">{format(new Date(), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Método de Pago:</span>
                    <span className="font-semibold">Tarjeta de Crédito</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto Pagado:</span>
                    <span className="font-bold text-lg">${amount.toFixed(2)}</span>
                </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Este es un comprobante de pago no fiscal.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 no-print">
            <Button onClick={handlePrint} className="w-full">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir PDF
            </Button>
            <Button onClick={onReset} variant="outline" className="w-full">
              Realizar otro pago
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
