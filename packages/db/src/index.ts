import { PrismaClient } from '@prisma/client';

// Validate UUID helper to prevent parameter issues
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export * from '@prisma/client';

/**
 * Runs a transactional database operation with a local tenant context.
 * This sets the 'app.current_tenant_id' session variable which is evaluated
 * by PostgreSQL Row Level Security (RLS) policies.
 */
export async function runWithTenant<T>(
  tenantId: string,
  operation: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>
): Promise<T> {
  if (!UUID_REGEX.test(tenantId)) {
    throw new Error(`Invalid tenant ID format: ${tenantId}. Must be a valid UUID.`);
  }

  return prisma.$transaction(async (tx) => {
    // Parameterized config set to prevent SQL injection and bypass RLS policy checks correctly
    await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true);`;
    return operation(tx as any);
  });
}
