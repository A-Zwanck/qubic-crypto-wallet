
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Info, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/navbar';  // Updated path from @/components/Navbar
import Footer from '@/components/Footer';
import SupportChat from '@/components/SupportChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Mock data for chart
const performanceData = [
  { name: 'Ene', value: 1000 },
  { name: 'Feb', value: 1050 },
  { name: 'Mar', value: 1080 },
  { name: 'Abr', value: 1150 },
  { name: 'May', value: 1250 },
  { name: 'Jun', value: 1200 },
  { name: 'Jul', value: 1350 },
  { name: 'Ago', value: 1450 },
  { name: 'Sep', value: 1550 },
  { name: 'Oct', value: 1700 },
  { name: 'Nov', value: 1850 },
  { name: 'Dic', value: 2000 },
];

// Mock data for allocation pie chart
const allocationData = [
  { name: 'USDQ', value: 35 },
  { name: 'Staking', value: 25 },
  { name: 'Farming', value: 20 },
  { name: 'Index', value: 15 },
  { name: 'Otro', value: 5 },
];

const COLORS = ['#0071e3', '#40a0ff', '#6e48ff', '#c47aff', '#86868b'];

const Dashboard = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedReportType, setSelectedReportType] = useState('annual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Total balance and earnings calculations
  const currentBalance = 2000;
  const initialInvestment = 1000;
  const totalEarnings = currentBalance - initialInvestment;
  const earningsPercentage = (totalEarnings / initialInvestment) * 100;

  // Mock investments
  const investments = [
    { id: 1, project: 'Qubic Staking', invested: 250, current: 268.75, roi: '7.5%', date: '2023-05-10' },
    { id: 2, project: 'USDQ Farming', invested: 500, current: 551, roi: '10.2%', date: '2023-04-22' },
    { id: 3, project: 'Qubic DeFi Index', invested: 250, current: 282, roi: '12.8%', date: '2023-06-05' },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  const handleDownloadReport = () => {
    // Simulate report download
    setIsReportDialogOpen(false);
    setReportGenerated(false);
  };

  return (
    <div className="min-h-screen bg-qubic-gray flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-qubic-black mb-2">Dashboard</h1>
            <p className="text-qubic-gray-dark max-w-3xl">
              Visualiza el rendimiento de tus inversiones y genera informes fiscales automáticos para Hacienda.
            </p>
          </div>
          
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Balance Total</CardTitle>
                <CardDescription>Valor actual de tus activos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-qubic-black">{currentBalance.toFixed(2)} USDQ</div>
                <p className="text-qubic-gray-dark text-sm">≈ {currentBalance.toFixed(2)} €</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ganancias Totales</CardTitle>
                <CardDescription>Beneficios acumulados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-green-600">+{totalEarnings.toFixed(2)} USDQ</span>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    +{earningsPercentage.toFixed(2)}%
                  </span>
                </div>
                <p className="text-qubic-gray-dark text-sm">Desde la inversión inicial</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Informe Fiscal</CardTitle>
                <CardDescription>Genera informes para Hacienda</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsReportDialogOpen(true)}
                  className="w-full bg-qubic-blue hover:bg-qubic-blue-dark flex items-center justify-center"
                >
                  <FileText size={18} className="mr-2" />
                  Generar informe
                </Button>
                <p className="text-qubic-gray-dark text-sm mt-2">
                  Informes detallados para tu declaración de impuestos
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rendimiento de Inversiones</CardTitle>
              <CardDescription>Evolución del valor de tus activos en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#86868b' }}
                      axisLine={{ stroke: '#e6e6e6' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#86868b' }}
                      axisLine={{ stroke: '#e6e6e6' }}
                      tickFormatter={(value) => `${value} USDQ`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} USDQ`, 'Valor']}
                      labelFormatter={(label) => `Mes: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0071e3" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0071e3' }}
                      activeDot={{ r: 6, stroke: '#0071e3', strokeWidth: 2, fill: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Portfolio and Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cartera de Inversiones</CardTitle>
                <CardDescription>Detalle de tus inversiones activas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-3 text-qubic-gray-dark font-medium">Proyecto</th>
                        <th className="text-right p-3 text-qubic-gray-dark font-medium">Invertido</th>
                        <th className="text-right p-3 text-qubic-gray-dark font-medium">Valor Actual</th>
                        <th className="text-right p-3 text-qubic-gray-dark font-medium">ROI</th>
                        <th className="text-right p-3 text-qubic-gray-dark font-medium">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment) => (
                        <tr 
                          key={investment.id} 
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 font-medium text-qubic-black">{investment.project}</td>
                          <td className="p-3 text-right">{investment.invested.toFixed(2)} USDQ</td>
                          <td className="p-3 text-right">{investment.current.toFixed(2)} USDQ</td>
                          <td className="p-3 text-right text-green-600">+{investment.roi}</td>
                          <td className="p-3 text-right text-qubic-gray-dark">
                            {new Date(investment.date).toLocaleDateString('es-ES')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Activos</CardTitle>
                <CardDescription>Asignación de tus inversiones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Porcentaje']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #f0f0f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4">
                  <ul className="space-y-2">
                    {allocationData.map((item, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          <span className="text-qubic-gray-dark">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tax Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Fiscal</CardTitle>
              <CardDescription>Resumen fiscal para tus declaraciones de impuestos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-qubic-blue/5 rounded-lg p-4 mb-4 flex items-start">
                <Info size={20} className="text-qubic-blue mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-qubic-black font-medium">Generación automática de informes fiscales</p>
                  <p className="text-qubic-gray-dark mt-1">
                    QUBIC WALLET facilita el cumplimiento de tus obligaciones fiscales con informes 
                    detallados y adaptados a los requerimientos de la Agencia Tributaria.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center text-qubic-black">
                    <FileText size={18} className="mr-2 text-qubic-blue" />
                    Informe Anual
                  </h3>
                  <p className="text-qubic-gray-dark text-sm">
                    Resumen completo de todas tus transacciones e inversiones del año.
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setIsReportDialogOpen(true);
                      setSelectedReportType('annual');
                    }}
                    className="mt-2 p-0 h-auto text-qubic-blue font-medium"
                  >
                    Generar informe
                    <ArrowUpRight size={14} className="ml-1" />
                  </Button>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center text-qubic-black">
                    <FileText size={18} className="mr-2 text-qubic-blue" />
                    Informe Trimestral
                  </h3>
                  <p className="text-qubic-gray-dark text-sm">
                    Detalle de operaciones por trimestre para declaraciones trimestrales.
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setIsReportDialogOpen(true);
                      setSelectedReportType('quarterly');
                    }}
                    className="mt-2 p-0 h-auto text-qubic-blue font-medium"
                  >
                    Generar informe
                    <ArrowUpRight size={14} className="ml-1" />
                  </Button>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center text-qubic-black">
                    <FileText size={18} className="mr-2 text-qubic-blue" />
                    Informe Modelo 720
                  </h3>
                  <p className="text-qubic-gray-dark text-sm">
                    Específico para declaración de bienes en el extranjero.
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setIsReportDialogOpen(true);
                      setSelectedReportType('model720');
                    }}
                    className="mt-2 p-0 h-auto text-qubic-blue font-medium"
                  >
                    Generar informe
                    <ArrowUpRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Tax Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generar Informe para Hacienda</DialogTitle>
            <DialogDescription>
              Selecciona el año y el tipo de informe que necesitas generar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="report-year" className="block text-sm font-medium text-qubic-black mb-1">
                Año fiscal
              </label>
              <select
                id="report-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
              >
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="report-type" className="block text-sm font-medium text-qubic-black mb-1">
                Tipo de informe
              </label>
              <select
                id="report-type"
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
              >
                <option value="annual">Informe Anual</option>
                <option value="quarterly">Informe Trimestral</option>
                <option value="model720">Modelo 720 (Bienes en el extranjero)</option>
              </select>
            </div>
            
            {selectedReportType === 'quarterly' && (
              <div>
                <label htmlFor="quarter" className="block text-sm font-medium text-qubic-black mb-1">
                  Trimestre
                </label>
                <select
                  id="quarter"
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
                >
                  <option value="Q1">T1 (Enero - Marzo)</option>
                  <option value="Q2">T2 (Abril - Junio)</option>
                  <option value="Q3">T3 (Julio - Septiembre)</option>
                  <option value="Q4">T4 (Octubre - Diciembre)</option>
                </select>
              </div>
            )}
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Información importante:</strong> Este informe contiene todos los datos necesarios 
                para tu declaración de impuestos, incluyendo transacciones, ganancias y pérdidas patrimoniales.
              </p>
            </div>
            
            {reportGenerated ? (
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <FileText size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-qubic-black mb-1">Informe generado con éxito</h3>
                <p className="text-qubic-gray-dark text-sm mb-4">
                  Tu informe está listo para ser descargado
                </p>
                <Button 
                  onClick={handleDownloadReport}
                  className="bg-qubic-blue hover:bg-qubic-blue-dark flex items-center"
                >
                  <Download size={18} className="mr-2" />
                  Descargar informe
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={cn(
                  "w-full bg-qubic-blue hover:bg-qubic-blue-dark",
                  isGenerating && "opacity-80 cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando informe...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FileText size={18} className="mr-2" />
                    Generar informe
                  </span>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <SupportChat />
    </div>
  );
};

export default Dashboard;
