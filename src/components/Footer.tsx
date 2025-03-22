
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold text-qubic-black mb-4">QUBIC WALLET</h3>
            <p className="text-qubic-gray-dark mb-4 max-w-md">
              La wallet sin comisiones de la red Qubic. Seguridad, simplicidad y soporte 24/7 para todos tus activos digitales.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-qubic-black uppercase tracking-wider mb-4">Producto</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Características</Link></li>
              <li><Link to="/projects" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Proyectos DeFi</Link></li>
              <li><Link to="/" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Stablecoin USDQ</Link></li>
              <li><Link to="/dashboard" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Informes fiscales</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-qubic-black uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Términos de uso</Link></li>
              <li><Link to="/" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Política de privacidad</Link></li>
              <li><Link to="/" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Aviso legal</Link></li>
              <li><Link to="/" className="text-qubic-gray-dark hover:text-qubic-blue transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-qubic-gray-dark text-sm">
            &copy; {currentYear} QUBIC WALLET. Todos los derechos reservados.
          </p>
          <p className="text-qubic-gray-dark text-xs mt-2">
            Aviso importante: Los activos digitales son instrumentos de alto riesgo. El valor de tus inversiones puede subir o bajar. 
            QUBIC WALLET no proporciona asesoramiento financiero. Consulta con un profesional antes de tomar decisiones de inversión.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
