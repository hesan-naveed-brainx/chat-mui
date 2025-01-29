import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'

function App() {

  return (
    <Routes>
        <Route element={<DefaultLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AuthLayout />}>
            <Route path="/home" element={<Home />} />
        </Route>
    </Routes>
  )
}

export default App
