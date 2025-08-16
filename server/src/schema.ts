import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['customer', 'staff', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const orderStatusSchema = z.enum(['pending', 'accepted', 'washing', 'drying', 'ironing', 'ready', 'delivered', 'cancelled']);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const paymentStatusSchema = z.enum(['pending', 'paid', 'failed']);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentMethodSchema = z.enum(['cash', 'card', 'transfer', 'ewallet']);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(), // In real app, this should be hashed
  full_name: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Service schema
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price_per_kg: z.number(),
  estimated_duration_hours: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  service_id: z.number(),
  staff_id: z.number().nullable(),
  order_number: z.string(),
  weight_kg: z.number().nullable(),
  total_amount: z.number().nullable(),
  status: orderStatusSchema,
  pickup_address: z.string(),
  delivery_address: z.string(),
  pickup_date: z.coerce.date().nullable(),
  delivery_date: z.coerce.date().nullable(),
  estimated_completion: z.coerce.date().nullable(),
  special_instructions: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Order = z.infer<typeof orderSchema>;

// Order status history schema
export const orderStatusHistorySchema = z.object({
  id: z.number(),
  order_id: z.number(),
  old_status: orderStatusSchema.nullable(),
  new_status: orderStatusSchema,
  changed_by: z.number(),
  notes: z.string().nullable(),
  created_at: z.coerce.date()
});

export type OrderStatusHistory = z.infer<typeof orderStatusHistorySchema>;

// Payment schema
export const paymentSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  amount: z.number(),
  payment_method: paymentMethodSchema,
  payment_status: paymentStatusSchema,
  payment_date: z.coerce.date().nullable(),
  transaction_id: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Payment = z.infer<typeof paymentSchema>;

// Input schemas for creating users
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  role: userRoleSchema
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schemas for updating users
export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  full_name: z.string().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Input schemas for creating services
export const createServiceInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  price_per_kg: z.number().positive(),
  estimated_duration_hours: z.number().int().positive()
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

// Input schemas for updating services
export const updateServiceInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  price_per_kg: z.number().positive().optional(),
  estimated_duration_hours: z.number().int().positive().optional(),
  is_active: z.boolean().optional()
});

export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;

// Input schemas for creating orders
export const createOrderInputSchema = z.object({
  customer_id: z.number(),
  service_id: z.number(),
  pickup_address: z.string(),
  delivery_address: z.string(),
  pickup_date: z.coerce.date().optional(),
  special_instructions: z.string().nullable()
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

// Input schemas for updating orders
export const updateOrderInputSchema = z.object({
  id: z.number(),
  staff_id: z.number().optional(),
  weight_kg: z.number().positive().optional(),
  status: orderStatusSchema.optional(),
  pickup_date: z.coerce.date().nullable().optional(),
  delivery_date: z.coerce.date().nullable().optional(),
  estimated_completion: z.coerce.date().nullable().optional(),
  special_instructions: z.string().nullable().optional()
});

export type UpdateOrderInput = z.infer<typeof updateOrderInputSchema>;

// Input schemas for updating order status
export const updateOrderStatusInputSchema = z.object({
  order_id: z.number(),
  new_status: orderStatusSchema,
  changed_by: z.number(),
  notes: z.string().nullable()
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;

// Input schemas for creating payments
export const createPaymentInputSchema = z.object({
  order_id: z.number(),
  amount: z.number().positive(),
  payment_method: paymentMethodSchema,
  transaction_id: z.string().nullable(),
  notes: z.string().nullable()
});

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;

// Input schemas for updating payments
export const updatePaymentInputSchema = z.object({
  id: z.number(),
  payment_status: paymentStatusSchema,
  payment_date: z.coerce.date().nullable(),
  transaction_id: z.string().nullable(),
  notes: z.string().nullable()
});

export type UpdatePaymentInput = z.infer<typeof updatePaymentInputSchema>;

// Login schema
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Query schemas
export const getOrdersByCustomerInputSchema = z.object({
  customer_id: z.number()
});

export type GetOrdersByCustomerInput = z.infer<typeof getOrdersByCustomerInputSchema>;

export const getOrdersByStaffInputSchema = z.object({
  staff_id: z.number()
});

export type GetOrdersByStaffInput = z.infer<typeof getOrdersByStaffInputSchema>;

export const getOrderByIdInputSchema = z.object({
  id: z.number()
});

export type GetOrderByIdInput = z.infer<typeof getOrderByIdInputSchema>;

export const getUserByIdInputSchema = z.object({
  id: z.number()
});

export type GetUserByIdInput = z.infer<typeof getUserByIdInputSchema>;

export const getServiceByIdInputSchema = z.object({
  id: z.number()
});

export type GetServiceByIdInput = z.infer<typeof getServiceByIdInputSchema>;