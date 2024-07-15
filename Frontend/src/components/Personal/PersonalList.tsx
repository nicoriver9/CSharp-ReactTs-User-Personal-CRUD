
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore, getToken } from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { Personal } from "../../types/PersonalTypes";
import { fetchPersonal, updatePersonal, deactivatePersonal, activatePersonal, createPersonal } from "../../helpers/personalService";
import Header from '../Common/Header';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export default function PersonalList() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const role = useAuthStore((state) => state.role);
  const token = getToken();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPersonal, setCurrentPersonal] = useState<Personal | null>(null);
  const [alert, setAlert] = useState<{ type: string, message: string } | null>(null);

  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Personal>();

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<Personal>();

  useEffect(() => {
    if (!token) {      
      navigate("/login");
      return;
    }

    const getPersonal = async () => {
      try {
        const data = await fetchPersonal(token);
        setPersonal(data);

        if (data.length > 0) {
          setKeys(Object.keys(data[0]));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getPersonal();

  }, [token, navigate]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleEdit = (p: Personal) => {
    setCurrentPersonal(p);
    Object.keys(p).forEach((key) => {
      setValue(key as keyof Personal, (p as any)[key]);
    });
    setShowModal(true);
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivatePersonal(token, id);
      setPersonal((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
      setAlert({ type: 'success', message: `Personal con id ${id} ha sido desactivado.` });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al desactivar personal.' });
      console.error("Error:", error);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activatePersonal(token, id);
      setPersonal((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
      );
      setAlert({ type: 'success', message: `Personal con id ${id} ha sido activado.` });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al activar personal.' });
      console.error("Error:", error);
    }
  };

  const handleSave = async (data: Personal) => {
    try {
      await updatePersonal(token, data);
      setPersonal((prev) =>
        prev.map((p) => (p.id === data.id ? { ...data } : p))
      );
      setAlert({ type: 'success', message: `Personal con id ${data.id} ha sido actualizado.` });
      setShowModal(false);
      reset();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al actualizar personal.' });
      console.error("Error:", error);
    }
  };

  const handleAdd = async (data: Personal) => {
    try {
      const newPersonal = await createPersonal(token, data);
      setPersonal((prev) => [...prev, newPersonal]);
      setAlert({ type: 'success', message: `Personal con id ${newPersonal.id} ha sido agregado.` });
      setShowAddModal(false);
      resetAdd();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al agregar personal.' });
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
          <h1>Listado de Personal</h1>
          {role === 'admin' && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <FontAwesomeIcon icon={faPlus} /> Agregar Personal
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
            {personal.map((p) => (
              <tr key={p.id}>
                {keys.map((key) => (
                  key === 'isActive' ? (
                    <td key={key}>
                      {p.isActive ? (
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={role === 'admin' ? () => handleDeactivate(p.id) : undefined} 
                          disabled={role !== 'admin'}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success btn-sm" 
                          onClick={role === 'admin' ? () => handleActivate(p.id) : undefined} 
                          disabled={role !== 'admin'}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}
                    </td>
                  ) : (
                    <td key={key}>{(p as any)[key]}</td>
                  )
                ))}
                {role === 'admin' && (
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(p)}>
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
            <Modal.Title>Editar Personal</Modal.Title>
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
            <Modal.Title>Agregar Personal</Modal.Title>
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
