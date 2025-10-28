import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InvoiceStatus } from '@/lib/types';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const statusTranslations: Record<InvoiceStatus, string> = {
  Paid: 'Pagada',
  Pending: 'Pendiente',
  Overdue: 'Vencida',
};

export default function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const statusStyles: Record<InvoiceStatus, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-700/50',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-700/50',
  };

  return (
    <Badge
      variant="outline"
      className={cn('capitalize', statusStyles[status], className)}
    >
      {statusTranslations[status]}
    </Badge>
  );
}
