import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Home/>} path="/" />
        <Route element={<Login/>} path="/login" />
        <Route element={<Signup/>} path="/signup" />
        <Route element={<ProtectedRoute><Dashboard/></ProtectedRoute>} path="/dashboard" />
      </Routes>
    </>
  )
}

export default App
