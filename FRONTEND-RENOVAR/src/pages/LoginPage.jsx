// src/pages/LoginPage.jsx
import React, { useState } from 'react'; // <-- 1. Importamos useState

const LoginPage = () => {
  // 2. Usamos useState para guardar el valor de los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Esta función se ejecutará cuando se envíe el formulario.
  //    Por ahora, solo mostrará los datos en la consola del navegador.
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue
    console.log('Enviando datos:', { email, password });
    // Aquí, en el futuro, irá la llamada a la API del back-end.
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado 'email'
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado 'password'
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;