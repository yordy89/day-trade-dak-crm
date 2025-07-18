import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/user';
import { userService } from '@/services/api/user.service';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useAuthStore } from '@/store/auth-store';

export const useFetchUser = () => {
  const { authToken } = useClientAuth();

  return useQuery<User>({
    queryKey: ['userSession'],
    queryFn: async (): Promise<User> => {
      if (!authToken) throw new Error('No auth token found');
      const user = await userService.getCurrentUser();
      // Update the store once after fetching
      useAuthStore.getState().setUser(user);
      return user;
    },
    enabled: Boolean(authToken),
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Prevent refetching on every mount
    retry: 1,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};
