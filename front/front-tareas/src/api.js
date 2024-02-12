// api.js
const BASE_URL = 'http://127.0.0.1:8080';

export const iniciarSesion = async (nombre, contrasena) => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/iniciar-sesion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, contrasena }),
    });
    if (!response.ok) {
      throw new Error('Error en el inicio de sesión');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};

export const registrarUsuario = async (nombre, contrasena, imagen) => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('contrasena', contrasena);
    if (imagen) {
      formData.append('imagen', imagen);
    }
  
    const response = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Error en el registro');
    }
    return response.json();
  };

export const fetchTareas = async (userId, token) => {
    console.log(userId)
    const response = await fetch(`${BASE_URL}/usuario/${userId}/tareas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error al cargar las tareas');
    return response.json();
  };

export const getTarea = async (tareaId, userId, token)=>{
  console.log(tareaId);
  const response = await fetch(`${BASE_URL}/usuario/${userId}/tareas/${tareaId}`,{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Error al cargar las tareas');
    return response.json();

}

export const updateTarea = async (tareaId, userId,json, token)=>{
  console.log(json);
  const response = await fetch(`${BASE_URL}/usuario/${userId}/tareas/${tareaId}`,{
    method: 'PUT',
    body: JSON.stringify(json),
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
  }
});
if (!response.ok) {
  throw new Error('Error en el registro');
}
return response.json();
};

export const deleteTarea = async (tareaId, userId, token) => {
  const response = await fetch(`${BASE_URL}/usuario/${userId}/tareas/${tareaId}`,{
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
  });
  if (!response.ok){
      throw new Error("No se pudo eliminar, algo salió mal");
  }
  return;
}



export const crearTarea = async (userId, token, datosTarea) => {
    const response = await fetch(`${BASE_URL}/usuario/${userId}/tareas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosTarea),
    });
  
    if (!response.ok) throw new Error('Error al crear la tarea');
    return response.json();
  };
  
  export const cargarCategorias = async () => {
    const respuesta = await fetch(`${BASE_URL}/categorias`);
    if (!respuesta.ok) throw new Error('No se pudieron cargar las categorías');
    return respuesta.json();
  };

  export const crearCategoria = async ( datosCategoria) => {
    console.log(datosCategoria);
    const response = await fetch(`${BASE_URL}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosCategoria),
    });
  
    if (!response.ok) throw new Error('No se pudo crear la categoría');
    return response.json();
  };


export const fetchCategorias = async () => {
    const response = await fetch(`${BASE_URL}/categorias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
      throw new Error('No se pudo obtener las categorías');
    }
    return response.json();
  };
  
export const deleteCategoria = async (id_categoria) => {
    const response = await fetch(`${BASE_URL}/categorias/${id_categoria}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
    });
    if (!response.ok){
        throw new Error("No se pudo eliminar, algo salió mal");
    }
    return;
}
  