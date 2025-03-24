
import React from 'react';
import { ArrowDown, ArrowUp, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface WalletCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const WalletCard = ({ balance, onDeposit, onWithdraw }: WalletCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-qubic-black mb-4 md:mb-6">Tu Wallet</h1>
          <div className="bg-qubic-gray rounded-xl p-4 md:p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-qubic-blue rounded-full flex items-center justify-center text-white mr-3 font-bold">
                Q
              </div>
              <div>
                <p className="font-medium text-base md:text-lg">USDQ</p>
                <p className="text-xs md:text-sm text-qubic-gray-dark">Stablecoin</p>
              </div>
            </div>
            
            <div className="mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-qubic-black">{balance.toFixed(2)} USDQ</h2>
              <p className="text-sm text-qubic-gray-dark">≈ {balance.toFixed(2)} €</p>
            </div>
            
            <div className={cn("flex gap-2 md:gap-3", isMobile && "flex-col")}>
              <Button 
                onClick={onDeposit}
                className={cn(
                  "flex items-center justify-center bg-qubic-blue hover:bg-qubic-blue-dark",
                  isMobile ? "w-full" : "flex-1"
                )}
              >
                <ArrowDown size={isMobile ? 16 : 18} className="mr-2" />
                Depositar
              </Button>
              <Button 
                onClick={onWithdraw}
                variant="outline"
                className={cn(
                  "flex items-center justify-center border-qubic-blue text-qubic-blue hover:bg-qubic-blue/5",
                  isMobile ? "w-full" : "flex-1"
                )}
              >
                <ArrowUp size={isMobile ? 16 : 18} className="mr-2" />
                Retirar
              </Button>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "bg-white rounded-xl", 
          isMobile ? "mt-4" : ""
        )}>
          <div className="h-full flex flex-col justify-center items-center text-center p-4 md:p-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-qubic-blue/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <CreditCard size={isMobile ? 22 : 30} className="text-qubic-blue" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-qubic-black mb-2">Compra cripto sin comisiones</h3>
            <p className="text-sm md:text-base text-qubic-gray-dark mb-4 md:mb-6">
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
