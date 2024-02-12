import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getTarea,  updateTarea } from './api';
import { useAuth } from './AuthContext';

function EditarTarea() {
    const { id } = useParams(); // Obtiene el ID de la tarea desde la URL
    const history = useHistory(); // Hook para navegar programáticamente
    const { user } = useAuth(); // Obtiene información del usuario autenticado
    const [tarea, setTarea] = useState({
        texto: '',
        fecha_creacion: '',
        fecha_finalizacion: '',
        estado: ''
    });

    useEffect(() => {
        const cargarTarea = async () => {
            try {
                const data = await getTarea(id, user.id, localStorage.getItem('token'));
                setTarea({
                    texto: data.texto || '',
                    fecha_creacion: data.fecha_creacion?.split('T')[0]+"T00:01:00.000000" || '', // Ajusta para obtener solo la fecha
                    fecha_finalizacion: data.fecha_finalizacion?.split('T')[0]+"T23:59:00.000000" || '', // Ajusta para obtener solo la fecha
                    estado: data.estado || ''
                });
            } catch (error) {
                console.error("Error al cargar la tarea:", error);
            }
        };
        cargarTarea();
    }, [id, user.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setTarea({ ...tarea, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tareaEditada = {
            texto:tarea.texto, 
            fecha_creacion: tarea.fecha_creacion+"T00:01:00.000000", 
            fecha_finalizacion: tarea.fecha_finalizacion+"T23:59:00.000000", 
            estado:tarea.estado
          };

        try {
            await updateTarea(id, user.id, tareaEditada, localStorage.getItem('token'));
            alert('Tarea actualizada correctamente');
            history.push("/tareas");
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Texto de la Tarea:
                <input type="text" name="texto" value={tarea.texto} onChange={handleChange} required />
            </label>
            <label>
                Fecha de Creación:
                <input type="date" name="fecha_creacion" value={tarea.fecha_creacion} onChange={handleChange} required />
            </label>
            <label>
                Fecha de Finalización:
                <input type="date" name="fecha_finalizacion" value={tarea.fecha_finalizacion} onChange={handleChange} />
            </label>
            <label>
                Estado:
                <select name="estado" value={tarea.estado} onChange={handleChange} required>
                    <option value="">Seleccione un estado</option>
                    <option value="SIN_EMPEZAR">Sin Empezar</option>
                    <option value="EMPEZADA">Empezada</option>
                    <option value="FINALIZADA">Finalizada</option>
                </select>
            </label>
            <button type="submit">Actualizar Tarea</button>
        </form>
    );
}

export default EditarTarea;
