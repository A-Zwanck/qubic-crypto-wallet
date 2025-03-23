
import React, { useState, useEffect } from 'react';
import { Info, TrendingUp, ArrowRight, ExternalLink, AlertTriangle, Search, Tag, Filter } from 'lucide-react';
import Navbar from '@/components/navbar';  // Updated path from @/components/Navbar
import Footer from '@/components/Footer';
import SupportChat from '@/components/SupportChat';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useWalletService } from '@/hooks/useWalletService';
import { useToast } from '@/hooks/use-toast';

// Project data
const projects = [
  {
    id: 1,
    name: 'Qubic Staking',
    category: 'Staking',
    roi: '7.5%',
    description: 'Gana intereses pasivos al hacer staking de tus tokens QUBIC. Liquidez inmediata y recompensas diarias.',
    riskLevel: 'Bajo',
    minInvestment: 100,
    duration: 'Flexible',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGdyYWRpZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    name: 'USDQ Farming',
    category: 'Yield Farming',
    roi: '10.2%',
    description: 'Proporciona liquidez al par USDQ-USDC y gana recompensas en tokens de gobernanza Qubic.',
    riskLevel: 'Medio-Bajo',
    minInvestment: 250,
    duration: '30 días',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Ymx1ZSUyMGdyYWRpZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    name: 'Qubic DeFi Index',
    category: 'Index',
    roi: '12.8%',
    description: 'Exposición diversificada a los principales protocolos DeFi a través de un solo token índice.',
    riskLevel: 'Medio',
    minInvestment: 500,
    duration: '90 días',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGJsdWUlMjBncmFkaWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    name: 'Lending Pool',
    category: 'Lending',
    roi: '9.5%',
    description: 'Presta tus USDQ a otros usuarios y gana intereses competitivos con garantías de sobrepréstamo.',
    riskLevel: 'Medio-Bajo',
    minInvestment: 100,
    duration: 'Flexible',
    image: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Njd8fGJsdWUlMjBncmFkaWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 5,
    name: 'Qubic Launchpad',
    category: 'Investment',
    roi: '20%+',
    description: 'Invierte en proyectos prometedores antes de su lanzamiento público con acceso prioritario.',
    riskLevel: 'Alto',
    minInvestment: 1000,
    duration: '180 días',
    image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJsdWUlMjBncmFkaWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 6,
    name: 'Automatic Market Maker',
    category: 'Liquidity',
    roi: '14.3%',
    description: 'Proporciona liquidez a pares de trading populares y recibe comisiones por cada swap realizado.',
    riskLevel: 'Medio',
    minInvestment: 500,
    duration: '60 días',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGJsdWUlMjBncmFkaWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  }
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  
  // Obtener el servicio de wallet
  const {
    balance,
    isLoading,
    isProcessing,
    fetchWalletData,
    handleInvestment
  } = useWalletService();
  
  const { toast } = useToast();
  
  // Cargar el balance de la wallet al montar el componente
  useEffect(() => {
    fetchWalletData();
  }, []);

  // Filter projects based on search term, category, and risk level
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesRiskLevel = selectedRiskLevel === 'all' || project.riskLevel === selectedRiskLevel;
    
    return matchesSearch && matchesCategory && matchesRiskLevel;
  });

  const showProjectDetails = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsProjectDetailsOpen(true);
  };

  const startInvesting = () => {
    if (selectedProject) {
      setIsProjectDetailsOpen(false);
      setIsInvestDialogOpen(true);
      setInvestAmount(selectedProject.minInvestment.toString());
    }
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor, introduce un monto válido',
        variant: 'destructive',
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: 'Fondos insuficientes',
        description: 'No tienes suficiente saldo para realizar esta inversión',
        variant: 'destructive',
      });
      return;
    }
    
    // Usar el servicio de wallet para procesar la inversión
    const success = await handleInvestment(amount, selectedProject.name);
    
    if (success) {
      setIsInvestDialogOpen(false);
      setInvestAmount('');
      toast({
        title: 'Inversión realizada',
        description: `Has invertido ${amount.toFixed(2)} USDQ en ${selectedProject.name} correctamente`,
      });
    }
  };

  // Get unique categories and risk levels for filters
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const riskLevels = ['all', ...Array.from(new Set(projects.map(p => p.riskLevel)))];

  return (
    <div className="min-h-screen bg-qubic-gray flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-qubic-black mb-2">Proyectos DeFi</h1>
            <p className="text-qubic-gray-dark max-w-3xl">
              Explora y participa en proyectos DeFi seleccionados con los mejores rendimientos y niveles de riesgo variados.
              Todos operan en la red Qubic sin comisiones.
            </p>
            <div className="mt-4 bg-white p-4 rounded-lg flex items-center">
              <span className="text-qubic-gray-dark mr-2">Balance disponible:</span>
              <span className="font-bold text-qubic-blue">{balance.toFixed(2)} USDQ</span>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
                  <Input 
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
                  >
                    <option value="all">Todos los niveles de riesgo</option>
                    {riskLevels.filter(r => r !== 'all').map(riskLevel => (
                      <option key={riskLevel} value={riskLevel}>{riskLevel}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div 
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                ></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-qubic-black">{project.name}</h3>
                      <span className="inline-block bg-qubic-blue/10 text-qubic-blue text-xs rounded-full px-2 py-1">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center bg-green-50 rounded-lg px-3 py-1">
                      <TrendingUp size={16} className="text-green-600 mr-1" />
                      <span className="text-green-600 font-medium">{project.roi}</span>
                    </div>
                  </div>
                  
                  <p className="text-qubic-gray-dark text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between text-sm text-qubic-gray-dark mb-5">
                    <div>
                      <p className="font-medium text-qubic-black">Riesgo:</p>
                      <p>{project.riskLevel}</p>
                    </div>
                    <div>
                      <p className="font-medium text-qubic-black">Mín. inversión:</p>
                      <p>{project.minInvestment} USDQ</p>
                    </div>
                    <div>
                      <p className="font-medium text-qubic-black">Duración:</p>
                      <p>{project.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => showProjectDetails(project)}
                      variant="outline"
                      className="flex-1 text-qubic-blue border-qubic-blue hover:bg-qubic-blue/5"
                    >
                      Saber más
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedProject(project);
                        setIsInvestDialogOpen(true);
                        setInvestAmount(project.minInvestment.toString());
                      }}
                      className="flex-1 bg-qubic-blue hover:bg-qubic-blue-dark"
                    >
                      Invertir ahora
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <SearchIcon size={48} className="mx-auto text-qubic-gray-dark mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-qubic-black mb-2">No se encontraron proyectos</h3>
              <p className="text-qubic-gray-dark max-w-md mx-auto">
                No hay proyectos que coincidan con tus criterios de búsqueda. Intenta cambiar los filtros o buscar con otros términos.
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Project Details Dialog */}
      <Dialog open={isProjectDetailsOpen} onOpenChange={setIsProjectDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  Detalles completos del proyecto y términos de inversión.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <div 
                  className="h-56 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedProject.image})` }}
                ></div>
                
                <div className="grid grid-cols-3 gap-4 bg-qubic-gray rounded-lg p-4">
                  <div>
                    <p className="text-sm text-qubic-gray-dark">ROI Estimado</p>
                    <p className="text-lg font-bold text-green-600">{selectedProject.roi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-qubic-gray-dark">Inversión mínima</p>
                    <p className="text-lg font-bold text-qubic-black">{selectedProject.minInvestment} USDQ</p>
                  </div>
                  <div>
                    <p className="text-sm text-qubic-gray-dark">Duración</p>
                    <p className="text-lg font-bold text-qubic-black">{selectedProject.duration}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-qubic-black mb-2">Descripción</h3>
                  <p className="text-qubic-gray-dark">{selectedProject.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-qubic-black mb-2">Nivel de riesgo</h3>
                  <div className="flex items-center">
                    <span 
                      className={cn(
                        "inline-block rounded-full w-3 h-3 mr-2",
                        selectedProject.riskLevel === 'Bajo' && "bg-green-500",
                        selectedProject.riskLevel === 'Medio-Bajo' && "bg-blue-500",
                        selectedProject.riskLevel === 'Medio' && "bg-yellow-500",
                        selectedProject.riskLevel === 'Alto' && "bg-red-500"
                      )}
                    ></span>
                    <span className="font-medium">{selectedProject.riskLevel}</span>
                  </div>
                  <p className="text-qubic-gray-dark mt-2">
                    {selectedProject.riskLevel === 'Bajo' && 'Proyecto con bajo riesgo y rendimiento estable, adecuado para perfiles conservadores.'}
                    {selectedProject.riskLevel === 'Medio-Bajo' && 'Riesgo controlado con buena relación riesgo-beneficio.'}
                    {selectedProject.riskLevel === 'Medio' && 'Equilibrio entre riesgo y potencial de rendimiento, para inversores moderados.'}
                    {selectedProject.riskLevel === 'Alto' && 'Mayor potencial de rendimiento pero con riesgos elevados. Recomendado solo como parte de una cartera diversificada.'}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg flex">
                  <AlertTriangle size={20} className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Aviso de riesgo:</strong> Todas las inversiones en DeFi implican cierto nivel de riesgo. 
                      Los rendimientos pasados no garantizan resultados futuros. Invierte de forma responsable y solo 
                      capital que puedas permitirte perder.
                    </p>
                  </div>
                </div>
                
                <a 
                  href="#" 
                  className="text-qubic-blue hover:underline flex items-center text-sm font-medium"
                >
                  <ExternalLink size={16} className="mr-1" />
                  Ver documentación técnica completa
                </a>
              </div>
              
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsProjectDetailsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={startInvesting}
                  className="bg-qubic-blue hover:bg-qubic-blue-dark"
                >
                  Invertir ahora
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Invest Dialog */}
      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>Invertir en {selectedProject.name}</DialogTitle>
                <DialogDescription>
                  Introduce el monto que deseas invertir en este proyecto.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleInvest} className="mt-4">
                <div className="space-y-4">
                  <div className="bg-qubic-gray p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-qubic-gray-dark">Proyecto:</span>
                      <span className="font-medium text-qubic-black">{selectedProject.name}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-qubic-gray-dark">ROI Estimado:</span>
                      <span className="font-medium text-green-600">{selectedProject.roi}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-qubic-gray-dark">Duración:</span>
                      <span className="font-medium text-qubic-black">{selectedProject.duration}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invest-amount">Monto a invertir (USDQ)</Label>
                    <Input
                      id="invest-amount"
                      type="number"
                      min={selectedProject.minInvestment}
                      step="1"
                      placeholder="0.00"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      required
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-qubic-gray-dark">Mínimo: {selectedProject.minInvestment} USDQ</span>
                      <span className="text-qubic-gray-dark">Disponible: {balance.toFixed(2)} USDQ</span>
                    </div>
                  </div>
                  
                  <div className="bg-qubic-blue/5 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Info size={18} className="text-qubic-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-qubic-black font-medium">Resumen de la inversión</p>
                        <p className="text-sm text-qubic-gray-dark mt-1">
                          Inversión: <span className="font-medium text-qubic-black">{investAmount || 0} USDQ</span>
                        </p>
                        <p className="text-sm text-qubic-gray-dark">
                          Retorno estimado: <span className="font-medium text-green-600">
                            {investAmount ? (Number(investAmount) * (Number(selectedProject.roi.replace('%', '')) / 100)).toFixed(2) : '0.00'} USDQ
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Al confirmar esta inversión, aceptas los términos y condiciones 
                      del proyecto. Consulta la documentación completa para conocer detalles sobre liquidez y periodo de bloqueo.
                    </p>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsInvestDialogOpen(false)}
                    disabled={isProcessing}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-qubic-blue hover:bg-qubic-blue-dark"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">Procesando</span>
                        <span className="animate-spin">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      </>
                    ) : 'Confirmar inversión'}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
      <SupportChat />
    </div>
  );
};

const SearchIcon = Search;

export default Projects;
