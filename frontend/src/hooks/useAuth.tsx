import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  displayName: string;
  email: string;
  // add more fields if needed
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Keep localStorage in sync when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token"); // optional
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
