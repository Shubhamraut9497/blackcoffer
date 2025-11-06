import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Login/>} path="/login" />
        <Route element={<Signup/>} path="/signup" />
        <Route element={<Dashboard/>} path="/dashboard" />
      </Routes>
    </>
  )
}

export default App
