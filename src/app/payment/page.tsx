'use client';

import WaterBillForm from '@/components/water/water-bill-form';
import Image from 'next/image';

export default function PaymentPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Image
        src="https://images.unsplash.com/photo-1599540848108-c0529b47a119?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3YXRlciUyMHRhcHxlbnwwfHx8fDE3NjIzMTY2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
