import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importa la URL del backend desde las variables de entorno
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  // Nuevos estados para la alerta personalizada
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // Para el modal de confirmación
  const [actionToConfirm, setActionToConfirm] = useState(null); // Almacena la acción a confirmar

  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para mostrar alertas personalizadas
  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 3000); // Ocultar después de 3 segundos
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      // Usa BACKEND_URL en lugar de localhost
      const response = await fetch(`${BACKEND_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Manejo de errores si la respuesta no es OK
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al obtener las categorías."
        );
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error al obtener las categorías:", err.message);
      displayAlert(`Error al cargar categorías: ${err.message}`);
    }
  };

  // Función para manejar el archivado de categorías (con confirmación personalizada)
  const handleArchive = (id) => {
    setActionToConfirm(() => () => archiveCategoryConfirmed(id)); // Almacena la acción con el ID
    setIsConfirming(true); // Muestra el modal de confirmación
    setAlertMessage("¿Deseas archivar esta categoría?"); // Mensaje para el modal
  };

  const archiveCategoryConfirmed = async (id) => {
    setIsConfirming(false); // Oculta el modal de confirmación
    setActionToConfirm(null); // Limpia la acción

    try {
      const token = localStorage.getItem("token");
      // Usa BACKEND_URL en lugar de localhost
      const response = await fetch(
        `${BACKEND_URL}/api/categories/${id}/archivar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al archivar categoría");
      }

      // Actualizar lista quitando la categoría archivada
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      displayAlert("✅ Categoría archivada exitosamente.");
    } catch (err) {
      console.error("❌ Error al archivar categoría:", err.message);
      displayAlert(`Ocurrió un error al archivar la categoría: ${err.message}`);
    }
  };

  const handleToggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Función para manejar la confirmación (sí)
  const handleConfirmYes = () => {
    if (actionToConfirm) {
      actionToConfirm(); // Ejecuta la acción almacenada
    }
    setIsConfirming(false);
    setActionToConfirm(null);
    setShowAlert(false); // Oculta la alerta si estaba visible
  };

  // Función para manejar la cancelación (no)
  const handleConfirmNo = () => {
    setIsConfirming(false);
    setActionToConfirm(null);
    setShowAlert(false); // Oculta la alerta si estaba visible
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Categorías</h2>
          <button
            onClick={() => navigate("/add-categorie")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Agregar Categoría
          </button>
        </div>

        <ul className="divide-y">
          {categories.map((category) => (
            <li
              key={category.id}
              className="py-3 flex justify-between items-center"
            >
              <span className="text-gray-800">{category.nombre}</span>

              <div className="relative">
                <button
                  onClick={() => handleToggleMenu(category.id)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ⋮
                </button>

                {openMenuId === category.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => navigate(`/edit-categorie/${category.id}`)}
                    >
                      Modificar
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-yellow-600"
                      onClick={() => handleArchive(category.id)} // Llama a handleArchive que mostrará la confirmación
                    >
                      Archivar
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Alerta personalizada (para mensajes generales) */}
      {showAlert && !isConfirming && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          {alertMessage}
        </div>
      )}

      {/* Modal de Confirmación (para acciones como archivar) */}
      {isConfirming && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-lg font-semibold mb-4">{alertMessage}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmYes}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Sí
              </button>
              <button
                onClick={handleConfirmNo}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
