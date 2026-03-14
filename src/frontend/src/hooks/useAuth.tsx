import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthUser {
  username: string;
  name: string;
}

interface StoredUser {
  username: string;
  name: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "intellihub_users";
const SESSION_KEY = "intellihub_session";

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.username === username && u.password === password,
    );
    if (!found) {
      throw new Error("Invalid username or password");
    }
    const authUser: AuthUser = { username: found.username, name: found.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const register = async (name: string, username: string, password: string) => {
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      throw new Error("Username already taken");
    }
    const newUser: StoredUser = { username, name, password };
    saveUsers([...users, newUser]);
    const authUser: AuthUser = { username, name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
