import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'staff', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'accepted', 'washing', 'drying', 'ironing', 'ready', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'card', 'transfer', 'ewallet']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // In real app, this should be hashed
  full_name: text('full_name').notNull(),
  phone: text('phone'),
  address: text('address'),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price_per_kg: numeric('price_per_kg', { precision: 10, scale: 2 }).notNull(),
  estimated_duration_hours: integer('estimated_duration_hours').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Orders table
export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull().references(() => usersTable.id),
  service_id: integer('service_id').notNull().references(() => servicesTable.id),
  staff_id: integer('staff_id').references(() => usersTable.id),
  order_number: text('order_number').notNull().unique(),
  weight_kg: numeric('weight_kg', { precision: 8, scale: 2 }),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }),
  status: orderStatusEnum('status').notNull().default('pending'),
  pickup_address: text('pickup_address').notNull(),
  delivery_address: text('delivery_address').notNull(),
  pickup_date: timestamp('pickup_date'),
  delivery_date: timestamp('delivery_date'),
  estimated_completion: timestamp('estimated_completion'),
  special_instructions: text('special_instructions'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Order status history table
export const orderStatusHistoryTable = pgTable('order_status_history', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => ordersTable.id),
  old_status: orderStatusEnum('old_status'),
  new_status: orderStatusEnum('new_status').notNull(),
  changed_by: integer('changed_by').notNull().references(() => usersTable.id),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Payments table
export const paymentsTable = pgTable('payments', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => ordersTable.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  payment_status: paymentStatusEnum('payment_status').notNull().default('pending'),
  payment_date: timestamp('payment_date'),
  transaction_id: text('transaction_id'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  customerOrders: many(ordersTable, { relationName: 'customer' }),
  staffOrders: many(ordersTable, { relationName: 'staff' }),
  statusChanges: many(orderStatusHistoryTable)
}));

export const servicesRelations = relations(servicesTable, ({ many }) => ({
  orders: many(ordersTable)
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  customer: one(usersTable, {
    fields: [ordersTable.customer_id],
    references: [usersTable.id],
    relationName: 'customer'
  }),
  staff: one(usersTable, {
    fields: [ordersTable.staff_id],
    references: [usersTable.id],
    relationName: 'staff'
  }),
  service: one(servicesTable, {
    fields: [ordersTable.service_id],
    references: [servicesTable.id]
  }),
  statusHistory: many(orderStatusHistoryTable),
  payments: many(paymentsTable)
}));

export const orderStatusHistoryRelations = relations(orderStatusHistoryTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderStatusHistoryTable.order_id],
    references: [ordersTable.id]
  }),
  changedBy: one(usersTable, {
    fields: [orderStatusHistoryTable.changed_by],
    references: [usersTable.id]
  })
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [paymentsTable.order_id],
    references: [ordersTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type NewService = typeof servicesTable.$inferInsert;
export type Order = typeof ordersTable.$inferSelect;
export type NewOrder = typeof ordersTable.$inferInsert;
export type OrderStatusHistory = typeof orderStatusHistoryTable.$inferSelect;
export type NewOrderStatusHistory = typeof orderStatusHistoryTable.$inferInsert;
export type Payment = typeof paymentsTable.$inferSelect;
export type NewPayment = typeof paymentsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  users: usersTable,
  services: servicesTable,
  orders: ordersTable,
  orderStatusHistory: orderStatusHistoryTable,
  payments: paymentsTable
};