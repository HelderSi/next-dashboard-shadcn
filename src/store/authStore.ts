// store/authStore.ts
import {
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    sendPasswordResetLink
} from "@/service/authService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
    setUser: (user: any) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearUser: () => void;
    loginUser: (email: string, password: string) => Promise<void>;
    loginUserWithGoogle: () => Promise<void>;
    logoutUser: () => Promise<void>;
    sendPasswordResetLink: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,
            setUser: (user) => set({ user }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearUser: () => set({ user: null }),
            loginUser: async (email, password) => {
                set({ loading: true });
                try {
                    const { user, error } = await loginWithEmailAndPassword(email, password);
                    if (error) {
                        set({ error });
                        return;
                    }
                    set({ user });
                } catch (error) {
                    console.error("Login failed", error);
                } finally {
                    set({ loading: false });
                }
            },
            loginUserWithGoogle: async () => {
                set({ loading: true });
                try {
                    const { user, error } = await loginWithGoogle();
                    if (error) {
                        set({ error });
                        return;
                    }
                    set({ user });
                } catch (error) {
                    console.error("Login failed", error);
                } finally {
                    set({ loading: false });
                }
            },
            sendPasswordResetLink: async (email: string) => {
                set({ loading: true });
                try {
                    sendPasswordResetLink(email);
                } catch (error) {
                    set({ error: "Password reset failed" });
                    console.error("Login failed", error);
                } finally {
                    set({ loading: false });
                }
            },
            logoutUser: async () => {
                await logout();
                set({ user: null });
            },
        }),
        {
            name: "auth-store", // Key in localStorage
            partialize: (state) => ({
                user: state.user ? {
                    email: state.user.email,
                    displayName: state.user.displayName,
                } : null
            })
        }
    )
);
