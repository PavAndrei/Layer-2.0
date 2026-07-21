import type { AdminUserListItem as AdminUserListItemData } from '../../../entities/user';
import { AdminUserListItem } from './admin-user-list-item';

type AdminUsersListProps = {
  users: AdminUserListItemData[];
};

export const AdminUsersList = ({ users }: AdminUsersListProps) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {users.map((user) => (
      <AdminUserListItem key={user._id} user={user} />
    ))}
  </div>
);
