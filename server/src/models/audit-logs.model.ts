import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENTITY_TYPES,
  type AuditLogAction,
  type AuditLogEntityType,
  type AuditLogMetadata,
} from '../types/audit-log';

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: AUDIT_LOG_ACTIONS,
      required: true,
      index: true,
    },

    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    entityId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: AUDIT_LOG_ENTITY_TYPES,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });

export type AuditLogData = Omit<
  InferSchemaType<typeof auditLogSchema>,
  'action' | 'entityType' | 'metadata'
> & {
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  metadata: AuditLogMetadata;
};
export type AuditLogDocument = HydratedDocument<AuditLogData>;

export const AuditLog = model<AuditLogData>(
  'AuditLog',
  auditLogSchema,
);
