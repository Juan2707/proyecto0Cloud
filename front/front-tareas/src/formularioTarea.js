import React, { useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import { crearTarea, cargarCategorias } from './api';
import {useAuth} from './AuthContext';

function FormularioTarea() {
    const { user } = useAuth();
    const userId=user.id;
    const [texto, setTexto] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [fechaFinalizacion, setFechaFinalizacion] = useState('');
    const [estado, setEstado] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const history = useHistory();

    useEffect(()=>{
        cargarCategorias().then(setCategorias).catch(error => alert(error.message));
    },[]);
    const handleSubmit = async (e) => {
      e.preventDefault();
      //console.log({ texto, fecha_creacion: fechaCreacion, fecha_finalizacion: fechaFinalizacion, estado })
      const token = localStorage.getItem('token');
      const datosTarea = {
        texto, 
        fecha_creacion: fechaCreacion+"T00:01:00.000000", 
        fecha_finalizacion: fechaFinalizacion+"T23:59:00.000000", 
        estado, 
        categoria_id: categoriaId
      };
      try {
        await crearTarea(userId, token, datosTarea);
        history.push("/tareas");
      } catch (error) {
        alert(error.message);
      }
    };
  
    return (
        <form onSubmit={handleSubmit}>
          <label>
            Texto de la Tarea:
            <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} required />
          </label>
          <label>
            Fecha de Creación:
            <input type="date" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)} required />
          </label>
          <label>
            Fecha de Finalización:
            <input type="date" value={fechaFinalizacion} onChange={(e) => setFechaFinalizacion(e.target.value)} />
          </label>
          <label>
            Estado:
            <select value={estado} onChange={(e) => setEstado(e.target.value)} required>
              <option value="">Seleccione un estado</option>
              <option value="SIN_EMPEZAR">Sin Empezar</option>
              <option value="EMPEZADA">Empezada</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
          </label>
          <label>
        Categoría:
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </label>
          <button type="submit">Crear Tarea</button>
        </form>
      );
  }
  
  export default FormularioTarea;