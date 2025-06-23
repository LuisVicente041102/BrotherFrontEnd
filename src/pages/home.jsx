import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("🌐 Usando BACKEND_URL:", BACKEND_URL); // 👈 Verifica qué URL está tomando

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("pos_user");
    if (token && user) {
      setIsLoggedIn(true);
    }

    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/top`);
      const data = await res.json();
      setTopProducts(data);
    } catch (error) {
      console.error("❌ Error al obtener productos destacados:", error);
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <Header isLoggedIn={isLoggedIn} />

      {/* HERO */}
      <section className="bg-indigo-100 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">
          ¡Crea tu mundo con sublimación personalizada!
        </h1>
        <p className="text-lg text-indigo-700 mb-6">
          Productos únicos y personalizados para cada ocasión
        </p>
        <button
          onClick={() => navigate("/catalogo")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition"
        >
          Ver Catálogo
        </button>
      </section>

      {/* TOP PRODUCTS */}
      <section className="py-16 bg-white px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Productos más vendidos
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {topProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay productos disponibles en este momento.
            </p>
          ) : (
            topProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-lg shadow hover:shadow-xl transition"
              >
                <img
                  src={
                    product.imagen_url?.startsWith("http")
                      ? product.imagen_url
                      : `${BACKEND_URL}${product.imagen_url}`
                  }
                  alt={product.nombre}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {product.nombre}
                  </h3>
                  <p className="text-gray-600">
                    ${parseFloat(product.precio_venta).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm text-gray-500">
        &copy; 2025 Brother Sublima. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;
