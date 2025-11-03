'use client';

import WaterBillForm from '@/components/water/water-bill-form';
import Image from 'next/image';

export default function PaymentPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Image
        src="https://images.unsplash.com/photo-1589389846663-18548a43a088?q=80&w=2070&auto=format&fit=crop"
        alt="Water background"
        fill
        className="object-cover -z-10 opacity-30"
        data-ai-hint="water texture"
      />
      <div className="w-full max-w-md">
        <WaterBillForm />
      </div>
    </div>
  );
}
