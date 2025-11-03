'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountantPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAccountant, setIsAccountant] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else {
        user.getIdTokenResult().then((idTokenResult) => {
          const claims = idTokenResult.claims;
          if (claims.role !== 'accountant') {
            router.push('/');
          } else {
            setIsAccountant(true);
          }
          setAuthChecked(true);
        });
      }
    }
  }, [user, isUserLoading, router]);

  if (!authChecked || !isAccountant) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Accountant Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.displayName || user?.email}. Here you can manage customer meters and generate receipts.
        </p>

        <Card>
            <CardHeader>
                <CardTitle>Customer Overview</CardTitle>
                <CardDescription>
                    View and manage customer data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Customer management features will be implemented here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
