import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeBilling } from '../lib/billing';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    update: vi.fn().mockReturnThis(),
  })),
}));

// Mock Fetch
global.fetch = vi.fn();

describe('Billing Library', () => {
  const mockUserId = 'user-123';
  const mockUser = {
    id: mockUserId,
    billing_key: 'bill_key_abc',
    subscription_tier: 'professional',
    customer_key: 'cust_key_xyz',
  };

  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(), // Added for batch query
    };
    (createClient as any).mockReturnValue(mockSupabase);
  });

  it('successfully executes billing for a pro user', async () => {
    mockSupabase.single.mockResolvedValue({ data: mockUser, error: null });
    
    // For specific chains, we can use different behaviors
    mockSupabase.update.mockImplementation(() => {
        mockSupabase.eq.mockResolvedValue({ error: null }); // next eq() call will return result
        return mockSupabase;
    });

    mockSupabase.select.mockImplementation(() => {
        mockSupabase.eq.mockReturnThis(); // next eq() call will return this for .single()
        return mockSupabase;
    });

    // Setup Fetch mock
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        paymentKey: 'pay_123',
        orderId: 'ord_123',
        totalAmount: 15000,
      }),
    });

    const result = await executeBilling(mockUserId);

    expect(result.success).toBe(true);
    expect(result.amount).toBe(15000);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('bill_key_abc'),
      expect.any(Object)
    );
  });

  it('returns error if user has no billing key', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

    const result = await executeBilling(mockUserId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('No billing key found');
  });

  it('fails if Toss API returns error', async () => {
    mockSupabase.single.mockResolvedValue({ data: mockUser, error: null });

    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid card' }),
    });

    const result = await executeBilling(mockUserId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid card');
  });
});

describe('Batch Billing', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn().mockReturnThis(),
    };
    (createClient as any).mockReturnValue(mockSupabase);
  });

  it('processes multiple users', async () => {
    const { processBatchBilling } = await import('../lib/billing');
    
    // Batch fetch mock
    const mockUsers = [{ id: 'u1' }, { id: 'u2' }];
    (mockSupabase.from('').lte as any).mockResolvedValue({ data: mockUsers, error: null });

    // Individual fetch mocks for each user
    mockSupabase.single.mockImplementation(() => {
        return Promise.resolve({
            data: {
                id: 'dummy',
                billing_key: 'key',
                subscription_tier: 'professional',
                customer_key: 'cust'
            },
            error: null
        });
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ totalAmount: 15000 }),
    });

    const result = await processBatchBilling();

    expect(result.success).toBe(true);
    expect(result.processed).toBe(2);
    expect(result.succeeded).toBe(2);
  });
});
