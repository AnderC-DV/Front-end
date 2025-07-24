import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Aquí se deja la puerta abierta para integración con el backend
    // Ejemplo: await loginApi(email, password)
    setTimeout(() => {
      setLoading(false);
      if (email === "demo@demo.com" && password === "demo") {
        if (onLogin) onLogin();
      } else {
        setError("Credenciales inválidas");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-full p-3 mb-2">
            {/* Icono tipo edificio/finanzas, puedes cambiar por un logo real */}
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#2563eb"/><path d="M7 17V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 17v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-2xl font-bold text-blue-700 tracking-tight">FinanceHub</span>
          <span className="text-sm text-gray-500">Plataforma de comunicaciones</span>
        </div>
        <form
          className="bg-white p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Correo</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@correo.com"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition shadow"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">© 2025 FinanceHub. Todos los derechos reservados.</div>
      </div>
    </div>
  );
};

export default LoginPage;