
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface WithdrawDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  balance: number;
}

const WithdrawDialog = ({
  isOpen,
  onOpenChange,
  withdrawAmount,
  setWithdrawAmount,
  onSubmit,
  isProcessing,
  balance
}: WithdrawDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Retirar fondos</DialogTitle>
          <DialogDescription>
            Introduce el monto y los datos bancarios para realizar tu retiro.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Monto a retirar (USDQ)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                min="10"
                max={balance}
                step="0.01"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
              <div className="flex justify-between text-xs">
                <span className="text-qubic-gray-dark">Mínimo: 10 USDQ</span>
                <span className="text-qubic-gray-dark">Disponible: {balance.toFixed(2)} USDQ</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank-name">Nombre del banco</Label>
              <Input
                id="bank-name"
                type="text"
                placeholder="Ej. Banco Santander"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                type="text"
                placeholder="ES12 3456 7890 1234 5678 9012"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-holder">Titular de la cuenta</Label>
              <Input
                id="account-holder"
                type="text"
                placeholder="Nombre y apellidos"
                required
              />
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Los retiros pueden tardar entre 1-3 días laborables en 
                procesarse. Sólo puedes retirar fondos a una cuenta bancaria a tu nombre.
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-qubic-blue hover:bg-qubic-blue-dark" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Retirar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
