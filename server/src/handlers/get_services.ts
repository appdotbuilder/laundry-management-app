import { type Service } from '../schema';

export async function getServices(): Promise<Service[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all active laundry services from the database.
    // Should only return active services for customers, but all services for admin/staff.
    return Promise.resolve([]);
}

export async function getActiveServices(): Promise<Service[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching only active laundry services.
    // Used by customers to see available services for ordering.
    return Promise.resolve([]);
}