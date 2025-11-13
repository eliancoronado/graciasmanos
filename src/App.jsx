// En tu componente principal (App.js o HomePage.js)
import React, { useState, useEffect } from 'react';
import HomePage from './Home';
import AuthPage from './Register';
import { FaGem, FaUser } from 'react-icons/fa6';
import { FormspreeProvider } from '@formspree/react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('graciasenmano-token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('graciasenmano-token');
    localStorage.removeItem('graciasenmano-user');
    setIsAuthenticated(false);
  };

  // En el navbar inferior, actualiza el botón de cuenta:
  const AccountButton = () => (
    <button 
      onClick={isAuthenticated ? handleLogout : () => setShowAuth(true)}
      className="flex flex-col items-center gap-1 text-white transition-all duration-300 hover:text-yellow-400 hover:scale-110"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
        <FaUser className="text-lg" />
      </div>
      <span className="text-xs font-medium">
        {isAuthenticated ? 'Cerrar Sesión' : 'Cuenta'}
      </span>
    </button>
  );

  if (showAuth) {
    return (
      <AuthPage 
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  if (!isAuthenticated) {
    // Mostrar la app principal pero con acceso limitado
    return (
      <FormspreeProvider project="xgvrvarw">
        <HomePage />
        {/* Overlay para requerir login */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-8 max-w-md text-center border border-purple-500/30">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaGem className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Acceso Requerido</h3>
            <p className="text-gray-300 mb-6">
              Para disfrutar de todas las funciones de GraciasenMano, inicia sesión o crea una cuenta.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAuth(true)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setShowAuth(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 border border-purple-500/30"
              >
                Explorar
              </button>
            </div>
          </div>
        </div>
      </FormspreeProvider>
    );
  }

  return <HomePage onLogout={handleLogout} />;
}

export default App;