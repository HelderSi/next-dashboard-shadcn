import { auth, googleProvider } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

export const logout = async () => {
    await signOut(auth);
    await fetch("/api/auth/logout", { method: "POST" });
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        return {
            error: errorData.error
        };
    }
    return {
        user: result.user
    }
}

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        return {
            error: errorData.error
        };
    }
    return {
        user: result.user
    }
}

export const sendPasswordResetLink = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};