
import React from 'react';
import { ArrowDown, ArrowUp, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WalletCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const WalletCard = ({ balance, onDeposit, onWithdraw }: WalletCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-qubic-black mb-6">Tu Wallet</h1>
          <div className="bg-qubic-gray rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-qubic-blue rounded-full flex items-center justify-center text-white mr-3 font-bold">
                Q
              </div>
              <div>
                <p className="font-medium text-lg">USDQ</p>
                <p className="text-sm text-qubic-gray-dark">Stablecoin</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-qubic-black">{balance.toFixed(2)} USDQ</h2>
              <p className="text-qubic-gray-dark">≈ {balance.toFixed(2)} €</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onDeposit}
                className="flex-1 flex items-center justify-center bg-qubic-blue hover:bg-qubic-blue-dark"
              >
                <ArrowDown size={18} className="mr-2" />
                Depositar
              </Button>
              <Button 
                onClick={onWithdraw}
                variant="outline"
                className="flex-1 flex items-center justify-center border-qubic-blue text-qubic-blue hover:bg-qubic-blue/5"
              >
                <ArrowUp size={18} className="mr-2" />
                Retirar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl">
          <div className="h-full flex flex-col justify-center items-center text-center p-6">
            <div className="w-16 h-16 bg-qubic-blue/10 rounded-full flex items-center justify-center mb-4">
              <CreditCard size={30} className="text-qubic-blue" />
            </div>
            <h3 className="text-xl font-semibold text-qubic-black mb-2">Compra cripto sin comisiones</h3>
            <p className="text-qubic-gray-dark mb-6">
              Aprovecha la tecnología Qubic para comprar y vender criptoactivos sin pagar comisiones de red.
            </p>
            <Button 
              onClick={onDeposit}
              className="bg-qubic-blue hover:bg-qubic-blue-dark"
            >
              Comprar ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
