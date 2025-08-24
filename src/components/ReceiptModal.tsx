import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Client, Payment } from '@/types';
import { Printer, Download, Check } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal = ({ payment, client, isOpen, onClose }: ReceiptModalProps) => {
const handlePrint = () => {
  const receiptContent = document.getElementById("receipt-content");
  if (receiptContent) {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Payment Receipt - ${payment?.receiptNumber || ""}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 400px; 
                margin: 0 auto; 
                padding: 20px;
                color: #333;
              }
              .receipt { 
                border: 2px solid #ddd; 
                padding: 20px; 
                background: white;
                border-radius: 8px;
              }
              .header { 
                text-align: center; 
                border-bottom: 1px solid #eee; 
                padding-bottom: 15px; 
                margin-bottom: 15px;
              }
              .title { 
                font-size: 24px; 
                font-weight: bold; 
                color: #2563eb;
                margin-bottom: 5px;
              }
              .receipt-number { 
                color: #666; 
                font-size: 14px;
              }
              .info-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 8px 0;
                padding: 4px 0;
              }
              .label { 
                font-weight: bold; 
                color: #555;
              }
              .amount { 
                font-size: 20px; 
                font-weight: bold; 
                color: #16a34a;
              }
              .footer { 
                text-align: center; 
                margin-top: 20px; 
                padding-top: 15px; 
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            ${receiptContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait until window content is loaded before printing
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // optional: close after printing
        // printWindow.close();
      };
    }
  }
};


  if (!payment || !client) return null;

  const newBalance = client.balance - payment.amount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success" />
            Payment Receipt
          </DialogTitle>
        </DialogHeader>

        <div id="receipt-content">
          <div className="receipt">
            <div className="header">
              <div className="title">QuickNet</div>
              <div className="receipt-number">Receipt #{payment.receiptNumber}</div>
            </div>

            <div className="space-y-3">
              <div className="info-row">
                <span className="label">Client Name:</span>
                <span>{client?.clientName}</span>
              </div>
              
              <div className="info-row">
                <span className="label">Invoice Number:</span>
                <span>{client?.invoiceNumber}</span>
              </div>
              
              {client?.phone && (
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span>{client?.phone}</span>
                </div>
              )}
              
              <div className="info-row">
                <span className="label">Payment Date:</span>
                <span>{payment?.timestamp?.toLocaleDateString()}</span>
              </div>
              
              <div className="info-row">
                <span className="label">Payment Time:</span>
                <span>{payment?.timestamp?.toLocaleTimeString()}</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="info-row">
                <span className="label">Payment Amount:</span>
                <span className="amount">₪{payment?.amount?.toFixed(2)}</span>
              </div>
              
              <div className="info-row">
                <span className="label">New Balance:</span>
                <span className="font-semibold text-success">₪{Number(newBalance.toFixed(2))}</span>
              </div>
            </div>

            <div className="footer">
              <p>Thank you for your payment!</p>
              <p>Generated on {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="professional"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
