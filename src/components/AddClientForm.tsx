import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types';
import { UserPlus, FileText, Phone, User, DollarSign } from 'lucide-react';

interface AddClientFormProps {
  onAddClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const AddClientForm = ({ onAddClient, onCancel }: AddClientFormProps) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    phone: '',
    idNumber: '',
    balance: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.invoiceNumber.trim() || !formData.clientName.trim()) {
      toast({
        title: 'Error',
        description: 'Invoice number and client name are required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const balance = parseFloat(formData.balance) || 0;
      
      onAddClient({
        invoiceNumber: formData.invoiceNumber.trim(),
        clientName: formData.clientName.trim(),
        phone: formData.phone.trim() || undefined,
        idNumber: formData.idNumber.trim() || undefined,
        balance,
      });

      toast({
        title: 'Success',
        description: 'Client added successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add client. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-elegant animate-slide-in">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Add New Client</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Invoice Number *
            </Label>
            <Input
              id="invoiceNumber"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="Enter invoice number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Client Name *
            </Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              ID Number
            </Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter ID number"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="balance" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Initial Balance
            </Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="professional"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Adding...' : 'Add Client'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
