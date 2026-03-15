-- Add billing and subscription related columns to public.users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS billing_key TEXT,
ADD COLUMN IF NOT EXISTS customer_key TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS next_billing_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_billing_at TIMESTAMPTZ;

-- Add index on customer_key for faster lookups during payment callbacks
CREATE INDEX IF NOT EXISTS idx_users_customer_key ON public.users(customer_key);

-- Add index on next_billing_at for the payment scheduler
CREATE INDEX IF NOT EXISTS idx_users_next_billing_at ON public.users(next_billing_at);

-- RLS update (optional, but good practice to ensure users can't see each other's billing keys if we ever expand the profile view)
-- The existing policy already restricts SELECT to auth.uid() = id, which is sufficient.
