import React, { useEffect, useState, useRef } from "react";
import {
  FaShoppingBag,
  FaStar,
  FaHeart,
  FaSearch,
  FaHome,
  FaUser,
  FaTimes,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaTrash,
  FaSignOutAlt,
  FaEdit,
  FaShoppingCart,
} from "react-icons/fa";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("GraciasenManoDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("users")) {
        const store = db.createObjectStore("users", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("email", "email", { unique: true });
      }
    };
  });
};

const addUser = async (userData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");
    const request = store.add(userData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getUserByEmail = async (email) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const index = store.index("email");
    const request = index.get(email);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getUserById = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Simulación de productos
const productsData = [
  {
    id: 1,
    name: "Conjunto de 3 pulseras ✝⚾",
    price: 70,
    rating: 4.8,
    image:
      "/img1.jpg",
    category: "energia",
    featured: true,
    description:
      "Conjunto de 3 pulseras (2 de beisbolista), una de religion y una totalmente gratis",
    details: [
      "Material: Cuarzo natural",
      "Longitud: 18cm",
      "Cierre: Normal",
      "Incluye: Una de regalo",
    ],
  },
  {
    id: 2,
    name: "Conjunto de pulseras estaciones 💗",
    price: 45,
    rating: 4.6,
    image:
      "/img2.jpg",
    category: "cuarzo",
    featured: false,
    description:
      "Elegante pulseras de estaciones del tiempo rosa que promueve el amor propio y las relaciones armoniosas. Ideal para regalar o autoregalarse.",
    details: [
      "Material: Perlas rosa, verde y blanca",
      "Longitud: 19cm",
      "Cierre: Plateado",
      "Incluye: -",
    ],
  },
  {
    id: 3,
    name: "Conjunto de pulseras de dos pulseras chakras ✨s",
    price: 40,
    rating: 4.9,
    image:
      "/img3.jpg",
    category: "energia",
    featured: true,
    description:
      "Combinación única de pulseras de chakras que equilibran y armonizan tu energía. Perfectas para meditación y bienestar diario.",
    details: [
      "Material: De amarre sencillo",
      "Longitud: 20cm",
      "Cierre: Ajustable",
      "Incluye: Una extra de regalo",
    ],
  },
  {
    id: 4,
    name: "Conjunto de pulseras minimalistas de amarre sencillo 🎁",
    price: 35,
    rating: 4.5,
    image:
      "/img4.jpg",
    category: "minimalista",
    featured: false,
    description:
      "Diseño minimalista y elegante que complementa cualquier estilo. Perfectas para el uso diario o para ocasiones especiales.",
    details: [
      "Material: De amarre sencillo",
      "Longitud: 17cm",
      "Cierre: Ajustable",
      "Resistente al agua",
      "Ideales para regalar a parejas o amigos",
    ],
  },
];

export default function HomePage({ onLogout }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Categorías disponibles
  const categories = [
    { id: "todos", name: "Todos", icon: "🔮" },
    { id: "energia", name: "Energía", icon: "⚡" },
    { id: "cuarzo", name: "Cuarzo", icon: "💎" },
    { id: "piedras", name: "Piedras", icon: "✨" },
    { id: "minimalista", name: "Minimalista", icon: "⬛" },
    { id: "lujo", name: "Lujo", icon: "🌟" },
  ];

  // Cargar usuario actual al iniciar
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const savedUser = localStorage.getItem("graciasenmano-user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setCurrentUser(userData);

          // También podemos cargar datos adicionales desde IndexedDB si es necesario
          const dbUser = await getUserById(userData.id);
          if (dbUser) {
            setCurrentUser(dbUser);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // Cargar favoritos y carrito desde localStorage al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem("graciasenmano-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedCart = localStorage.getItem("graciasenmano-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("graciasenmano-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("graciasenmano-cart", JSON.stringify(cart));
  }, [cart]);

  // Filtrado de productos
  useEffect(() => {
    let filtered = productsData;

    // Filtro por favoritos si está activo
    if (showFavorites) {
      filtered = filtered.filter((product) => favorites.includes(product.id));
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory !== "todos") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered.slice(0, visibleCount));
  }, [searchTerm, selectedCategory, visibleCount, showFavorites, favorites]);

  const loadMore = () => {
    if (visibleCount < productsData.length) {
      setVisibleCount((prev) => prev + 3);
    }
  };

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId, e) => {
    if (e) e.stopPropagation();
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(" ")[0] : "";
  };

  const getInitial = (fullName) => {
    return fullName ? fullName.charAt(0).toUpperCase() : "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("graciasenmano-token");
    localStorage.removeItem("graciasenmano-user");
    if (onLogout) {
      onLogout();
    }
  };

  // Obtener productos favoritos
  const favoriteProducts = productsData.filter((product) =>
    favorites.includes(product.id)
  );

  // Detectar scroll al final para cargar más productos
  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-900 to-indigo-950 text-white pb-20">
      {/* Fondo de partículas animadas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-400/10 to-purple-500/10"
            style={{
              width: `${Math.random() * 12 + 3}px`,
              height: `${Math.random() * 12 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${
                Math.random() * 25 + 15
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          ></div>
        ))}
      </div>

      {/* HEADER CON BARRA DE BÚSQUEDA */}
      <header className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-lg shadow-2xl sticky top-0 z-40 border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Logo y título con saludo personalizado */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg rotate-12">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                  GraciasenMano ✨
                </h1>
                {currentUser && (
                  <p className="text-sm text-gray-300 mt-1">
                    ¡Hola,{" "}
                    <span className="text-pink-400 font-semibold">
                      {getFirstName(currentUser.name)}
                    </span>
                    ! 👋
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="relative group"
              >
                <FaHeart
                  className={`text-xl cursor-pointer transition-all duration-300 ${
                    favorites.length > 0 || showFavorites
                      ? "text-pink-500"
                      : "text-gray-300"
                  } group-hover:text-pink-500 group-hover:scale-110`}
                />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {favorites.length}
                  </span>
                )}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {showFavorites ? "Mostrar todos" : "Ver favoritos"}
                </div>
              </button>

              <button
                onClick={() => setShowCartModal(true)}
                className="relative group"
              >
                <div className="relative">
                  <FaShoppingBag className="text-xl cursor-pointer transition-all duration-300 text-gray-300 group-hover:text-green-400 group-hover:scale-110" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-blue-500 text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                      {getTotalCartItems()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Carrito
                </div>
              </button>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar pulseras por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg"
                      : "bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 hover:bg-gray-700/70"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL - PRODUCTOS */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Encabezado de productos personalizado */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {showFavorites
              ? "Tus "
              : currentUser
              ? `Para ti, ${getFirstName(currentUser.name)} `
              : "Nuestras "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {showFavorites ? "Favoritos" : "Pulseras Mágicas"}
            </span>{" "}
            ✨
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            {showFavorites
              ? "Tus pulseras favoritas guardadas con amor"
              : currentUser
              ? `Descubre pulseras únicas que combinan con tu energía, ${getFirstName(
                  currentUser.name
                )}`
              : "Descubre pulseras únicas que combinan estilo, energía positiva y artesanía excepcional"}
          </p>

          {/* Contadores de resultados */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-purple-500/30">
              <span className="text-pink-400 font-semibold">
                {filteredProducts.length}
              </span>{" "}
              productos
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-purple-500/30">
              <span className="text-purple-400 font-semibold">
                {favorites.length}
              </span>{" "}
              favoritos
            </div>
            {currentUser && (
              <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-purple-500/30">
                <span className="text-blue-400 font-semibold">
                  {new Date().getHours() < 12
                    ? "☀️"
                    : new Date().getHours() < 18
                    ? "🌤️"
                    : "🌙"}
                </span>{" "}
                {new Date().getHours() < 12
                  ? "Buenos días"
                  : new Date().getHours() < 18
                  ? "Buenas tardes"
                  : "Buenas noches"}
              </div>
            )}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product, i) => (
            <div
              key={product.id}
              onClick={() => openProductModal(product)}
              className="group relative bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-purple-500/20 cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease forwards ${i * 0.1}s`,
                opacity: 0,
              }}
            >
              {/* Badge destacado */}
              {product.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Destacado 🔥
                </div>
              )}

              {/* Imagen del producto */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Botón de favoritos */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 ${
                    favorites.includes(product.id)
                      ? "bg-pink-500/20 text-pink-500 opacity-100"
                      : "bg-gray-900/70 text-white hover:text-pink-500"
                  }`}
                >
                  <FaHeart
                    className={
                      favorites.includes(product.id) ? "fill-current" : ""
                    }
                  />
                </button>
              </div>

              {/* Contenido del producto */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-pink-300 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-purple-400 font-bold text-xl">
                    ${product.price}
                  </p>
                </div>

                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.round(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-sm ml-2">
                    ({product.rating})
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaShoppingBag className="text-sm" />
                  Agregar al carrito
                </button>
              </div>

              {/* Efecto de brillo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{showFavorites ? "💔" : "😔"}</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              {showFavorites
                ? "Aún no tienes favoritos"
                : "No se encontraron productos"}
            </h3>
            <p className="text-gray-400">
              {showFavorites
                ? "Agrega productos a tus favoritos tocando el corazón"
                : "Intenta con otros términos de búsqueda o categorías"}
            </p>
          </div>
        )}

        {/* Botón de carga más */}
        {visibleCount < productsData.length &&
          filteredProducts.length > 0 &&
          !showFavorites && (
            <div className="flex justify-center">
              <button
                onClick={loadMore}
                className="group bg-gradient-to-r from-gray-800/70 to-purple-900/50 backdrop-blur-sm hover:from-gray-700/70 hover:to-purple-800/50 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 border border-purple-500/30 hover:border-purple-400 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Cargar más productos
                <span className="group-hover:translate-y-1 transition-transform">
                  ⬇️
                </span>
              </button>
            </div>
          )}
      </main>

      {/* MODAL DEL CARRITO */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Tu Carrito 🛍️
              </h3>
              <button
                onClick={() => setShowCartModal(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">
                    Tu carrito está vacío
                  </h4>
                  <p className="text-gray-400">
                    Agrega algunos productos mágicos
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-purple-500/20"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-grow">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-purple-400 font-bold">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                        <button
                          onClick={(e) => removeFromCart(item.id, e)}
                          className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors text-red-400"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer del modal */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-purple-500/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-purple-400">
                    ${getCartTotal()}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                  Proceder al Pago
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CUENTA DEL USUARIO */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen">
            {/* Header fijo */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-b border-purple-500/30 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors duration-200"
                >
                  <FaArrowLeft className="text-xl" />
                  <span>Volver</span>
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Mi Cuenta
                </h2>
                <div className="w-8"></div> {/* Espaciador para centrar */}
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="max-w-4xl mx-auto p-4">
              {/* Información del usuario */}
              <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-500/20 mb-6">
                <div className="p-8 text-center">
                  {/* Avatar con inicial */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl text-white text-4xl font-bold">
                      {currentUser ? getInitial(currentUser.name) : "U"}
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-white mb-2">
                    {currentUser ? currentUser.name : "Usuario"}
                  </h1>
                  <p className="text-gray-300 text-lg mb-4">
                    {currentUser ? currentUser.email : "email@ejemplo.com"}
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="bg-gray-800/50 px-4 py-2 rounded-2xl border border-purple-500/30">
                      <span className="text-pink-400 font-semibold">
                        {favorites.length}
                      </span>{" "}
                      Favoritos
                    </div>
                    <div className="bg-gray-800/50 px-4 py-2 rounded-2xl border border-purple-500/30">
                      <span className="text-green-400 font-semibold">
                        {getTotalCartItems()}
                      </span>{" "}
                      En carrito
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de Favoritos */}
              <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-500/20">
                <div className="p-6 border-b border-purple-500/20">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <FaHeart className="text-pink-500" />
                    Tus Productos Favoritos
                  </h3>
                  <p className="text-gray-300">
                    {favoriteProducts.length === 0
                      ? "Aún no tienes productos favoritos"
                      : `Tienes ${favoriteProducts.length} productos en tus favoritos`}
                  </p>
                </div>

                <div className="p-6">
                  {favoriteProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💔</div>
                      <h4 className="text-xl font-semibold text-gray-300 mb-2">
                        No tienes favoritos
                      </h4>
                      <p className="text-gray-400 mb-6">
                        Agrega productos a tus favoritos tocando el corazón
                      </p>
                      <button
                        onClick={() => setShowAccountModal(false)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Explorar Productos
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-800/50 rounded-2xl p-4 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                          onClick={() => {
                            setShowAccountModal(false);
                            openProductModal(product);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-grow">
                              <h4 className="font-semibold text-white">
                                {product.name}
                              </h4>
                              <p className="text-purple-400 font-bold">
                                ${product.price}
                              </p>
                              <div className="flex items-center text-yellow-400 text-sm">
                                <FaStar className="fill-current" />
                                <span className="text-gray-400 ml-1">
                                  ({product.rating})
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product.id);
                              }}
                              className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-500/30 transition-colors"
                            >
                              <FaHeart className="fill-current" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones de cuenta */}
              <div className="mt-6 bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-500/20">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Acciones de Cuenta
                  </h3>
                  <div className="space-y-3">

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 bg-red-500/20 rounded-2xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 text-left"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      <div>
                        <p className="font-semibold text-white">
                          Cerrar Sesión
                        </p>
                        <p className="text-gray-400 text-sm">
                          Salir de tu cuenta
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLES DEL PRODUCTO */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen">
            {/* Header fijo */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-b border-purple-500/30 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button
                  onClick={closeProductModal}
                  className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors duration-200"
                >
                  <FaArrowLeft className="text-xl" />
                  <span>Volver</span>
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Detalles del Producto
                </h2>
                <div className="w-8"></div> {/* Espaciador para centrar */}
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="max-w-4xl mx-auto p-4">
              <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-500/20">
                {/* Imagen principal */}
                <div className="relative">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={`absolute top-4 right-4 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                      favorites.includes(selectedProduct.id)
                        ? "bg-pink-500/20 text-pink-500"
                        : "bg-gray-900/70 text-white hover:text-pink-500"
                    }`}
                  >
                    <FaHeart
                      className={
                        favorites.includes(selectedProduct.id)
                          ? "fill-current text-lg"
                          : "text-lg"
                      }
                    />
                  </button>
                </div>

                {/* Información del producto */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">
                      {selectedProduct.name}
                    </h1>
                    <p className="text-2xl font-bold text-purple-400">
                      ${selectedProduct.price}
                    </p>
                  </div>

                  <div className="flex items-center text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xl ${
                          i < Math.round(selectedProduct.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-lg ml-3">
                      ({selectedProduct.rating})
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Detalles</h3>
                    <ul className="space-y-2">
                      {selectedProduct.details.map((detail, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-300"
                        >
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <FaShoppingBag className="text-xl" />
                    Agregar al Carrito - ${selectedProduct.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR INFERIOR FIJO */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-t border-purple-500/30 z-40 py-3">
        <div className="max-w-md mx-auto px-6">
          <div className="flex justify-between items-center">
            <button className="flex flex-col items-center gap-1 text-white transition-all duration-300 hover:text-pink-400 hover:scale-110">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FaHome className="text-lg" />
              </div>
              <span className="text-xs font-medium">Inicio</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white transition-all duration-300 hover:text-blue-400 hover:scale-110">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <FaSearch className="text-lg" />
              </div>
              <span className="text-xs font-medium">Buscar</span>
            </button>

            <button
              onClick={() => setShowCartModal(true)}
              className="flex flex-col items-center gap-1 text-white transition-all duration-300 hover:text-green-400 hover:scale-110 relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <FaShoppingBag className="text-lg" />
              </div>
              <span className="text-xs font-medium">Carrito</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {getTotalCartItems()}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowAccountModal(true)}
              className="flex flex-col items-center gap-1 text-white transition-all duration-300 hover:text-yellow-400 hover:scale-110"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                <FaUser className="text-lg" />
              </div>
              <span className="text-xs font-medium">Cuenta</span>
            </button>
          </div>
        </div>
      </nav>

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
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
