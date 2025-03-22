
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Clock, CreditCard, ExternalLink, Filter, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupportChat from '@/components/SupportChat';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const Wallet = () => {
  const [balance] = useState(1250);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock transaction data
  const transactions = [
    { id: 1, type: 'deposit', amount: 250, date: '2023-05-15T14:30:00', status: 'completed' },
    { id: 2, type: 'withdraw', amount: 100, date: '2023-05-14T10:15:00', status: 'completed' },
    { id: 3, type: 'deposit', amount: 500, date: '2023-05-10T09:45:00', status: 'completed' },
    { id: 4, type: 'withdraw', amount: 75, date: '2023-05-05T16:20:00', status: 'completed' },
    { id: 5, type: 'deposit', amount: 300, date: '2023-05-01T11:10:00', status: 'completed' },
    { id: 6, type: 'withdraw', amount: 150, date: '2023-04-28T13:25:00', status: 'completed' },
    { id: 7, type: 'deposit', amount: 450, date: '2023-04-20T15:40:00', status: 'completed' },
    { id: 8, type: 'withdraw', amount: 200, date: '2023-04-15T09:05:00', status: 'completed' },
  ];

  // Filter transactions based on search term and filter type
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.amount.toString().includes(searchTerm) || 
      new Date(transaction.date).toLocaleDateString().includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle deposit logic here
    setIsDepositOpen(false);
    setDepositAmount('');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdraw logic here
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen bg-qubic-gray flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
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
                      onClick={() => setIsDepositOpen(true)}
                      className="flex-1 flex items-center justify-center bg-qubic-blue hover:bg-qubic-blue-dark"
                    >
                      <ArrowDown size={18} className="mr-2" />
                      Depositar
                    </Button>
                    <Button 
                      onClick={() => setIsWithdrawOpen(true)}
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
                    onClick={() => setIsDepositOpen(true)}
                    className="bg-qubic-blue hover:bg-qubic-blue-dark"
                  >
                    Comprar ahora
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transactions History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-bold text-qubic-black mb-4 md:mb-0">Historial de movimientos</h2>
              
              <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
                  <Input 
                    type="text"
                    placeholder="Buscar transacciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-60"
                  />
                </div>
                
                <div className="relative">
                  <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
                  >
                    <option value="all">Todos los movimientos</option>
                    <option value="deposit">Solo depósitos</option>
                    <option value="withdraw">Solo retiros</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-3 text-qubic-gray-dark font-medium">Tipo</th>
                      <th className="text-left p-3 text-qubic-gray-dark font-medium">Fecha</th>
                      <th className="text-left p-3 text-qubic-gray-dark font-medium">Hora</th>
                      <th className="text-right p-3 text-qubic-gray-dark font-medium">Monto</th>
                      <th className="text-right p-3 text-qubic-gray-dark font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr 
                        key={transaction.id} 
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center">
                            <div 
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                                transaction.type === 'deposit' 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-blue-100 text-blue-600"
                              )}
                            >
                              {transaction.type === 'deposit' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                            </div>
                            <span className="font-medium">
                              {transaction.type === 'deposit' ? 'Depósito' : 'Retiro'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-qubic-gray-dark">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="p-3 text-qubic-gray-dark">
                          {formatTime(transaction.date)}
                        </td>
                        <td className={cn(
                          "p-3 text-right font-medium",
                          transaction.type === 'deposit' ? "text-green-600" : "text-blue-600"
                        )}>
                          {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toFixed(2)} USDQ
                        </td>
                        <td className="p-3 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock size={40} className="mx-auto text-qubic-gray-dark mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-qubic-black mb-1">No hay transacciones</h3>
                <p className="text-qubic-gray-dark">
                  No se encontraron transacciones que coincidan con tu búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
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
              <form onSubmit={handleDeposit}>
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
                  <Button type="button" variant="outline" onClick={() => setIsDepositOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-qubic-blue hover:bg-qubic-blue-dark">
                    Depositar
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
                <Button onClick={() => setIsDepositOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Retirar fondos</DialogTitle>
            <DialogDescription>
              Introduce el monto y los datos bancarios para realizar tu retiro.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleWithdraw} className="mt-4">
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
              <Button type="button" variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-qubic-blue hover:bg-qubic-blue-dark">
                Retirar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <SupportChat />
    </div>
  );
};

export default Wallet;
