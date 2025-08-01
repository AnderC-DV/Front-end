// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginBgImage from '../assets/LogoAT.png';
import loginIllustration from '../assets/ilustracion-login.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIdentifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://backend-475190189080.us-central1.run.app/api/v1/auth/login/check-identifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Usuario no encontrado");
      }

      const data = await response.json();
      if (data.first_time) {
        setStep("firstTime");
      } else {
        setStep("password");
      }
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const response = await fetch("https://backend-475190189080.us-central1.run.app/api/v1/auth/login/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Credenciales inválidas");
      }

      const tokenData = await response.json();
      localStorage.setItem('authToken', JSON.stringify(tokenData));

      try {
        const payloadBase64 = tokenData.access_token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        // Extraer y normalizar el rol
        let userRole = 'Usuario'; // Rol por defecto
        if (decodedPayload.roles && Array.isArray(decodedPayload.roles) && decodedPayload.roles.length > 0) {
          const role = decodedPayload.roles[0];
          userRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        } else if (decodedPayload.role) {
          const role = decodedPayload.role;
          userRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        }

        const userData = {
          name: decodedPayload.full_name || 'Usuario',
          role: userRole,
        };
        
        login(userData);
        navigate("/");
      } catch (error) {
        localStorage.removeItem('authToken');
        throw new Error("Token de autenticación inválido: " + error.message);
      }

    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleFirstTime = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://backend-475190189080.us-central1.run.app/api/v1/auth/login/first-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password: newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "No se pudo crear la contraseña");
      }
      setPassword(newPassword);
      setStep("password");
      setError("Contraseña creada, por favor ingresa de nuevo.");
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 p-12 relative">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={loginIllustration}
            alt="Ilustración de finanzas y tecnología"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-end h-full p-8 text-center pb-10">
          <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-lg">Gestión Financiera Inteligente</h2>
          <p className="mt-2 text-gray-200 max-w-md drop-shadow-lg">Potencia tus decisiones con datos y automatización.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-4">
            <img src={loginBgImage} alt="Logo AuraTech" className="w-35 h-35 object-contain mb-1" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido a AuraTech</h1>
            <p className="text-gray-600">El corazon de Renovar Financiera</p>
          </div>
          {step === "identifier" && (
            <form onSubmit={handleIdentifier} className="w-full">
              <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Inicia Sesión</h2>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Correo Electrónico - Usuario Admminfo</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="usuario@correo.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300">
                {loading ? "Verificando..." : "Siguiente"}
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handlePassword} className="w-full">
                <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Ingresa tu contraseña</h2>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300">
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
          )}

          {step === "firstTime" && (
             <form onSubmit={handleFirstTime} className="w-full">
                <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Crea tu contraseña</h2>
                <p className="text-sm text-center text-gray-500 mb-4">Es tu primer acceso. Por favor, crea una contraseña segura.</p>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Nueva contraseña</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300">
                    {loading ? "Creando..." : "Crear y Continuar"}
                </button>
             </form>
          )}

          {error && <div className="mt-4 text-red-600 text-sm text-center">{error}</div>}

          <p className="mt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} AuraTech. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
