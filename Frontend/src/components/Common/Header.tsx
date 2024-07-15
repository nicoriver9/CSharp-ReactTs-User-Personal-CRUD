import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const setToken = useAuthStore((state) => state.setToken);
    const username = useAuthStore((state) => state.username);
    const role = useAuthStore((state) => state.role);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      setToken(null);
      navigate('/login');
    };
  
    return (
      <header className="bg-light p-3 d-flex justify-content-between align-items-center">
        <div>
          <strong>User:</strong> {username} <br />
          <strong>Role:</strong> {role}
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </header>
    );
  };
  
  export default Header;
  