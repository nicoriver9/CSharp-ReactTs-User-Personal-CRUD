import { Personal } from "../types/PersonalTypes";

const API_URL = "http://localhost:5077/api/Personal/";

export const fetchPersonal = async (token: string): Promise<Personal[]> => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
  return response.json();
};

export const updatePersonal = async (token: string, data: Personal): Promise<void> => {
  const response = await fetch(`${API_URL}${data.id}`, {
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

export const deactivatePersonal = async (token: string, id: number): Promise<void> => {
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

export const activatePersonal = async (token: string, id: number): Promise<void> => {
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

export const createPersonal = async (token: string, data: Personal): Promise<Personal> => {
  const response = await fetch(`${API_URL}create`, {
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
