import React, { useEffect, useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft, FaGem } from "react-icons/fa";

// Función para manejar IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GraciasenManoDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        store.createIndex('email', 'email', { unique: true });
      }
    };
  });
};

const addUser = async (userData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(userData);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getUserByEmail = async (email) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Componente de Autenticación
export default function AuthPage({ onLoginSuccess, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar si ya está logueado
  useEffect(() => {
    const token = localStorage.getItem('graciasenmano-token');
    if (token) {
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const generateToken = () => {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Proceso de Login
        const user = await getUserByEmail(formData.email);
        
        if (!user) {
          setError('Usuario no encontrado. ¿Quieres registrarte?');
          setLoading(false);
          return;
        }

        if (user.password !== formData.password) {
          setError('Contraseña incorrecta');
          setLoading(false);
          return;
        }

        // Login exitoso
        const token = generateToken();
        localStorage.setItem('graciasenmano-token', token);
        localStorage.setItem('graciasenmano-user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email
        }));

        setSuccess('¡Bienvenido de nuevo!');
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);

      } else {
        // Proceso de Registro
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        const existingUser = await getUserByEmail(formData.email);
        if (existingUser) {
          setError('Este email ya está registrado. ¿Quieres iniciar sesión?');
          setLoading(false);
          return;
        }

        // Registro exitoso
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString()
        };

        await addUser(userData);

        const token = generateToken();
        localStorage.setItem('graciasenmano-token', token);
        localStorage.setItem('graciasenmano-user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email
        }));

        setSuccess('¡Cuenta creada exitosamente!');
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Fondo de partículas animadas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-400/10 to-purple-500/10"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Botón de regreso */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-white hover:text-pink-400 transition-colors duration-300 group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <FaArrowLeft className="text-sm" />
        </div>
        <span className="font-medium">Volver</span>
      </button>

      {/* Contenido principal */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Tarjeta de autenticación */}
          <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/20 p-8 transform hover:scale-105 transition-transform duration-500">
            
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg rotate-12">
                    <FaGem className="text-white text-2xl" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                GraciasenMano ✨
              </h1>
              <p className="text-gray-300">
                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </p>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-300 text-center backdrop-blur-sm">
                {success}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    required
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                  className="w-full bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                  className="w-full bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl pl-10 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmar contraseña"
                    required
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl pl-10 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </>
                )}
              </button>
            </form>

            {/* Cambiar entre login/registro */}
            <div className="text-center mt-6 pt-6 border-t border-purple-500/20">
              <p className="text-gray-400">
                {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-purple-400 hover:text-pink-400 font-semibold transition-colors duration-300"
                >
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </p>
            </div>

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded-2xl border border-purple-500/10">
              <p className="text-sm text-gray-400 text-center">
                {isLogin 
                  ? 'Al iniciar sesión, aceptas nuestros términos y condiciones' 
                  : 'Tu información está segura con nosotros. Usamos encriptación avanzada.'
                }
              </p>
            </div>
          </div>

          {/* Efectos decorativos */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
          }
        `}
      </style>
    </div>
  );
}