import React, { useState, useEffect } from 'react';
import { fetchCategorias, deleteCategoria } from './api'; 
import { useHistory } from 'react-router-dom'; 

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const history=useHistory();

  useEffect(() => {
    const getCategorias = async () => {
        
      try {
        const data = await fetchCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    getCategorias();
  }, []);

  const borrarCategoria = (id) => {
    deleteCategoria(id);
    history.push("/tareas");
  }

  return (<div>
    <h2>Categorías</h2>
    <div>
      {categorias.map((categoria) => (
        <div key={categoria.id} style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          margin: '10px 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>{categoria.nombre}</h3>
          <p>{categoria.descripcion}</p>
          <button onClick={() => borrarCategoria(categoria.id)}>Borrar categoria</button>
        </div>
        
      ))}
    </div>
  </div>
  
  );
};

export default Categorias;
