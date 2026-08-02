export const AUDIT_LOG_ENTITY_TYPES = [
  'blog-post',
  'order',
  'product',
  'review',
  'settings',
  'user',
] as const;

export type AuditLogEntityType = (typeof AUDIT_LOG_ENTITY_TYPES)[number];

export const AUDIT_LOG_ACTIONS = [
  'blog-post.created',
  'blog-post.deleted',
  'blog-post.status_changed',
  'blog-post.updated',
  'order.admin_note_changed',
  'order.status_changed',
  'order.tracking_number_changed',
  'product.created',
  'product.deleted',
  'product.status_changed',
  'product.updated',
  'review.approved',
  'review.deleted',
  'review.hidden',
  'review.moderation_reason_changed',
  'review.restored',
  'settings.general_updated',
  'settings.orders_updated',
  'settings.shipping_updated',
  'user.admin_note_changed',
  'user.blocked',
  'user.role_changed',
  'user.sessions_revoked',
  'user.unblocked',
] as const;

export type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[number];

export type AuditLogMetadata = Record<string, unknown>;
