import { useState, useEffect, useContext, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, type User, type LoginRequest, type SignupRequest } from '@/lib/api';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch user profile on mount if authenticated
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    enabled: apiClient.isAuthenticated(),
    retry: false,
  });

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
    setLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['profile'], data.user);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (userData: SignupRequest) => apiClient.signup(userData),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['profile'], data.user);
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const signup = async (userData: SignupRequest) => {
    await signupMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
