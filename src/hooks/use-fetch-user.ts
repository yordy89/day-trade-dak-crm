import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import type { User } from '@/types/user';
import API from '@/lib/axios';

export const useFetchUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const authToken = useAuthStore((state) => state.authToken);

  return useQuery<User>({
    queryKey: ['userSession'],
    queryFn: async (): Promise<User> => {
      if (!authToken) throw new Error('No auth token found');
      const response = await API.get<User>('/user/profile');
      return response.data;
    },
    onSuccess: (data: User) => {
      setUser(data);
    },
    onError: () => {
      console.error('Error fetching user session');
    },
    enabled: Boolean(authToken),
    refetchOnWindowFocus: false,
    refetchOnMount: true, // ✅ Ensures fresh data on component mount
    retry: 1,
  } as UseQueryOptions<User>);
};
