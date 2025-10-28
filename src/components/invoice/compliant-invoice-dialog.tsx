'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCompliantInvoice, type GenerateCompliantInvoiceInput } from '@/ai/flows/generate-compliant-invoice';
import type { Invoice } from '@/lib/types';

interface CompliantInvoiceDialogProps {
  invoice: Invoice;
}

export function CompliantInvoiceDialog({ invoice }: CompliantInvoiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compliantInvoiceText, setCompliantInvoiceText] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setCompliantInvoiceText('');
    try {
      const input: GenerateCompliantInvoiceInput = {
        customerName: invoice.customerName,
        invoiceNumber: invoice.invoiceNumber,
        items: invoice.items.map(item => ({
          description: item.description,
          amount: item.quantity * item.price,
        })),
        totalAmount: invoice.totalAmount,
        date: invoice.invoiceDate.toDate().toLocaleDateString(),
        companyName: 'Centro de Facturas',
        companyAddress: '123 Calle de la Innovación, Ciudad Tecnológica, 12345',
        companyContact: 'contacto@centrodefacturas.com',
        legalRequirements: 'Requisitos estándar de facturación en España. Incluir condiciones de pago: Neto 30 días.',
      };

      const result = await generateCompliantInvoice(input);
      setCompliantInvoiceText(result.compliantInvoice);
    } catch (error) {
      toast({
        title: 'Error de Generación',
        description: 'No se pudo generar la factura compatible.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(compliantInvoiceText);
    toast({ title: '¡Copiado!', description: 'Texto de la factura copiado al portapapeles.' });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={handleGenerate}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generar Factura Legal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Texto de Factura Legalmente Válido</DialogTitle>
          <DialogDescription>
            Este texto de factura es generado por IA para cumplir con los estándares legales. Revísalo antes de enviarlo.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-[50vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm font-mono">{compliantInvoiceText}</pre>
          )}
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cerrar</Button>
            <Button onClick={handleCopy} disabled={!compliantInvoiceText || isLoading}>
                <Copy className="mr-2 h-4 w-4" /> Copiar Texto
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
