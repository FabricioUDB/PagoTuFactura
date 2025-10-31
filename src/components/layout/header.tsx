import { Droplet } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center">
        <Droplet className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">Agua Pura</span>
      </Link>
    </header>
  );
}
