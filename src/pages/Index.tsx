import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, BarChart3, MessageCircle, CreditCard, TrendingUp, Lock, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupportChat from '@/components/SupportChat';
const Index = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, {
      threshold: 0.1
    });
    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => {
      featureRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 lg:pr-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-qubic-black leading-tight animate-fade-up">Entra al mundo crypto sin comisiones ni complicaciones</h1>
              <p className="text-lg text-qubic-gray-dark animate-fade-up" style={{
              animationDelay: '0.1s'
            }}>
                La primera wallet que te permite gestionar tus criptoactivos sin preocuparte por comisiones de red, con acceso a la stablecoin USDQ y generación automática de informes fiscales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{
              animationDelay: '0.2s'
            }}>
                <Link to="/login" className="btn-qubic text-center">
                  Crea tu cuenta gratis
                </Link>
                <a href="#features" className="btn-qubic-outline text-center">
                  Descubre más
                </a>
              </div>
              <div className="flex items-center space-x-2 text-qubic-gray-dark animate-fade-up" style={{
              animationDelay: '0.3s'
            }}>
                <Shield size={18} className="text-qubic-blue" />
                <span className="text-sm">Seguridad de nivel bancario y protección de fondos</span>
              </div>
            </div>
            
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-qubic-blue to-qubic-blue-light rounded-2xl blur opacity-30 animate-pulse-slow"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <div className="bg-qubic-gray rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold text-qubic-black mb-1">Tu Wallet</h3>
                    <p className="text-qubic-gray-dark text-sm mb-4">Balances actualizados en tiempo real</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-qubic-blue rounded-full flex items-center justify-center text-white mr-3">Q</div>
                          <div>
                            <p className="font-medium">USDQ</p>
                            <p className="text-xs text-qubic-gray-dark">Stablecoin</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">1,250.00</p>
                          <p className="text-xs text-qubic-gray-dark">≈ 1,250.00 €</p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button className="btn-qubic w-[48%] py-2 text-sm">Depositar</button>
                        <button className="btn-qubic-outline w-[48%] py-2 text-sm">Retirar</button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-qubic-black">Movimientos recientes</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                            <TrendingUp size={16} />
                          </div>
                          <div>
                            <p className="font-medium">Depósito</p>
                            <p className="text-xs text-qubic-gray-dark">Hoy, 10:24</p>
                          </div>
                        </div>
                        <p className="font-medium text-green-600">+250.00 USDQ</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                            <CreditCard size={16} />
                          </div>
                          <div>
                            <p className="font-medium">Transferencia</p>
                            <p className="text-xs text-qubic-gray-dark">Ayer, 14:55</p>
                          </div>
                        </div>
                        <p className="font-medium text-qubic-blue">-100.00 USDQ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-qubic-gray px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-qubic-black mb-4">
              Una experiencia cripto sin complicaciones
            </h2>
            <p className="text-qubic-gray-dark max-w-2xl mx-auto">
              Diseñamos QUBIC WALLET para que puedas centrarte en lo importante: tus inversiones y activos digitales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div ref={el => featureRefs.current[0] = el} className="bg-white rounded-xl p-6 shadow-sm opacity-0 translate-y-10 transition-all duration-500">
              <div className="w-12 h-12 bg-qubic-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Shield size={24} className="text-qubic-blue" />
              </div>
              <h3 className="text-xl font-semibold text-qubic-black mb-2">Seguridad Total</h3>
              <p className="text-qubic-gray-dark">
                Protección de nivel bancario para tus activos con encriptación de última generación y autenticación de dos factores.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div ref={el => featureRefs.current[1] = el} className="bg-white rounded-xl p-6 shadow-sm opacity-0 translate-y-10 transition-all duration-500">
              <div className="w-12 h-12 bg-qubic-blue/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign size={24} className="text-qubic-blue" />
              </div>
              <h3 className="text-xl font-semibold text-qubic-black mb-2">Stablecoin USDQ</h3>
              <p className="text-qubic-gray-dark">
                Accede a la primera stablecoin de la red Qubic, con paridad 1:1 con el dólar y sin comisiones de transacción.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div ref={el => featureRefs.current[2] = el} className="bg-white rounded-xl p-6 shadow-sm opacity-0 translate-y-10 transition-all duration-500">
              <div className="w-12 h-12 bg-qubic-blue/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-qubic-blue" />
              </div>
              <h3 className="text-xl font-semibold text-qubic-black mb-2">Informes Fiscales</h3>
              <p className="text-qubic-gray-dark">
                Generación automática de informes para Hacienda, con todos los datos necesarios para tu declaración de impuestos.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div ref={el => featureRefs.current[3] = el} className="bg-white rounded-xl p-6 shadow-sm opacity-0 translate-y-10 transition-all duration-500">
              <div className="w-12 h-12 bg-qubic-blue/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-qubic-blue" />
              </div>
              <h3 className="text-xl font-semibold text-qubic-black mb-2">Soporte 24/7</h3>
              <p className="text-qubic-gray-dark">
                Chat de soporte disponible las 24 horas, con agentes especializados que responden en menos de 10 minutos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Zero Fees Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={el => featureRefs.current[4] = el} className="opacity-0 translate-y-10 transition-all duration-500">
              <div className="bg-qubic-blue/5 rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-qubic-black mb-6">
                    Sin comisiones de red y con total transparencia
                  </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="bg-white rounded-full p-1 mr-3 mt-0.5">
                        <Lock size={16} className="text-qubic-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-qubic-black">100% Transparente</h4>
                        <p className="text-qubic-gray-dark text-sm">
                          Todas las transacciones quedan registradas en la blockchain con total transparencia.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white rounded-full p-1 mr-3 mt-0.5">
                        <CreditCard size={16} className="text-qubic-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-qubic-black">Depósitos fáciles</h4>
                        <p className="text-qubic-gray-dark text-sm">
                          Deposita con tarjeta o transferencia bancaria sin costes adicionales.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white rounded-full p-1 mr-3 mt-0.5">
                        <TrendingUp size={16} className="text-qubic-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-qubic-black">Rentabiliza tus activos</h4>
                        <p className="text-qubic-gray-dark text-sm">
                          Accede a proyectos DeFi seleccionados con altos retornos potenciales.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link to="/login" className="btn-qubic inline-block">
                    Empieza ahora
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-qubic-blue/10 rounded-full -mr-32 -mt-20 z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-qubic-blue/5 rounded-full -ml-20 -mb-10 z-0"></div>
              </div>
            </div>
            
            <div ref={el => featureRefs.current[5] = el} className="opacity-0 translate-y-10 transition-all duration-500">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-qubic-black mb-2">
                  ¿Por qué elegir QUBIC WALLET?
                </h2>
                <p className="text-qubic-gray-dark">
                  La tecnología de Qubic permite transacciones sin comisiones de red, 
                  lo que nos diferencia de otras carteras cripto donde cada movimiento tiene un coste.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">QUBIC WALLET</h3>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        0% Comisiones
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Transferencias</span>
                        <span className="font-medium text-green-600">Gratis</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Depósitos</span>
                        <span className="font-medium text-green-600">Gratis</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Retiros</span>
                        <span className="font-medium text-green-600">Gratis</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Informes fiscales</span>
                        <span className="font-medium text-green-600">Incluidos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-qubic-gray rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Otras wallets</h3>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                        Comisiones variables
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Transferencias</span>
                        <span className="font-medium text-red-600">5-20€ por tx</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Depósitos</span>
                        <span className="font-medium text-red-600">1-3% del monto</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Retiros</span>
                        <span className="font-medium text-red-600">5-30€ por tx</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-qubic-gray-dark">Informes fiscales</span>
                        <span className="font-medium text-red-600">De pago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-qubic-blue px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Descubre la libertad financiera con QUBIC WALLET
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-3xl mx-auto">
            Únete a miles de usuarios que ya disfrutan de la primera wallet sin comisiones 
            y con todas las herramientas que necesitas para gestionar tus activos digitales.
          </p>
          <Link to="/login" className="inline-block bg-white text-qubic-blue font-medium py-3 px-8 rounded-lg 
            transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg
            active:scale-[0.98] focus:outline-none">
            Crea tu cuenta gratis
          </Link>
        </div>
      </section>
      
      <Footer />
      <SupportChat />
    </div>;
};
export default Index;