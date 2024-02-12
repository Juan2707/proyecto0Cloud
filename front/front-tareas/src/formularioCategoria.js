import React, { useState} from 'react';
import { useHistory } from 'react-router-dom'; 
import { crearCategoria } from './api';

function FormularioCategoria({ cerrarFormulario }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const history = useHistory();
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        await crearCategoria( { nombre, descripcion });
        history.push("/categorias"); // Usa history.push para redirigir
      } catch (error) {
        alert(error.message); // Muestra un mensaje de error si la creación falla
      }
    };
    
  
    return (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de la Categoría:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label>
            Descripción de la Categoría:
            <textarea type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
          </label>
          <button type="submit">Crear Categoría</button>
        </form>
      );
  }
  export default FormularioCategoria;