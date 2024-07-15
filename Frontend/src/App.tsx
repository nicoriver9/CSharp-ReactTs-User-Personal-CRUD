import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import AdminDashboard from './components/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';
import PersonalList from "./components/Personal/PersonalList";
import UserList from "./components/Users/UserList";  // Importar el nuevo componente
import ProtectedRoute from './components/Auth/ProtectedRoute';

export const App: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>

          <Route 
            path="/personal" 
            element={token && (role === 'user' || role === 'admin') ? <PersonalList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={token && role === 'admin' ? <UserList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={
              token ? (
                role === 'admin' ? (
                  <Navigate to="/admin-dashboard" />
                ) : (
                  <Navigate to="/personal" />
                )
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}
