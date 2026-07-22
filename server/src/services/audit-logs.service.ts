import { Types } from 'mongoose';

import { AuditLog } from '../models/audit-logs.model';
import type {
  AuditLogAction,
  AuditLogEntityType,
  AuditLogMetadata,
} from '../types/audit-log';

type CreateAuditLogParams = {
  action: AuditLogAction;
  actorId: string | Types.ObjectId;
  entityId: string | Types.ObjectId;
  entityType: AuditLogEntityType;
  metadata?: AuditLogMetadata;
};

export const createAuditLog = async ({
  action,
  actorId,
  entityId,
  entityType,
  metadata = {},
}: CreateAuditLogParams) => {
  await AuditLog.create({
    action,
    actorId:
      actorId instanceof Types.ObjectId
        ? actorId
        : new Types.ObjectId(actorId),
    entityId: entityId.toString(),
    entityType,
    metadata,
  });
};
