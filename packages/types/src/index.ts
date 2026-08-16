// Common enum-like string types for Turnia

export type UserRole = 'SUPER_ADMIN' | 'TENANT_OWNER' | 'TENANT_ADMIN' | 'STAFF' | 'CUSTOMER';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NOSHOW';

export type BookingSource = 'WHATSAPP' | 'WEB' | 'MANUAL';

export type MarketType = 'ES' | 'AR';

export type CurrencyType = 'EUR' | 'ARS';

export type TenantStatus = 'ACTIVE' | 'SUSPENDED';

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE';

export interface DecodedToken {
  userId: string;
  tenantId: string | null;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface UserContext {
  userId: string;
  tenantId: string | null;
  role: UserRole;
}
