'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const blogPosts = PlaceHolderImages.filter((img) => img.id.startsWith('blog-'));
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-water-payment');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="container px-4 md:px-6 relative z-20">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Paga tu recibo de agua, fácil y rápido
            </h1>
            <p className="max-w-[700px] text-lg md:text-xl">
              Consulta tu saldo y realiza tu pago en línea de forma segura. Además, descubre consejos para cuidar el agua.
            </p>
            <div className="flex justify-center pt-4">
              <Link href="/payment">
                <Button size="lg">Pagar mi recibo</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Consejos para el Cuidado del Agua</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Pequeñas acciones pueden tener un gran impacto. Aprende a conservar el recurso más valioso de nuestro planeta.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <Image
                  src={post.imageUrl}
                  width={400}
                  height={225}
                  alt={post.description}
                  data-ai-hint={post.imageHint}
                  className="aspect-video w-full overflow-hidden rounded-t-xl object-cover"
                />
                <CardHeader>
                  <CardTitle>{post.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Descubre formas sencillas de reducir tu consumo de agua en casa y contribuir a un futuro más
                    sostenible.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
