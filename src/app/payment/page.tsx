'use client';

import WaterBillForm from '@/components/water/water-bill-form';
import Image from 'next/image';

export default function PaymentPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Image
        src="https://unsplash.com/photos/person-opening-faucet-Vve7XkiUq_Y"
        alt="Water flowing from a modern tap"
        fill
        className="object-cover -z-10 opacity-20"
        data-ai-hint="water tap"
      />
      <div className="w-full max-w-md">
        <WaterBillForm />
      </div>
    </div>
  );
}
