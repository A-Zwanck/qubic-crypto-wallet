
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWalletService } from '@/hooks/useWalletService';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  apy: number;
  duration: string;
  minInvestment: number;
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { balance, isLoading, fetchWalletData, handleInvestment } = useWalletService();

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const projects: Project[] = [
    {
      id: 1,
      title: "Energía Renovable Solar",
      description: "Inversión en paneles solares para comunidades rurales con retorno garantizado del 12% anual.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      apy: 12,
      duration: "24 meses",
      minInvestment: 100
    },
    {
      id: 2,
      title: "Agricultura Sostenible",
      description: "Financiamiento para pequeños agricultores que implementan prácticas regenerativas con retorno del 9% anual.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      apy: 9,
      duration: "18 meses",
      minInvestment: 50
    },
    {
      id: 3,
      title: "Microcréditos Empresariales",
      description: "Apoyo a pequeñas empresas locales con necesidades de capital para crecimiento con retorno del 10% anual.",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      apy: 10,
      duration: "12 meses",
      minInvestment: 200
    },
    {
      id: 4,
      title: "Vivienda Accesible",
      description: "Financiamiento para construcción de viviendas sostenibles para familias de bajos ingresos con retorno del 8.5% anual.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      apy: 8.5,
      duration: "36 meses",
      minInvestment: 150
    }
  ];

  const handleOpenInvestDialog = (project: Project) => {
    setSelectedProject(project);
    setInvestAmount(project.minInvestment.toString());
    setOpenDialog(true);
  };

  const handleInvest = async () => {
    if (!selectedProject) return;
    
    const amount = parseFloat(investAmount);
    
    if (isNaN(amount) || amount < selectedProject.minInvestment) {
      toast({
        title: "Monto inválido",
        description: `El monto mínimo de inversión es ${selectedProject.minInvestment} USDQ`,
        variant: "destructive"
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: "Fondos insuficientes",
        description: "No tienes suficiente saldo para realizar esta inversión",
        variant: "destructive"
      });
      return;
    }
    
    const success = await handleInvestment(amount, selectedProject.title);
    
    if (success) {
      setOpenDialog(false);
      setSelectedProject(null);
      setInvestAmount('');
      
      toast({
        title: "¡Inversión realizada!",
        description: `Has invertido ${amount} USDQ en ${selectedProject.title}`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Proyectos de Impacto</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Invierte en proyectos que generan un impacto positivo mientras obtienes retornos financieros. 
          Cada proyecto ha sido cuidadosamente evaluado.
        </p>
        <div className="mt-4 text-qubic-blue font-semibold">
          Disponible: {isLoading ? "Cargando..." : `${balance.toFixed(2)} USDQ`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="flex justify-between text-sm mt-1">
                <span>{project.apy}% APY</span>
                <span>{project.duration}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{project.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                Inversión mínima: {project.minInvestment} USDQ
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleOpenInvestDialog(project)}
              >
                Invertir ahora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invertir en {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Inversión mínima: {selectedProject?.minInvestment} USDQ
              <br />
              Retorno anual: {selectedProject?.apy}%
              <br />
              Duración: {selectedProject?.duration}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto a invertir (USDQ)</Label>
              <Input
                id="amount"
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="Ingresa el monto"
                min={selectedProject?.minInvestment}
                step="1"
              />
              <p className="text-sm text-gray-500">
                Saldo disponible: {balance.toFixed(2)} USDQ
              </p>
            </div>
            
            {parseFloat(investAmount) > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Monto a invertir:</span>
                  <span>{parseFloat(investAmount).toFixed(2)} USDQ</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Retorno estimado ({selectedProject?.duration}):</span>
                  <span>
                    {selectedProject ? (parseFloat(investAmount) * (selectedProject.apy / 100) * 
                      (parseInt(selectedProject.duration) / 12)).toFixed(2) : '0'} USDQ
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInvest}>
              Confirmar inversión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
