import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RecipePage from './pages/RecipePage'
import RecipeFormPage from './pages/RecipeFormPage'
import ImportPage from './pages/ImportPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { authenticated, isAdmin } = useApp()
  if (!authenticated) return <LoginPage />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/mon-livre-de-recettes">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/recette/:id" element={<ProtectedRoute><RecipePage /></ProtectedRoute>} />
          <Route path="/ajouter" element={<ProtectedRoute adminOnly><RecipeFormPage /></ProtectedRoute>} />
          <Route path="/modifier/:id" element={<ProtectedRoute adminOnly><RecipeFormPage /></ProtectedRoute>} />
          <Route path="/importer" element={<ProtectedRoute adminOnly><ImportPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
