import {
  selectAuthStatus,
  selectAuthUser,
  selectIsAuthenticated,
} from './auth-selectors';
import { useAuthStore } from './auth-store';

export const useAuthStatus = () => useAuthStore(selectAuthStatus);

export const useAuthUser = () => useAuthStore(selectAuthUser);

export const useIsAuthenticated = () =>
  useAuthStore(selectIsAuthenticated);
