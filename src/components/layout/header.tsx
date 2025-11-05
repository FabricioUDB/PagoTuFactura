'use client';

import { Droplet, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAccountant, setIsAccountant] = useState(false);

  useEffect(() => {
    if (user) {
      // For development, we'll show the accountant link for any logged-in user.
      // In production, you would check for the custom claim.
      user.getIdTokenResult().then((idTokenResult) => {
        const claims = idTokenResult.claims;
        // To properly test, you'd check: claims.role === 'accountant'
        // For now, we'll show it for any authenticated user.
        setIsAccountant(true); 
      });
    } else {
      setIsAccountant(false);
    }
  }, [user]);

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
              {isAccountant && (
                <Button asChild variant="ghost" size="sm">
                    <Link href="/accountant">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Contador
                    </Link>
                </Button>
              )}
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
                Iniciar Sesión
              </Link>
            </Button>
          ))}
      </div>
    </header>
  );
}
