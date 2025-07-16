// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCarousel from "../components/ProductCarousel";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("🌐 Usando BACKEND_URL:", BACKEND_URL);

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);
  const [topSellingProduct, setTopSellingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("pos_user");
    if (token && user) {
      setIsLoggedIn(true);
    }

    fetchLatestProducts();
    fetchTopSellingProduct();
  }, []);

  const fetchLatestProducts = async () => {
    const endpoint = `${BACKEND_URL}/api/products/latest`;
    console.log("📦 Llamando a últimos productos:", endpoint);

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(
          `❌ Error HTTP al obtener últimos productos: ${res.status}`
        );
      }
      const data = await res.json();
      console.log("🟢 Últimos productos recibidos:", data);
      setLatestProducts(data);
    } catch (error) {
      console.error("❌ Error al obtener los últimos productos:", error);
    }
  };

  const fetchTopSellingProduct = async () => {
    const endpoint = `${BACKEND_URL}/api/products/top-selling`;
    console.log("📦 Llamando a producto más vendido:", endpoint);

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(
          `❌ Error HTTP al obtener producto más vendido: ${res.status}`
        );
      }
      const data = await res.json();
      console.log("🟢 Producto más vendido recibido:", data);
      setTopSellingProduct(data);
    } catch (error) {
      console.error("❌ Error al obtener el producto más vendido:", error);
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <Header isLoggedIn={isLoggedIn} />

      {/* Nueva Sección: Carrusel de Últimos Productos Agregados */}
      <section className="py-16 bg-white px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Nuestras Últimas Novedades
        </h2>
        <ProductCarousel products={latestProducts} />
      </section>

      {/* Sección del Producto Más Vendido */}
      <section className="py-16 bg-gray-50 px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          El Favorito de Nuestros Clientes
        </h2>
        {topSellingProduct ? (
          <div className="max-w-3xl mx-auto bg-white border rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden">
            <div className="md:w-1/2">
              <img
                src={
                  topSellingProduct.imagen_url?.startsWith("http")
                    ? topSellingProduct.imagen_url
                    : `${BACKEND_URL}${topSellingProduct.imagen_url}`
                }
                alt={topSellingProduct.nombre}
                // CAMBIO AQUÍ: de object-cover a object-contain
                className="w-full h-72 object-contain md:h-full"
              />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-indigo-800 mb-3">
                {topSellingProduct.nombre}
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Descubre por qué este producto es el más popular. ¡Calidad y
                personalización garantizadas!
              </p>
              <p className="text-green-600 font-extrabold text-3xl mb-4">
                ${parseFloat(topSellingProduct.precio_venta).toFixed(2)}
              </p>
              <button
                onClick={() => navigate(`/producto/${topSellingProduct.id}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition w-full md:w-auto"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Cargando producto estrella o no hay productos destacados
            disponibles.
          </p>
        )}
      </section>

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

      <Footer />
    </div>
  );
};

export default Home;
