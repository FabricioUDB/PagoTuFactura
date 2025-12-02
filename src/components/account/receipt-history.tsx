'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Eye, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

interface Invoice {
    id: string;
    monthIndex: number;
    amount: number;
    issueDate: Date;
    monthName: string;
    cutoffDate: string;
}

// Generate invoices from January to November 2025
const generateInvoices = (): Invoice[] => {
    const invoices: Invoice[] = [];
    const year = 2025;
    // 0 = Jan, 10 = Nov
    for (let month = 0; month <= 10; month++) {
        const date = new Date(year, month, 24);
        invoices.push({
            id: `inv-${year}-${month}`,
            monthIndex: month,
            amount: 45.60,
            issueDate: date,
            monthName: format(date, 'MMMM yyyy', { locale: es }),
            cutoffDate: format(date, 'MMM dd yyyy', { locale: es }),
        });
    }
    // Return newest first (Nov -> Jan)
    return invoices.reverse();
};

export function ReceiptHistory() {
    const [invoices] = useState<Invoice[]>(generateInvoices());
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleView = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleDownloadPDF = (invoice: Invoice) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Header ---
        // Logo (Water Drop Shape)
        doc.setFillColor(66, 133, 244); // Blue color
        doc.setDrawColor(66, 133, 244);
        doc.setLineWidth(0.5);

        // Draw a simple drop shape
        doc.lines([[0, -5], [3, 5], [0, 3], [-3, -5]], 25, 25, [1, 1], 'F', true);
        doc.circle(25, 28, 3, 'F');

        // Company Info
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('ADACECAM S.A. de C.V.', 40, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Calle de la pureza 123, Colonia', 40, 25);
        doc.text('Hidratación, C.P. 54321', 40, 30);
        doc.text('Tel: 555-123-4567', 40, 35);

        // Date/Time (Right side)
        const now = new Date();
        const dateStr = format(now, 'dd/MM/yyyy');
        const timeStr = format(now, 'hh:mm:ss a');

        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha:', 160, 20, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.text(dateStr, 190, 20, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Hora:', 160, 28, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.text(timeStr, 190, 28, { align: 'right' });

        // --- Title ---
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Comprobante de Pago', pageWidth / 2, 55, { align: 'center' });

        // --- Information Section ---
        doc.setFontSize(12);
        doc.text('Información', 20, 70);
        doc.setDrawColor(200);
        doc.line(20, 72, 190, 72);

        const startY = 80;
        const col1X = 20;
        const col2X = 110;
        const lineHeight = 8;

        doc.setFontSize(9);

        // Row 1
        doc.setFont('helvetica', 'bold');
        doc.text('Id Transacción:', col1X, startY);
        doc.setFont('helvetica', 'normal');
        doc.text('918347', 100, startY, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Número', col2X, startY);
        doc.setFont('helvetica', 'normal');
        doc.text('############1234', 190, startY, { align: 'right' });
        doc.text('Tarjeta:', col2X, startY + 4);

        // Row 2
        doc.setFont('helvetica', 'bold');
        doc.text('Código Cliente:', col1X, startY + lineHeight * 2);
        doc.setFont('helvetica', 'normal');
        doc.text('1234', 100, startY + lineHeight * 2, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Tipo Tarjeta:', col2X, startY + lineHeight * 2);
        doc.setFont('helvetica', 'normal');
        doc.text('Crédito/Débito', 190, startY + lineHeight * 2, { align: 'right' });

        // Row 3
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre:', col1X, startY + lineHeight * 3);
        doc.setFont('helvetica', 'normal');
        doc.text('Fabricio Castro', 100, startY + lineHeight * 3, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Marca Tarjeta:', col2X, startY + lineHeight * 3);
        doc.setFont('helvetica', 'normal');
        doc.text('N/A', 190, startY + lineHeight * 3, { align: 'right' });

        // Row 4
        doc.setFont('helvetica', 'bold');
        doc.text('Forma de', col1X, startY + lineHeight * 4);
        doc.text('Pago:', col1X, startY + lineHeight * 4 + 4);
        doc.setFont('helvetica', 'normal');
        doc.text('Pago', 100, startY + lineHeight * 4, { align: 'right' });
        doc.text('Electrónico', 100, startY + lineHeight * 4 + 4, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Banco:', col2X, startY + lineHeight * 4);
        doc.setFont('helvetica', 'normal');
        doc.text('POS ADACECAM', 190, startY + lineHeight * 4, { align: 'right' });

        // Row 5
        const row5Y = startY + lineHeight * 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha:', col1X, row5Y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${invoice.cutoffDate} ${timeStr}`, 100, row5Y, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Número', col2X, row5Y);
        doc.text('Autorización:', col2X, row5Y + 4);
        doc.setFont('helvetica', 'normal');
        doc.text('374934', 190, row5Y, { align: 'right' });

        // Row 6
        const row6Y = row5Y + lineHeight * 2;
        doc.setFont('helvetica', 'bold');
        doc.text('Monto Total:', col1X, row6Y);
        doc.setFontSize(11);
        doc.text(`$${invoice.amount.toFixed(2)}`, 100, row6Y, { align: 'right' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Referencia:', col2X, row6Y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${invoice.monthName.toLowerCase().replace(' ', '-')}`, 190, row6Y, { align: 'right' });

        // --- Description Table ---
        const tableY = row6Y + 20;

        // Table Header
        doc.setDrawColor(220);
        doc.line(20, tableY, 190, tableY);

        doc.setFont('helvetica', 'bold');
        doc.text('Descripción', 20, tableY + 6);
        doc.text('Cantidad', 140, tableY + 6, { align: 'center' });
        doc.text('Precio', 190, tableY + 6, { align: 'right' });

        doc.line(20, tableY + 10, 190, tableY + 10); // Header bottom line

        // Table Content
        const contentY = tableY + 18;
        doc.setFont('helvetica', 'normal');
        doc.text(`Pago de recibo de agua - ${invoice.monthName}`, 20, contentY);
        doc.text('1', 140, contentY, { align: 'center' });
        doc.text(`$${invoice.amount.toFixed(2)}`, 190, contentY, { align: 'right' });

        // Footer Total
        doc.setFont('helvetica', 'bold');
        doc.text('Total a Pagar', 140, contentY + 17, { align: 'center' });
        doc.text(`$${invoice.amount.toFixed(2)}`, 190, contentY + 17, { align: 'right' });

        doc.save(`Recibo_${invoice.monthName.replace(' ', '_')}.pdf`);
    };

    return (
        <>
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
                            <TableCell className="capitalize">{invoice.monthName}</TableCell>
                            <TableCell className="capitalize">{invoice.cutoffDate}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleView(invoice)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                                        <FileDown className="mr-2 h-4 w-4" />
                                        PDF
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Detalle del Recibo</DialogTitle>
                        <DialogDescription>
                            Periodo: <span className="capitalize">{selectedInvoice?.monthName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInvoice && (
                        <div className="space-y-6 py-4">
                            <div className="rounded-lg border p-4 space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium">Fecha de Corte</span>
                                    <span>{selectedInvoice.cutoffDate}</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium">Folio</span>
                                    <span>{selectedInvoice.id.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-lg">Total Pagado</span>
                                    <span className="font-bold text-lg text-primary">${selectedInvoice.amount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => handleDownloadPDF(selectedInvoice)}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Descargar PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
