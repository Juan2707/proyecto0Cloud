import { useCallback, useEffect, useState } from 'react'; // Importa useState
import { getTarea, deleteTarea } from './api';
import { useAuth } from './AuthContext';
import { format, parseISO } from 'date-fns';
import { useParams, useHistory } from 'react-router-dom';

function Tarea() {
  const { user } = useAuth();
  const {tareaId} = useParams();
  const [tarea, setTarea] = useState(null); // Usa useState para gestionar el estado de 'tarea'
  const history = useHistory();
  const borrarTarea = () => {
    deleteTarea(tareaId, user.id, localStorage.getItem('token'));
    history.push("/tareas");
  }

  const navegarA = () => {
    history.push(`/editar_tarea/${tareaId}`);
  }
  const cargarTarea = useCallback(async () => {
    try {
      const data = await getTarea(tareaId, user.id, localStorage.getItem('token'));
      setTarea(data); 
    } catch (error) {
      console.error(error.message);
    }
  }, [tareaId, user.id]);

  useEffect(() => {
    cargarTarea();
  }, [cargarTarea]);

  if (!tarea) {
    return <div>Cargando detalles de la tarea...</div>;
  }

  const fechaCreacion = format(parseISO(tarea.fecha_creacion), 'dd/MM/yyyy - HH:mm');
  const fechaFinalizacion = tarea.fecha_finalizacion ? format(parseISO(tarea.fecha_finalizacion), 'dd/MM/yyyy - HH:mm') : 'Pendiente';

  return (
    <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
      <h3>{tarea.categoria}</h3>
      <p>{tarea.texto}</p>
      <p>Estado: {tarea.estado.llave}</p>
      <p>Fecha de creación: {fechaCreacion}</p>
      <p>Fecha de finalización: {fechaFinalizacion}</p>
      <button onClick={() => navegarA()}>ModificarTarea</button>
      <button onClick={() => borrarTarea()}>Borrar Tarea</button>
    </div>
  );
}

export default Tarea;
