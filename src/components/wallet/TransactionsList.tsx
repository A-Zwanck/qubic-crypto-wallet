
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment';
  amount: number;
  created_at: string;
  details?: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transacciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qubic-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'investment':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      default:
        return <ArrowDownLeft className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionTitle = (type: string, details?: string) => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdraw':
        return 'Retiro';
      case 'investment':
        return details ? `Inversión en ${details}` : 'Inversión';
      default:
        return 'Transacción';
    }
  };

  const getAmountClasses = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 font-medium';
      case 'withdraw':
      case 'investment':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-700 font-medium';
    }
  };

  const formatAmount = (type: string, amount: number) => {
    switch (type) {
      case 'deposit':
        return `+${amount.toFixed(2)} USDQ`;
      case 'withdraw':
      case 'investment':
        return `-${amount.toFixed(2)} USDQ`;
      default:
        return `${amount.toFixed(2)} USDQ`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transacciones recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tienes transacciones aún
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getTransactionTitle(transaction.type, transaction.details)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(transaction.created_at), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                    </div>
                  </div>
                </div>
                <div className={getAmountClasses(transaction.type)}>
                  {formatAmount(transaction.type, transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
