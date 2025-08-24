import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types';
import { CreditCard, Phone, User, FileText, Calendar } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onPayment: (clientId: string) => void;
}

export const ClientCard = ({ client, onPayment }: ClientCardProps) => {
  const balanceColor = client.balance > 0 ? 'text-success' : 'text-muted-foreground';
  const badgeVariant = client.balance > 0 ? 'default' : 'secondary';

  return (
    <Card className="p-6 shadow-card hover:shadow-elegant transition-all duration-200 animate-slide-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            {client.clientName}
          </h3>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              <span>Invoice: {client.invoiceNumber}</span>
            </div>
            
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{client.phone}</span>
              </div>
            )}
            
            {client.idNumber && (
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>ID: {client.idNumber}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>Added: {client.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <Badge variant={badgeVariant} className="mb-2">
            {client.balance > 0 ? 'balance' : 'paid'}
          </Badge>
          <p className={`text-xl font-bold ${balanceColor}`}>
            ₪{client.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="professional"
          size="sm"
          disabled={client.balance <= 0}
          onClick={() => onPayment(client.id)}
          className="flex-1"
        >
          <CreditCard className="w-4 h-4" />
          Process Payment
        </Button>
      </div>
    </Card>
  );
};
