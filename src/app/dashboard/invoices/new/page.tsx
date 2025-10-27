import InvoiceForm from '@/components/invoice/invoice-form';

export default function NewInvoicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  );
}
