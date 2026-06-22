"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// LOCAL-ONLY accounts. The headless backend can't authenticate from here (no
// JWT endpoint; the WP login is reCAPTCHA + attempt-limited), so this is a
// self-contained, browser-side account system — no requests ever leave the app
// and nothing redirects to invitemart.in. Swap the register/login bodies for
// real API calls once the backend exposes a JWT (or similar) auth endpoint.

const USERS_KEY = "im_users"; // registered accounts (local demo store)
const SESSION_KEY = "im_session"; // currently logged-in email

export interface User {
  name: string;
  email: string;
}

interface StoredUser extends User {
  // Not real security — a local placeholder until backend auth exists.
  pass: string;
}

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (
    name: string,
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restore the session on mount.
  useEffect(() => {
    try {
      const email = localStorage.getItem(SESSION_KEY);
      if (email) {
        const found = readUsers().find((u) => u.email === email);
        if (found) setUser({ name: found.name, email: found.email });
      }
    } catch {
      /* ignore */
    } finally {
      setReady(true);
    }
  }, []);

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const e = email.trim().toLowerCase();
      if (!name.trim()) return { ok: false, error: "Please enter your name." };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))
        return { ok: false, error: "Please enter a valid email." };
      if (password.length < 6)
        return { ok: false, error: "Password must be at least 6 characters." };

      const users = readUsers();
      if (users.some((u) => u.email === e))
        return { ok: false, error: "An account with this email already exists." };

      users.push({ name: name.trim(), email: e, pass: password });
      writeUsers(users);
      localStorage.setItem(SESSION_KEY, e);
      setUser({ name: name.trim(), email: e });
      return { ok: true };
    },
    []
  );

  const login = useCallback((email: string, password: string) => {
    const e = email.trim().toLowerCase();
    const found = readUsers().find((u) => u.email === e);
    if (!found || found.pass !== password)
      return { ok: false, error: "Incorrect email or password." };
    localStorage.setItem(SESSION_KEY, e);
    setUser({ name: found.name, email: found.email });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value: AuthContextValue = { user, ready, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
