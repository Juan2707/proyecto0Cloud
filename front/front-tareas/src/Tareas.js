import { format, parseISO } from 'date-fns';
import React, { useState, useEffect, useCallback } from 'react';
import {  Link } from 'react-router-dom';
import {useAuth} from './AuthContext';
import { fetchTareas } from './api';
import { useHistory } from 'react-router-dom'; 

function Tarea({ tarea }) {
    const fechaCreacion = format(parseISO(tarea.fecha_creacion), 'dd/MM/yyyy - HH:mm');
    const fechaFinalizacion = tarea.fecha_finalizacion ? format(parseISO(tarea.fecha_finalizacion), 'dd/MM/yyyy - HH:mm') : 'Pendiente';

    const history = useHistory();

    const navegarA = () => {
      history.push(`/tareas/${tarea.id}`); // Asegúrate de acceder al id con tarea.id
    }

    return (
      <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
        <h3>{tarea.categoria}</h3>
        <p>{tarea.texto}</p>
        <p>Estado: {tarea.estado.llave}</p>
        <p>Fecha de creación: {fechaCreacion}</p>
        <p>Fecha de finalización: {fechaFinalizacion}</p>
        <button onClick={() => navegarA()}>Ver detalles</button>
      </div>
    );
  }

function Tareas() {
    const [tareas, setTareas] = useState([]);
    const { user } = useAuth();
    
    const cargarTareas = useCallback(async()=>{
        try {
            const data = await fetchTareas(user.id, localStorage.getItem('token'));
            setTareas(data);
          } catch (error) {
            console.error(error.message);
          }

    },[user.id]);
    


      useEffect(() => {
        cargarTareas();
      }, [cargarTareas]);
  
  

  
  
  return (
    <div>
      {tareas.map((tarea) => (
        <Tarea key={tarea.id} tarea={tarea} />
      ))}
     
     <Link to="/tareas/crear">Crear nueva tarea</Link> 
     <Link to="/categorias/crear">Crear nueva categoria</Link> 
     <Link to="/categorias">Ver categorias</Link> 
    </div>
  );
}

export default Tareas;
