'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSchema, type InvoiceFormData } from '@/lib/schemas';
import { useAuth } from '@/lib/auth-provider';
import { addInvoice } from '@/firebase/firestore-functions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function InvoiceForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      invoiceDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'Pending',
      items: [{ description: '', quantity: 1, price: 0 }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const totalAmount = form.watch('items').reduce((acc, item) => {
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    const price = typeof item.price === 'number' ? item.price : 0;
    return acc + quantity * price;
  }, 0);

  async function onSubmit(data: InvoiceFormData) {
    if (!user) {
      toast({ title: 'Error de Autenticación', description: 'Debes iniciar sesión.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const result = await addInvoice(data, user.uid);
    setIsLoading(false);
    if (result.success) {
      toast({ title: 'Éxito', description: 'Factura creada correctamente.' });
      router.push('/dashboard');
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField control={form.control} name="customerName" render={({ field }) => (
                <FormItem><FormLabel>Nombre del Cliente</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="customerEmail" render={({ field }) => (
                <FormItem><FormLabel>Email del Cliente</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="invoiceDate" render={({ field }) => (
                <FormItem><FormLabel>Fecha de Factura</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Elige una fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem><FormLabel>Fecha de Vencimiento</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Elige una fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Artículos</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-12 sm:col-span-5">
                      <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem><FormLabel className={cn(index !== 0 && "sr-only")}>Descripción</FormLabel><FormControl><Input {...field} placeholder="Descripción del artículo" /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                       <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem><FormLabel className={cn(index !== 0 && "sr-only")}>Cant</FormLabel><FormControl><Input type="number" {...field} placeholder="1" /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                       <FormField control={form.control} name={`items.${index}.price`} render={({ field }) => (<FormItem><FormLabel className={cn(index !== 0 && "sr-only")}>Precio</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="0.00" /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                       <FormLabel className={cn(index !== 0 && "sr-only")}>Total</FormLabel>
                       <p className="font-medium h-10 flex items-center">
                          ${(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.price`)).toFixed(2)}
                       </p>
                    </div>
                    <div className="col-span-12 sm:col-span-1 flex items-end h-full">
                       {fields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ description: '', quantity: 1, price: 0 })}>
                <Plus className="mr-2 h-4 w-4" /> Añadir Artículo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notas</FormLabel><FormControl><Textarea placeholder="Cualquier información adicional..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="space-y-2">
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pendiente</SelectItem><SelectItem value="Paid">Pagada</SelectItem><SelectItem value="Overdue">Vencida</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <div className="flex justify-end pt-4">
                        <div className="text-right">
                            <p className="text-muted-foreground">Importe Total</p>
                            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Factura
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
