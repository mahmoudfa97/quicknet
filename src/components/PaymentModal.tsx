import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Client, Payment } from '@/types';
import { CreditCard, DollarSign, User, FileText } from 'lucide-react';

interface PaymentModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onProcessPayment: (clientId: string, amount: number) => Payment | null;
  onShowReceipt: (payment: Payment, client: Client) => void;
}

export const PaymentModal = ({
  client,
  isOpen,
  onClose,
  onProcessPayment,
  onShowReceipt,
}: PaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) return;
    
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const payment = onProcessPayment(client.id, paymentAmount);
      if (payment) {
        toast({
          title: 'Success',
          description: 'Payment processed successfully!',
        });
        
        // Show receipt
        onShowReceipt(payment, client);
        
        // Reset form and close
        setAmount('');
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to process payment',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while processing payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Process Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{client.clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Invoice: {client.invoiceNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>Current Balance: </span>
              <span className="font-medium text-success">₪{client.balance.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Payment Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter payment amount"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="professional"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
