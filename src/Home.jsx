import React, { useEffect, useState, useRef } from "react";
import {
  FaShoppingBag,
  FaStar,
  FaHeart,
  FaSearch,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaArrowRight,
  FaGem,
} from "react-icons/fa";

// Simulación de productos
const productsData = [
  {
    id: 1,
    name: "Pulsera Aurora",
    price: 12.99,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5b6b1de?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Pulsera de Cuarzo Rosa",
    price: 10.49,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1612207421804-9e999a2e2b0a?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 3,
    name: "Pulsera Energía Natural",
    price: 15.99,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 4,
    name: "Pulsera Minimalista Negra",
    price: 9.99,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1600180758600-22804b3dbcd0?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 5,
    name: "Pulsera de Amatista",
    price: 13.99,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1621263764111-ec5b3df8b2f3?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 6,
    name: "Pulsera Dorada de Lujo",
    price: 19.99,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1621263764282-4db8338c9a31?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  // puedes agregar más productos
];

export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [products, setProducts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setProducts(productsData.slice(0, visibleCount));
  }, [visibleCount]);

  // Efecto para el navbar que cambia al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      // Para el navbar
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Para carga infinita
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMore = () => {
    if (visibleCount < productsData.length) {
      setVisibleCount((prev) => prev + 3);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 text-white overflow-hidden">
      {/* Fondo de partículas animadas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${
                Math.random() * 20 + 10
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* NAVBAR MEJORADO */}
      <header
        className={`flex justify-between items-center px-6 py-4 sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-lg shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaGem className="text-white text-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
            PulseraLux ✨
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <FaSearch className="text-xl cursor-pointer transition-all duration-300 group-hover:text-blue-400 group-hover:scale-110" />
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Buscar
            </div>
          </div>

          <div className="relative group">
            <FaHeart className="text-xl cursor-pointer transition-all duration-300 group-hover:text-pink-500 group-hover:scale-110" />
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Favoritos
            </div>
          </div>

          <div className="relative group">
            <div className="relative">
              <FaShoppingBag className="text-xl cursor-pointer transition-all duration-300 group-hover:text-green-400 group-hover:scale-110" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                3
              </span>
            </div>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Carrito
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION MEJORADA */}
      <section ref={heroRef} className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-blue-400/30 mb-4">
                <span className="text-blue-300 text-sm font-medium">
                  ✨ Nuevas Colecciones 2023
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Brilla con{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Estilo Único
                </span>{" "}
                💫
              </h1>

              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                Descubre pulseras que capturan energía positiva y elegancia.
                Cada diseño es una obra de arte con materiales naturales y
                significado especial.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Comprar ahora
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>

                <button className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-400/10 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:border-blue-400">
                  Ver colección
                </button>
              </div>

              <div className="flex items-center gap-6 pt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/40?img=${i + 10}`}
                        alt="Cliente"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-semibold">+500</span>{" "}
                    clientes satisfechos
                  </p>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=800&q=80"
                  alt="Pulsera destacada"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10"></div>
              </div>

              {/* Elementos flotantes decorativos */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-500/30 to-transparent rounded-full blur-lg animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-transparent rounded-full blur-lg animate-pulse delay-1000"></div>

              {/* Tarjeta flotante */}
              <div className="absolute -bottom-6 -left-6 bg-gray-900/80 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-gray-700 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <FaGem className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Material Premium</p>
                    <p className="text-xs text-gray-400">Garantía de calidad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS MEJORADAS */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                value: "+500",
                label: "Pulseras vendidas",
                color: "from-blue-400 to-cyan-400",
              },
              {
                value: "98%",
                label: "Clientes satisfechos",
                color: "from-green-400 to-emerald-400",
              },
              {
                value: "4.8★",
                label: "Valoración promedio",
                color: "from-yellow-400 to-amber-400",
              },
              {
                value: "24/7",
                label: "Atención personalizada",
                color: "from-purple-400 to-pink-400",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                >
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>

                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS MEJORADOS */}
      <section className="px-6 py-16 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Nuestras{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pulseras Estrella
              </span>{" "}
              💎
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Descubre nuestra colección exclusiva de pulseras diseñadas para
              realzar tu estilo y conectar con energías positivas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-xl transform hover:-translate-y-4 transition-all duration-500"
                style={{
                  animation: `fadeInUp 0.6s ease forwards ${i * 0.1}s`,
                  opacity: 0,
                }}
              >
                {/* Badge destacado */}
                {p.featured && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Destacado
                  </div>
                )}

                {/* Imagen del producto */}
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Botón de favoritos */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-gray-900/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-pink-500 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    <FaHeart />
                  </button>

                  {/* Overlay de acción */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                      <FaShoppingBag className="text-sm" />
                      Agregar al carrito
                    </button>
                  </div>
                </div>

                {/* Contenido del producto */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="text-blue-400 font-bold text-xl">
                      ${p.price}
                    </p>
                  </div>

                  <div className="flex items-center text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < Math.round(p.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-2">
                      ({p.rating})
                    </span>
                  </div>

                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:border group-hover:border-blue-400/30">
                    Ver detalles
                  </button>
                </div>

                {/* Efecto de brillo */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>

          {/* Botón de carga más */}
          {visibleCount < productsData.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                className="group bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 border border-gray-700 hover:border-gray-500 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Cargar más productos
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-6 py-16 relative">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 md:p-12 border border-gray-700 text-center relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>

          <h2 className="text-3xl font-bold mb-4">
            No te pierdas nuestras novedades
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Suscríbete para recibir ofertas exclusivas, nuevos diseños y
            contenido especial directamente en tu email.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-grow bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap">
              Suscribirme
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER MEJORADO */}
      <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 py-12 px-6 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <FaGem className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PulseraLux
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Creando accesorios únicos que conectan con tu esencia y energía
                positiva.
              </p>
              <div className="flex gap-4">
                {[FaInstagram, FaTwitter, FaTiktok].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Productos",
                links: [
                  "Novedades",
                  "Más vendidos",
                  "Ofertas",
                  "Personalizados",
                ],
              },
              {
                title: "Empresa",
                links: ["Sobre nosotros", "Blog", "Contacto", "Sostenibilidad"],
              },
              {
                title: "Ayuda",
                links: ["FAQ", "Envíos", "Devoluciones", "Guía de tallas"],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PulseraLux. Diseñado con ❤️ por{" "}
              <span className="text-blue-400 font-semibold">Elian</span>.
            </p>
          </div>
        </div>
      </footer>

      {/* Animaciones CSS */}
      <style>
        {`
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease forwards;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
