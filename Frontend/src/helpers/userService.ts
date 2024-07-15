// src/services/UserService.ts
import { User } from "../types/UserTypes";

const API_URL = "http://localhost:5077/api/auth/";

export const fetchUsers = async (token: string): Promise<User[]> => {
  const response = await fetch(`${API_URL}users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
  return response.json();
};

export const updateUser = async (token: string, data: User): Promise<void> => {
  const response = await fetch(`${API_URL}users/${data.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
};

export const deactivateUser = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}deactivate/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
};

export const addUser = async (token: string, data: User): Promise<User> => {
  const response = await fetch(`${API_URL}register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
  return response.json();
};

export const activateUser = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}activate/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
};
