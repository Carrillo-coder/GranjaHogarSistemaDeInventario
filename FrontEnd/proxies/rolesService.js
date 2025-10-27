//import { API_BASE_URL } from '@env'
const API_BASE_URL = "http://192.168.1.67:5000";

const RolesServiceProxy = () => { 
  const API_URL = API_BASE_URL;
  const baseUrl = `${API_URL}/api/inventario/roles`

  async function getAllRoles() {
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      if (response.status === 204) return { success: true, data: [] }
      throw new Error('Error al obtener roles')
    }
    
    return await response.json()
  }

  return {
    getAllRoles,
  }
}

export default RolesServiceProxy