import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const POSRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Para errores de validación y de backend
  const navigate = useNavigate();

  // Lista de dominios de correo electrónico populares permitidos
  const ALLOWED_EMAIL_DOMAINS = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "zoho.com",
    "mail.com",
    // Puedes añadir más dominios si lo deseas
  ];

  // Función para validar el dominio del correo electrónico
  const isValidEmailDomain = (email) => {
    if (!email || typeof email !== "string") {
      return false;
    }
    const domain = email.split("@")[1]; // Obtiene la parte después del '@'
    if (!domain) {
      return false; // No hay dominio o el formato es incorrecto
    }
    // Compara el dominio con la lista de dominios permitidos (sin importar mayúsculas/minúsculas)
    return ALLOWED_EMAIL_DOMAINS.includes(domain.toLowerCase());
  };

  // Función para mostrar alertas personalizadas (reemplazando alert())
  const displayAlert = (message, type = "error") => {
    setError(message); // Usamos el mismo estado 'error' para mostrar el mensaje
    // Opcional: podrías usar un estado diferente para tipo de alerta (éxito/error)
    setTimeout(() => {
      setError(null); // Limpiar el mensaje después de un tiempo
    }, 5000); // Mensaje visible por 5 segundos
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // 1. Validación del dominio del correo electrónico
    if (!isValidEmailDomain(email)) {
      displayAlert(
        "Por favor, usa un correo electrónico de un dominio popular (ej. gmail.com, hotmail.com, outlook.com)."
      );
      return; // Detiene el proceso si el dominio no es válido
    }

    // 2. Validación básica de campos (puedes añadir más si lo necesitas)
    if (!username.trim() || !email.trim() || !password.trim()) {
      displayAlert("Todos los campos son obligatorios.");
      return;
    }
    if (password.length < 6) {
      // Ejemplo de validación de contraseña
      displayAlert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/pos/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      displayAlert(
        "Registro exitoso. Verifica tu correo antes de iniciar sesión.",
        "success"
      );
      navigate("/poslogin");
    } catch (err) {
      console.error("❌ Error al registrar:", err.message);
      displayAlert(err.message || "Hubo un problema al registrar la cuenta.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex justify-center h-screen w-full">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Brothers Sublima
              </h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Regístrate para comenzar a usar el sistema del punto de venta.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-700 dark:text-white">
                Registrarse
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Ingresa tus datos para crear una cuenta
              </p>
            </div>

            <div className="mt-8">
              {/* Aquí se mostrarán los mensajes de error/alerta */}
              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              <form onSubmit={handleRegister}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Tu nombre"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Registrarse
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    onClick={() => navigate("/poslogin")}
                    className="text-blue-500 hover:underline"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSRegister;
