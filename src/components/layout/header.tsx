'use client';

import { Droplet, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center">
        <Droplet className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">Agua Pura</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {!isUserLoading &&
          (user ? (
            <>
              <span>{user.displayName || user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          ))}
      </div>
    </header>
  );
}
