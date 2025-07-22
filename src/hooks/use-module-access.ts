import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/use-client-auth';
import API from '@/lib/axios';
import { ModuleType, ModuleAccessResponse } from '@/types/module-permission';
import { Role } from '@/types/user';

/**
 * Hook to check if the current user has access to a specific module
 * Access is granted if:
 * 1. User is super_admin
 * 2. User has an active module permission (granted from admin)
 * 3. User has an active subscription for that module
 */
export function useModuleAccess(moduleType: ModuleType) {
  const { user } = useClientAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    void checkModuleAccess();
  }, [user, moduleType]);

  const checkModuleAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Super admin always has access
      if (user?.role === Role.SuperAdmin) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Check module permissions via API
      const response = await API.get<ModuleAccessResponse>(
        `/admin/module-permissions/check/${user?._id}/${moduleType}`
      );

      setHasAccess(response.data.hasAccess);
    } catch (err: any) {
      console.error('Error checking module access:', err);
      setError(err.response?.data?.message || 'Error checking access');
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { hasAccess, loading, error, refetch: checkModuleAccess };
}

/**
 * Hook to check multiple modules at once
 */
export function useMultipleModuleAccess(moduleTypes: ModuleType[]) {
  const { user } = useClientAuth();
  const [accessMap, setAccessMap] = useState<Record<ModuleType, boolean>>({} as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAccessMap({} as Record<ModuleType, boolean>);
      setLoading(false);
      return;
    }

    void checkMultipleAccess();
  }, [user, moduleTypes.join(',')]);

  const checkMultipleAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Super admin always has access
      if (user?.role === Role.SuperAdmin) {
        const fullAccess = moduleTypes.reduce((acc, type) => ({
          ...acc,
          [type]: true
        }), {} as Record<ModuleType, boolean>);
        setAccessMap(fullAccess);
        setLoading(false);
        return;
      }

      // Check each module
      const accessResults = await Promise.all(
        moduleTypes.map(async (moduleType) => {
          try {
            const response = await API.get<ModuleAccessResponse>(
              `/admin/module-permissions/check/${user?._id}/${moduleType}`
            );
            return { moduleType, hasAccess: response.data.hasAccess };
          } catch (err) {
            return { moduleType, hasAccess: false };
          }
        })
      );

      const newAccessMap = accessResults.reduce((acc, result) => ({
        ...acc,
        [result.moduleType]: result.hasAccess
      }), {} as Record<ModuleType, boolean>);

      setAccessMap(newAccessMap);
    } catch (err: any) {
      console.error('Error checking multiple module access:', err);
      setError(err.message || 'Error checking access');
      setAccessMap({} as Record<ModuleType, boolean>);
    } finally {
      setLoading(false);
    }
  };

  return { accessMap, loading, error, refetch: checkMultipleAccess };
}