

## Email Notification: New Payment Request Alert

### Prerequisite: Email Provider API Key

To send transactional emails from backend functions, we need **Resend** (a transactional email service). No Resend API key is currently configured.

**Setup steps for you:**
1. Create a free account at [resend.com](https://resend.com)
2. Get your API key from the Resend dashboard
3. I'll securely store it as a backend secret

The free tier supports 100 emails/day which is sufficient for payment notifications.

### Implementation

**1. New Edge Function: `notify-payment`**
- Triggered by `PaymentSubmitDialog.tsx` after successful transaction insert
- Sends an HTML email to `salestheorex@gmail.com` via Resend API
- Subject: `🚨 New Credit Request: [User Email]`
- Body: Branded HTML with Plan Name, bKash TrxID, Amount (BDT), and GMT+6 timestamp
- Config: `verify_jwt = false` in `config.toml`, with manual auth check

**2. Update `PaymentSubmitDialog.tsx`**
- After successful DB insert, call `supabase.functions.invoke('notify-payment', { body: { userEmail, planName, trxId, amountBdt } })`
- Fire-and-forget (don't block the success toast on email delivery)

**3. Files Changed**

| File | Change |
|------|--------|
| `supabase/functions/notify-payment/index.ts` | New edge function — sends email via Resend |
| `supabase/config.toml` | Add `[functions.notify-payment]` with `verify_jwt = false` |
| `src/components/PaymentSubmitDialog.tsx` | Call edge function after successful insert |

### Next Step

Before I can implement this, I need you to provide a **Resend API key**. Would you like to proceed? I'll request the key securely once you confirm.

