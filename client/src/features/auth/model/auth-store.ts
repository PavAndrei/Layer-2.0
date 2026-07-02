import { create } from 'zustand';

import type { User } from '../../../entities/user';
import { setApiAccessToken } from '../../../shared/api';
import type { AuthResponseData, AuthStatus } from './auth-types';

type AuthSession = AuthResponseData;

export type AuthState = {
  accessToken: string | null;
  status: AuthStatus;
  user: User | null;
  clearSession: () => void;
  setSession: (session: AuthSession) => void;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  status: 'idle',
  user: null,
  clearSession: () => {
    setApiAccessToken(null);

    set({
      accessToken: null,
      status: 'guest',
      user: null,
    });
  },
  setSession: ({ accessToken, user }) => {
    setApiAccessToken(accessToken);

    set({
      accessToken,
      status: 'authenticated',
      user,
    });
  },
  setStatus: (status) => set({ status }),
}));
