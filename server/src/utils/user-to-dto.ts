import type { UserDocument } from '../models/users.model';
import type { UserDto } from '../types/api';

export const userToDto = (user: UserDocument): UserDto => ({
  _id: user._id.toString(),
  email: user.email,
  name: user.name,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
});
