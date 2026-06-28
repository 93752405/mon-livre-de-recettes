import { createContext, useContext, useState, useEffect } from 'react'
import { githubService } from '../utils/github'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const auth = localStorage.getItem('mlr_auth')
    const admin = localStorage.getItem('mlr_admin')
    if (auth === 'true') setAuthenticated(true)
    if (admin === 'true') setIsAdmin(true)
  }, [])

  useEffect(() => {
    if (authenticated) loadRecipes()
  }, [authenticated])

  async function loadRecipes() {
    setLoading(true)
    setError(null)
    try {
      const data = await githubService.getRecipes()
      setRecipes(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function login(password) {
    const FAMILY_PASSWORD = import.meta.env.VITE_FAMILY_PASSWORD || 'recettes2024'
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2024'
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setIsAdmin(true)
      localStorage.setItem('mlr_auth', 'true')
      localStorage.setItem('mlr_admin', 'true')
      return 'admin'
    }
    if (password === FAMILY_PASSWORD) {
      setAuthenticated(true)
      setIsAdmin(false)
      localStorage.setItem('mlr_auth', 'true')
      localStorage.removeItem('mlr_admin')
      return 'family'
    }
    return false
  }

  function logout() {
    setAuthenticated(false)
    setIsAdmin(false)
    localStorage.removeItem('mlr_auth')
    localStorage.removeItem('mlr_admin')
  }

  async function saveRecipe(recipe) {
    await githubService.saveRecipe(recipe)
    await loadRecipes()
  }

  async function deleteRecipe(id) {
    await githubService.deleteRecipe(id)
    await loadRecipes()
  }

  return (
    <AppContext.Provider value={{
      authenticated, isAdmin, recipes, loading, error,
      login, logout, saveRecipe, deleteRecipe, loadRecipes
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
