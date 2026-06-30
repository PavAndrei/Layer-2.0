import type { AuthState } from './auth-store';

export const selectAuthAccessToken = (state: AuthState) => state.accessToken;

export const selectAuthStatus = (state: AuthState) => state.status;

export const selectAuthUser = (state: AuthState) => state.user;

export const selectIsAuthenticated = (state: AuthState) =>
  state.status === 'authenticated';
