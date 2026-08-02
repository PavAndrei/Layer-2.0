import type { UserDocument } from '../models/users.model';
import type { UserDto } from '../types/api';
import type { UserAuthProvider } from '../types/user';

const getUserAuthProviders = (user: UserDocument): UserAuthProvider[] => {
  if (user.authProviders?.length) {
    return user.authProviders;
  }

  return ['password'];
};

export const userToDto = (user: UserDocument): UserDto => ({
  _id: user._id.toString(),
  authProviders: getUserAuthProviders(user),
  avatarFileId: user.avatarFileId ?? undefined,
  avatarFilePath: user.avatarFilePath ?? undefined,
  avatarUrl: user.avatarUrl ?? undefined,
  email: user.email,
  name: user.name,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isBlocked: user.isBlocked,
});
