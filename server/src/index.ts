import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Schema imports
import {
  createUserInputSchema,
  updateUserInputSchema,
  loginInputSchema,
  getUserByIdInputSchema,
  createServiceInputSchema,
  updateServiceInputSchema,
  getServiceByIdInputSchema,
  createOrderInputSchema,
  updateOrderInputSchema,
  updateOrderStatusInputSchema,
  getOrderByIdInputSchema,
  getOrdersByCustomerInputSchema,
  getOrdersByStaffInputSchema,
  createPaymentInputSchema,
  updatePaymentInputSchema,
  userRoleSchema,
  orderStatusSchema
} from './schema';

// Handler imports
import { loginUser, getCurrentUser } from './handlers/auth';
import { createUser } from './handlers/create_user';
import { getUsers, getUsersByRole } from './handlers/get_users';
import { getUserById } from './handlers/get_user_by_id';
import { updateUser } from './handlers/update_user';
import { createService } from './handlers/create_service';
import { getServices, getActiveServices } from './handlers/get_services';
import { getServiceById } from './handlers/get_service_by_id';
import { updateService } from './handlers/update_service';
import { createOrder } from './handlers/create_order';
import { getOrders, getOrdersWithStatus } from './handlers/get_orders';
import { getOrderById } from './handlers/get_order_by_id';
import { getOrdersByCustomer } from './handlers/get_orders_by_customer';
import { getOrdersByStaff } from './handlers/get_orders_by_staff';
import { updateOrder } from './handlers/update_order';
import { updateOrderStatus } from './handlers/update_order_status';
import { getOrderStatusHistory } from './handlers/get_order_status_history';
import { createPayment } from './handlers/create_payment';
import { updatePayment } from './handlers/update_payment';
import { getPaymentsByOrder } from './handlers/get_payments_by_order';
import { getDailyReport, getMonthlyReport, getOrderReport, getRevenueReport } from './handlers/get_reports';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),
  
  getCurrentUser: publicProcedure
    .input(getUserByIdInputSchema)
    .query(({ input }) => getCurrentUser(input.id)),

  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),
  
  getUsersByRole: publicProcedure
    .input(z.object({ role: z.string() }))
    .query(({ input }) => getUsersByRole(input.role)),
  
  getUserById: publicProcedure
    .input(getUserByIdInputSchema)
    .query(({ input }) => getUserById(input)),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  // Service management routes
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  
  getServices: publicProcedure
    .query(() => getServices()),
  
  getActiveServices: publicProcedure
    .query(() => getActiveServices()),
  
  getServiceById: publicProcedure
    .input(getServiceByIdInputSchema)
    .query(({ input }) => getServiceById(input)),
  
  updateService: publicProcedure
    .input(updateServiceInputSchema)
    .mutation(({ input }) => updateService(input)),

  // Order management routes
  createOrder: publicProcedure
    .input(createOrderInputSchema)
    .mutation(({ input }) => createOrder(input)),
  
  getOrders: publicProcedure
    .query(() => getOrders()),
  
  getOrdersWithStatus: publicProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(({ input }) => getOrdersWithStatus(input.status)),
  
  getOrderById: publicProcedure
    .input(getOrderByIdInputSchema)
    .query(({ input }) => getOrderById(input)),
  
  getOrdersByCustomer: publicProcedure
    .input(getOrdersByCustomerInputSchema)
    .query(({ input }) => getOrdersByCustomer(input)),
  
  getOrdersByStaff: publicProcedure
    .input(getOrdersByStaffInputSchema)
    .query(({ input }) => getOrdersByStaff(input)),
  
  updateOrder: publicProcedure
    .input(updateOrderInputSchema)
    .mutation(({ input }) => updateOrder(input)),
  
  updateOrderStatus: publicProcedure
    .input(updateOrderStatusInputSchema)
    .mutation(({ input }) => updateOrderStatus(input)),
  
  getOrderStatusHistory: publicProcedure
    .input(getOrderByIdInputSchema)
    .query(({ input }) => getOrderStatusHistory(input.id)),

  // Payment management routes
  createPayment: publicProcedure
    .input(createPaymentInputSchema)
    .mutation(({ input }) => createPayment(input)),
  
  updatePayment: publicProcedure
    .input(updatePaymentInputSchema)
    .mutation(({ input }) => updatePayment(input)),
  
  getPaymentsByOrder: publicProcedure
    .input(getOrderByIdInputSchema)
    .query(({ input }) => getPaymentsByOrder(input.id)),

  // Reporting routes
  getDailyReport: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(({ input }) => getDailyReport(input.date)),
  
  getMonthlyReport: publicProcedure
    .input(z.object({ month: z.string() }))
    .query(({ input }) => getMonthlyReport(input.month)),
  
  getOrderReport: publicProcedure
    .input(z.object({ 
      startDate: z.string(),
      endDate: z.string()
    }))
    .query(({ input }) => getOrderReport(input.startDate, input.endDate)),
  
  getRevenueReport: publicProcedure
    .input(z.object({ 
      startDate: z.string(),
      endDate: z.string()
    }))
    .query(({ input }) => getRevenueReport(input.startDate, input.endDate)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC Laundry Management Server listening at port: ${port}`);
}

start();