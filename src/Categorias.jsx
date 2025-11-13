import React from "react";
import { FaTools, FaClock, FaHeart } from "react-icons/fa";

export default function WorkingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 text-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Icono principal */}
        <div className="relative">
          <FaTools className="text-6xl text-blue-400 animate-bounce" />
          <span className="absolute -bottom-2 -right-3 text-sm bg-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse">
            ⚙️
          </span>
        </div>

        {/* Texto principal */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          Estoy trabajando en la página
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-300 text-lg max-w-md">
          Por favor, ten paciencia mientras construyo algo increíble hermosa 🙃💡
        </p>

        {/* Sección con íconos adicionales */}
        <div className="flex items-center gap-6 text-gray-400 text-2xl mt-6">
          <FaClock className="hover:text-yellow-400 transition-colors duration-300" />
          <FaHeart className="hover:text-red-500 transition-colors duration-300" />
          <FaTools className="hover:text-blue-400 transition-colors duration-300" />
        </div>

        {/* Barra de progreso animada */}
        <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden mt-10">
          <div className="h-full bg-blue-500 animate-[progress_3s_ease-in-out_infinite]" />
        </div>

        {/* Créditos */}
        <p className="text-sm text-gray-500 mt-6">
          Hecho con ❤️ por Elian
        </p>
      </div>

      {/* Animación Tailwind personalizada */}
      <style>
        {`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 0%; }
          }
        `}
      </style>
    </div>
  );
}
