import { useState, useCallback } from 'react'
import UsuariosServiceProxy from '../proxies/usuariosService'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
   
  const {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  } = UsuariosServiceProxy()

  const fetchUsuarios = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllUsuarios()
      if (data.success) {
        setUsuarios(data.data)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error al obtener usuarios:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsuarioById = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsuarioById(id)
      if (data.success) {
        return data.data
      }
    } catch (err) {
      setError(err.message)
      console.error('Error al obtener usuario:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUsuario = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await createUsuario(userData)
      if (data.success) {
        await fetchUsuarios() 
        return { success: true, data: data.data }
      }
      return { success: false, message: data.message }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUsuario = async (id, userData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await updateUsuario(id, userData)
      if (data.success) {
        await fetchUsuarios() 
        return { success: true, data: data.data }
      }
      return { success: false, message: data.message }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUsuario = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await deleteUsuario(id)
      if (data.success) {
        await fetchUsuarios() 
        return { success: true }
      }
      return { success: false, message: data.message }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    fetchUsuarioById,
    handleCreateUsuario,
    handleUpdateUsuario,
    handleDeleteUsuario,
  }
}