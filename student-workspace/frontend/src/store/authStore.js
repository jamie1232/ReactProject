import { create } from "zustand";
import api from "../api/client";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  async login(username, password) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/token/", { username, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      // simple “me” check – here we just store the username
      set({ user: { username }, loading: false });
    } catch (err) {
      set({ error: "Invalid credentials", loading: false });
    }
  },
  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ user: null });
  },
}));