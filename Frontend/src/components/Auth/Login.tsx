import * as React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/useAuthStore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const setToken = useAuthStore((state) => state.setToken);
  const setUsername = useAuthStore((state) => state.setUsername);
  const setRole = useAuthStore((state) => state.setRole);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:5077/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const { token, role } = result;

        // Almacenar el token, el rol y el nombre de usuario en Zustand
        setToken(token);
        setUsername(data.username);
        setRole(role);

        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'user') {
          navigate('/personal');
        }
      } else {
        console.error('Login failed');
        setShowErrorModal(true); // Mostrar modal de error
      }
    } catch (error) {
      console.error('Error:', error);
      setShowErrorModal(true); // Mostrar modal de error
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            className="form-control"
            {...register('username', { required: true })}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
          {errors.username?.type === 'required' && (
            <div className="alert alert-danger" role="alert">
              Username is required
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            {...register('password', { required: true })}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password?.type === 'required' && (
            <div className="alert alert-danger" role="alert">
              Password is required
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error de Inicio de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Usuario y/o contraseña incorrectos.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
