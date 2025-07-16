import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("pos_user");
    if (token && user) {
      setIsLoggedIn(true);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/categories`);
      if (!res.ok) {
        throw new Error(`Error HTTP al cargar categorías: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("❌ Error al cargar categorías:", err);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    let endpoint = `${BACKEND_URL}/api/products/public`;
    if (categoryId) {
      endpoint += `?categoria_id=${categoryId}`;
    }

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Error HTTP al cargar productos: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />

      <div className="bg-gray-100 min-h-screen px-6 py-10 flex flex-col md:flex-row-reverse">
        <aside className="md:w-64 bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0 md:ml-6 md:mr-0">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-4">
            Categorías
          </h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left py-2 px-4 rounded-md transition-colors duration-200
                  ${
                    selectedCategory === null
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-indigo-100"
                  }`}
              >
                Todas las Categorías
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full text-left py-2 px-4 rounded-md transition-colors duration-200
                    ${
                      selectedCategory === category.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-indigo-100"
                    }`}
                >
                  {category.nombre}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
            Catálogo de Productos
          </h1>

          {products.length === 0 ? (
            <p className="text-center text-gray-600">
              No hay productos disponibles para esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full mx-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
                >
                  <img
                    src={
                      product.imagen_url?.startsWith("http")
                        ? product.imagen_url
                        : `${BACKEND_URL}${product.imagen_url}`
                    }
                    alt={product.nombre}
                    // CAMBIO AQUÍ: de object-cover a object-contain
                    className="w-full h-48 object-contain"
                  />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {product.nombre}
                      </h2>
                      <p className="text-indigo-600 font-bold mt-2">
                        ${Number(product.precio_venta).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/producto/${product.id}`)}
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Catalog;
