import { z } from 'zod';

// 1. Dashboard Overview Schema
export const DashboardOverviewSchema = z.object({
  active_customers: z.number().default(0),
  sales_total: z.number().default(0),
  collections_total: z.number().default(0),
  outstanding_exposure: z.number().default(0),
  overdue_exposure: z.number().optional().default(0),
  health_index: z.number().default(0),
  last_data_date: z.string().optional(),
  comparison_deltas: z.object({
    active_customers: z.number().optional().default(0),
    sales_total: z.number().optional().default(0),
    collections_total: z.number().optional().default(0),
    outstanding_exposure: z.number().optional().default(0),
    health_index: z.number().optional().default(0),
  }).catchall(z.number()).default({
    active_customers: 0,
    sales_total: 0,
    collections_total: 0,
    outstanding_exposure: 0,
    health_index: 0
  }),
});

// 2. Activity Summary Schema (raw stats from /dashboard/activity-summary)
export const ActivitySummarySchema = z.object({
  newly_active_customers: z.number().default(0),
  newly_inactive_customers: z.number().default(0),
  customers_improved: z.number().default(0),
  customers_deteriorated: z.number().default(0),
  customers_with_new_overdue: z.number().default(0),
  customers_near_credit_limit: z.number().default(0),
});

// 3. Alert Schema (Normalized alert item format)
export const AlertSchema = z.object({
  id: z.string(),
  alert_type: z.string().default('ANOMALY'),
  customer_id: z.string(),
  customer_name: z.string().nullable().default('Unknown Customer'),
  message: z.string().default(''),
  timestamp: z.string().default(() => new Date().toISOString()),
});

// 4. Customer Schema (Corporate Accounts)
export const CustomerSchema = z.object({
  customer_id: z.string(),
  customer_name: z.string().nullable().default('Unknown Customer'),
  city: z.string().nullable().default(''),
  trust_score: z.number().optional().default(0.5),
  health_score: z.number().optional().default(0.5),
  risk_score: z.number().optional().default(0.5),
  outstanding_current: z.number().optional().default(0),
  trust_delta: z.number().optional().default(0),
  payment_delta: z.number().optional().default(0),
  repayment_health_delta: z.number().optional().default(0),
  outstanding_delta: z.number().optional().default(0),
  state: z.string().default('HEALTHY'),
  grade: z.string().optional().default('B'),
  last_purchased_at: z.string().nullable().optional(),
});

// 5. Segment Schema
export const SegmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  accountsCount: z.number().default(0),
  exposure: z.number().default(0),
  risk: z.string().default('0%'),
  trend: z.string().default('stable'),
  recentChanges: z.string().default(''),
  recommendation: z.string().default(''),
});

// 6. User Schema (Analysts)
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string().nullable().default(''),
  role: z.string().default('ANALYST'),
  is_active: z.boolean().default(true),
});

// Helper validation runner
export function validatePayload<T>(
  schema: z.ZodSchema<T>,
  data: any,
  schemaName: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Import telemetry dynamically to avoid circular dependencies
    import('@/lib/telemetry').then(({ telemetry }) => {
      telemetry.log(
        'validation',
        'warn',
        `Validation failed for schema ${schemaName}`,
        {
          issues: result.error.issues,
          receivedData: data,
        }
      );
    });
    // Fallback: parse with default fallback values (stripping invalid fields or returning defaults)
    return schema.parse({});
  }
  return result.data;
}
