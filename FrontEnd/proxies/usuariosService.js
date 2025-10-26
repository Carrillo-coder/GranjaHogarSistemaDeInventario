//import { API_BASE_URL } from '@env'

const API_BASE_URL = "http://10.34.18.73:5000";

const UsuariosServiceProxy = () => {
  const API_URL = API_BASE_URL;
  const baseUrl = `${API_URL}/api/inventario/usuarios`

  async function getAllUsuarios() {
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      if (response.status === 204) return { success: true, data: [] }
      throw new Error('Error al obtener usuarios')
    }
    
    return await response.json()
  }

  async function getUsuarioById(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      if (response.status === 204) throw new Error('Usuario no encontrado')
      throw new Error('Error al obtener usuario')
    }
    
    return await response.json()
  }

  async function getUsuarioByUserName(UserName) {
    const response = await fetch(`${baseUrl}/${UserName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      if (response.status === 204) throw new Error('Usuario no encontrado')
      throw new Error('Error al obtener usuario')
    }
    
    return await response.json()
  }

  async function createUsuario(userData) {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al crear usuario')
    }
    
    return await response.json()
  }

  async function updateUsuario(id, userData) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar usuario')
    }
    
    return await response.json()
  }

  async function deleteUsuario(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al eliminar usuario')
    }
    
    return await response.json()
  }

  return {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByUserName,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  }
}

export default UsuariosServiceProxy