// Login.js
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { iniciarSesion } from './api'; // Asegúrate de que la ruta sea correcta

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { handleLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await iniciarSesion(username, password);
      if (data.token && data.token !== "Null") {
        localStorage.setItem('token', data.token);
        handleLogin({ id: data.id, token: data.token });
        history.push('/tareas');
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("Error al intentar iniciar sesión. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        <div>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/registro">Registrarse</Link> 
    </div>
  );
}

export default Login;
