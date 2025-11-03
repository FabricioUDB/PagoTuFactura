'use client';

import WaterBillForm from '@/components/water/water-bill-form';
import Image from 'next/image';

export default function PaymentPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Image
        src="/pago.jpg"
        alt="Water payment background"
        fill
        className="object-cover -z-10 opacity-30"
        data-ai-hint="water payment"
      />
      <div className="w-full max-w-md">
        <WaterBillForm />
      </div>
    </div>
  );
}
