import {create} from 'zustand';


type AuthState = {
  token: string | null;
  username: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setUsername: (username: string | null) => void;
  setRole: (role: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  role: null,
  setToken: (token) => set({ token }),
  setUsername: (username) => set({ username }),
  setRole: (role) => set({ role }),
}));


// Helper function to get token safely
export const getToken = (): string => {
  const token = useAuthStore.getState().token;
  return token || '';
};
