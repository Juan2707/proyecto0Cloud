import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Para redireccionar después del registro
import { registrarUsuario } from './api';

function Registro({ onRegistroCompleto }) {
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const history = useHistory();

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();

      
      try {
        const data = await registrarUsuario(nombre, contrasena, selectedImage);
        console.log('Registro exitoso', data);
        localStorage.setItem('token', data.token);
        history.push('/tareas'); // Redirige al usuario a las tareas después del registro
      } catch (error) {
        console.error('Error al intentar enviar el formulario', error);
        alert("Error en el registro.");
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Contraseña:
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        </label>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Registrar</button>
      </form>
    );
  }

  export default Registro;
  