import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Common/Header';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Admin Dashboard</h2>
        <Link to="/personal" className="btn btn-primary me-3">
          Manage Personal
        </Link>
        <Link to="/users" className="btn btn-primary">
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
