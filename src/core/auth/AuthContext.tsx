import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, DecodedToken, isValidUserRole } from './types';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');

      if (storedToken) {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setToken(storedToken);

          const userId = decodedToken.sub;
          const userRoleString = decodedToken.role;

          if (userId && userRoleString && isValidUserRole(userRoleString)) {
            setToken(storedToken);
            setUser({ id: userId, role: userRoleString });
          } else {
            console.warn(
              `AuthProvider: Token valid but missing user ID or invalid/missing role ('${userRoleString}').`
            );
            localStorage.removeItem('accessToken');
          }
        } else {
          localStorage.removeItem('accessToken');
        }
      }
    } catch (error) {
      console.error('AuthProvider: Error processing token from storage', error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);

    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);

      const userId = decoded.sub;
      const userRoleString = decoded.role;

      if (userId && userRoleString && isValidUserRole(userRoleString)) {
        setUser({ id: userId, role: userRoleString });
      } else {
        console.error(
          `Login: Decoded token missing user ID or invalid/missing role ('${userRoleString}').`
        );
        localStorage.removeItem('accessToken');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error('Login: Error decoding token:', e);

      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  }, []);

  const value = { token, user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
};
