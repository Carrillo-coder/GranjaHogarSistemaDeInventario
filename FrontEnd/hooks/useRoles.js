import { useState, useCallback } from 'react'
import RolesServiceProxy from '../proxies/rolesService'

export function useRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { getAllRoles } = RolesServiceProxy()

  const fetchRoles = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllRoles()
      if (data.success) {
        setRoles(data.data)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error al obtener roles:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRolById = (idRol) => {
    return roles.find(rol => rol.idRol === idRol)
  }

  const getRolByNombre = (nombre) => {
    return roles.find(rol => rol.nombre === nombre)
  }

  return {
    roles,
    loading,
    error,
    fetchRoles,
    getRolById,
    getRolByNombre,
  }
}