import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore, getToken } from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { User } from "../../types/UserTypes";
import { fetchUsers, updateUser, deactivateUser, activateUser, addUser } from "../../helpers/userService";
import Header from '../Common/Header';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const role = useAuthStore((state) => state.role);
  const token = getToken();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{ type: string, message: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<User>();

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<User>();

  useEffect(() => {
    if (!token) {      
      navigate("/login");
      return;
    }

    const getUsers = async () => {
      try {
        const data = await fetchUsers(token);
        setUsers(data);

        if (data.length > 0) {
          setKeys(Object.keys(data[0]));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUsers();

  }, [token, navigate]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleEdit = (u: User) => {
    setCurrentUser(u);
    Object.keys(u).forEach((key) => {
      setValue(key as keyof User, (u as any)[key]);
    });
    setShowModal(true);
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateUser(token, id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: false } : u))
      );
      setAlert({ type: 'success', message: `Usuario con id ${id} ha sido desactivado.` });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al desactivar usuario.' });
      console.error("Error:", error);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activateUser(token, id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: true } : u))
      );
      setAlert({ type: 'success', message: `Usuario con id ${id} ha sido activado.` });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al activar usuario.' });
      console.error("Error:", error);
    }
  };

  const handleSave = async (data: User) => {
    try {
      await updateUser(token, data);
      setUsers((prev) =>
        prev.map((u) => (u.id === data.id ? { ...data } : u))
      );
      setAlert({ type: 'success', message: `Usuario con id ${data.id} ha sido actualizado.` });
      setShowModal(false);
      reset();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al actualizar usuario.' });
      console.error("Error:", error);
    }
  };

  const handleAdd = async (data: User) => {
    try {
      const newUser = await addUser(token, data);
      setUsers((prev) => [...prev, newUser]);
      setAlert({ type: 'success', message: `Usuario con id ${newUser.id} ha sido agregado.` });
      setShowAddModal(false);
      resetAdd();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al agregar usuario.' });
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
  };

  const handleAddClose = () => {
    setShowAddModal(false);
    resetAdd();
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        {alert && (
          <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
            {alert.message}
          </Alert>
        )}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Listado de Usuarios</h1>
          {role === 'admin' && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <FontAwesomeIcon icon={faPlus} /> Agregar Usuario
            </Button>
          )}
        </div>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              {keys.map((key) => (
                <th key={key}>{key}</th>
              ))}
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                {keys.map((key) => (
                  key === 'isActive' ? (
                    <td key={key}>
                      {u.isActive ? (
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={role === 'admin' ? () => handleDeactivate(u.id) : undefined} 
                          disabled={role !== 'admin'}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success btn-sm" 
                          onClick={role === 'admin' ? () => handleActivate(u.id) : undefined} 
                          disabled={role !== 'admin'}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}
                    </td>
                  ) : (
                    <td key={key}>{(u as any)[key]}</td>
                  )
                ))}
                {role === 'admin' && (
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(u)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(handleSave)}>
              <Form.Group controlId="formApellidoNombre">
                <Form.Label>Apellido y Nombre</Form.Label>
                <Form.Control
                  type="text"
                  {...register("apellidoNombre", { required: true })}
                  isInvalid={!!errors.apellidoNombre}
                />
                <Form.Control.Feedback type="invalid">
                  Apellido y Nombre es requerido.
                </Form.Control.Feedback>
              </Form.Group>
              {/* Add more form fields as needed */}
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showAddModal} onHide={handleAddClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitAdd(handleAdd)}>
              <Form.Group controlId="formAddApellidoNombre">
                <Form.Label>Apellido y Nombre</Form.Label>
                <Form.Control
                  type="text"
                  {...registerAdd("apellidoNombre", { required: true })}
                  isInvalid={!!errorsAdd.apellidoNombre}
                />
                <Form.Control.Feedback type="invalid">
                  Apellido y Nombre es requerido.
                </Form.Control.Feedback>
              </Form.Group>
              {/* Add more form fields as needed */}
              <Button variant="primary" type="submit">
                Agregar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
