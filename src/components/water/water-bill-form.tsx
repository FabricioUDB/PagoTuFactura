'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, subMonths, addDays, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { PaymentDialog } from './payment-dialog';
import { useToast } from '@/hooks/use-toast';

const waterBillSchema = z.object({
  accountNumber: z.string().regex(/^\d{4}$/, 'Debe ser un número de 4 dígitos.'),
  billingPeriod: z.string().min(1, 'Debes seleccionar un período.'),
});

type WaterBillFormData = z.infer<typeof waterBillSchema>;

interface BillDetails {
  amount: number;
  dueDate: Date;
  period: string;
}

const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: es }),
    };
});

const WATER_RATE_PER_M3 = 15;
const WATER_CONSUMPTION_M3 = 3.04;

export default function WaterBillForm() {
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<BillDetails | null>(null);
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaterBillFormData>({
    resolver: zodResolver(waterBillSchema),
    defaultValues: {
      accountNumber: '',
      billingPeriod: '',
    },
  });

  const onSubmit = (data: WaterBillFormData) => {
    setLoading(true);
    setBill(null);

    // Simulate API call
    setTimeout(() => {
      const [year, month] = data.billingPeriod.split('-').map(Number);
      const periodDate = new Date(year, month - 1);
      
      const newBill: BillDetails = {
        amount: WATER_RATE_PER_M3 * WATER_CONSUMPTION_M3,
        dueDate: addDays(endOfMonth(periodDate), 5),
        period: format(periodDate, 'MMMM yyyy', { locale: es }),
      };
      setBill(newBill);
      setLoading(false);
    }, 1000);
  };

  const handlePaymentSuccess = () => {
    toast({
        title: "Pago Exitoso",
        description: `El pago de ${bill?.amount.toFixed(2)} ha sido procesado.`,
    });
    setPaymentDialogOpen(false);
    setBill(null);
    form.reset();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ingrese la información del recibo</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de cuenta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período del recibo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            <span className="capitalize">{month.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Consultar
              </Button>
            </form>
          </Form>
        </CardContent>

        {bill && (
          <CardFooter>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Recibo de agua</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Monto:</span>
                        <span className="font-semibold">${bill.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Vencimiento:</span>
                        <span className="font-semibold">{format(bill.dueDate, 'dd/MM/yyyy')}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setPaymentDialogOpen(true)}>Pagar ahora</Button>
                </CardFooter>
            </Card>
          </CardFooter>
        )}
      </Card>
      {bill && (
        <PaymentDialog
            isOpen={isPaymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            amount={bill.amount}
            onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
