
import React from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DepositDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  depositAmount: string;
  setDepositAmount: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
}

const DepositDialog = ({
  isOpen,
  onOpenChange,
  depositAmount,
  setDepositAmount,
  onSubmit,
  isProcessing
}: DepositDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Depositar fondos</DialogTitle>
          <DialogDescription>
            Elige el método y el monto que deseas depositar en tu wallet.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="card" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="card">Tarjeta</TabsTrigger>
            <TabsTrigger value="transfer">Transferencia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="mt-4">
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Monto a depositar (USDQ)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    min="10"
                    step="0.01"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                  />
                  <p className="text-xs text-qubic-gray-dark">Mínimo: 10 USDQ</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Fecha de caducidad</Label>
                    <Input
                      id="expiry-date"
                      type="text"
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      required
                    />
                  </div>
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
                    'Depositar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="transfer" className="mt-4">
            <div className="space-y-4">
              <div className="bg-qubic-gray p-4 rounded-lg">
                <p className="text-sm text-qubic-black mb-1 font-medium">Detalles de la cuenta bancaria</p>
                <div className="space-y-2 text-sm text-qubic-gray-dark">
                  <div className="flex justify-between">
                    <span>Beneficiario:</span>
                    <span className="font-medium text-qubic-black">QUBIC WALLET S.L.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IBAN:</span>
                    <span className="font-medium text-qubic-black">ES12 3456 7890 1234 5678 9012</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BIC/SWIFT:</span>
                    <span className="font-medium text-qubic-black">QUBICESMMXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concepto:</span>
                    <span className="font-medium text-qubic-black">QUBIC-12345678</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Las transferencias pueden tardar entre 1-3 días laborables en 
                  procesarse. Asegúrate de incluir el concepto exacto para que podamos identificar tu transferencia.
                </p>
              </div>
              
              <a 
                href="#" 
                className="text-qubic-blue hover:underline flex items-center text-sm font-medium"
              >
                <ExternalLink size={16} className="mr-1" />
                Descargar instrucciones de transferencia
              </a>
            </div>
            
            <DialogFooter className="mt-6">
              <Button onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;
