'use client';

import WaterBillForm from '@/components/water/water-bill-form';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PaymentPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-water-payment');

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover -z-10 opacity-20"
          data-ai-hint={heroImage.imageHint}
        />
      )}

      <div className="w-full max-w-md">
        <WaterBillForm />
      </div>
    </div>
  );
}
