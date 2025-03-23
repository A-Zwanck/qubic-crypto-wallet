
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src="/assets/b03c2db2-fc71-4f87-adb6-a8bf8b75a9fd.png" alt="Qubic Logo" className="h-7 mr-2" />
      <span className="font-bold text-xl md:text-2xl text-qubic-blue">WALLET</span>
    </Link>
  );
};

export default Logo;
