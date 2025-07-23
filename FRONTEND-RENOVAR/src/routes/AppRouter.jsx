// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta para la página de inicio */}
      <Route path="/" element={<HomePage />} />

      {/* Ruta para la página de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Aquí podemos agregar más rutas en el futuro (ej. /dashboard, /profile) */}
    </Routes>
  );
};