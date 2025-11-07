'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateCompliantInvoice } from '@/ai/flows/generate-compliant-invoice';
import { addInvoice } from '@/lib/firebase/firestore';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La descripción no puede estar vacía.'),
  amount: z.coerce.number().positive('El monto debe ser positivo.'),
});

const generateInvoiceSchema = z.object({
  items: z.array(invoiceItemSchema).min(1, 'Debe haber al menos un item.'),
});

type GenerateInvoiceFormData = z.infer<typeof generateInvoiceSchema>;

interface GenerateInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  customerName: string;
}

export function GenerateInvoiceDialog({
  isOpen,
  onOpenChange,
  userId,
  customerName,
}: GenerateInvoiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateInvoiceFormData>({
    resolver: zodResolver(generateInvoiceSchema),
    defaultValues: {
      items: [{ description: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = async (data: GenerateInvoiceFormData) => {
    setLoading(true);
    try {
        const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
        const invoiceNumber = `INV-${Date.now()}`;
        const currentDate = new Date().toISOString();

        // 1. Call AI to get compliant invoice text (optional for DB save)
        const aiResponse = await generateCompliantInvoice({
            customerName,
            invoiceNumber,
            items: data.items,
            totalAmount,
            date: currentDate,
            companyName: "Agua Pura S.A. de C.V.",
            companyAddress: "Calle de la pureza 123, Colonia Hidratación, C.P. 54321",
            companyContact: "Tel: 555-123-4567",
            legalRequirements: "Factura válida para fines fiscales en México."
        });

      // 2. Save the structured data to Firestore
      await addInvoice(userId, {
        customerName,
        invoiceNumber,
        issueDate: currentDate,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // Due in 30 days
        totalAmount,
        status: 'Draft',
        items: data.items,
        compliantText: aiResponse.compliantInvoice, // Store the AI-generated text
      });

      toast({
        title: 'Recibo Generado',
        description: `El recibo ${invoiceNumber} ha sido creado exitosamente.`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el recibo. Por favor, intente de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generar Nuevo Recibo</DialogTitle>
          <DialogDescription>
            Añada los items para el nuevo recibo para {customerName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                   <div className='flex-grow grid grid-cols-5 gap-2'>
                    <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                        <FormItem className='col-span-3'>
                            <FormLabel className={index !== 0 ? 'sr-only' : ''}>Descripción</FormLabel>
                            <FormControl>
                            <Input placeholder="Ej: Consumo de agua" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <FormLabel className={index !== 0 ? 'sr-only' : ''}>Monto</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                   </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ description: '', amount: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Item
            </Button>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar Recibo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
