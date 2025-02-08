import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import API from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';
import { User } from '@/types/user';

export const useFetchUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return useQuery<User, Error>({
    queryKey: ['userSession'],
    queryFn: async (): Promise<User> => {
      const response = await API.get<User>('/auth/me');
      return response.data;
    },
    onSuccess: (data: any) => {
      setUser(data); 
    },
    onError: () => {
      logout();
    },
    refetchOnWindowFocus: false,
    retry: 1,
  } as UseQueryOptions<User, Error>);
};
