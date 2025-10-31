'use client';

import WaterBillForm from '@/components/water/water-bill-form';

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <WaterBillForm />
      </div>
    </div>
  );
}
