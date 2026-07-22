export const AUDIT_LOG_ENTITY_TYPES = [
  'order',
  'review',
  'settings',
  'user',
] as const;

export type AuditLogEntityType = (typeof AUDIT_LOG_ENTITY_TYPES)[number];

export const AUDIT_LOG_ACTIONS = [
  'order.admin_note_changed',
  'order.status_changed',
  'order.tracking_number_changed',
  'review.approved',
  'review.deleted',
  'review.hidden',
  'review.moderation_reason_changed',
  'review.restored',
  'settings.general_updated',
  'user.admin_note_changed',
  'user.blocked',
  'user.role_changed',
  'user.sessions_revoked',
  'user.unblocked',
] as const;

export type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[number];

export type AuditLogMetadata = Record<string, unknown>;
