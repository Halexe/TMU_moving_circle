import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  rank: string;
}

interface AuthContextType {
  user: User | null;
  login: (id: string, code: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Initial check

  // Simulate session check
  useEffect(() => {
    const storedUser = localStorage.getItem('tmu_tactical_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (id: string, code: string) => {
    setIsLoading(true);
    // Simulate network delay for dramatic effect
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const tacticalUser = {
          id,
          name: `Agent_${id.slice(-4)}`, // Generate a cool agent name
          rank: 'Operative'
        };
        setUser(tacticalUser);
        localStorage.setItem('tmu_tactical_user', JSON.stringify(tacticalUser));
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tmu_tactical_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};