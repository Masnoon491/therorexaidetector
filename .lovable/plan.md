

## Change Sender Email Address

**Important caveat:** Resend requires you to **verify a domain you own** before sending from it. You cannot send from `salestheorex@gmail.com` because Gmail is Google's domain and cannot be verified in Resend.

You have two options:

### Option A: Use a custom domain you own (Recommended)
If you own a domain (e.g., `theorex.com`), verify it in your Resend dashboard, then set the "from" address to something like `alerts@theorex.com`.

### Option B: Keep using Resend's default domain
The current `onboarding@resend.dev` is Resend's sandbox sender. You can change the display name but not the domain without verification.

### What I'll do
Update `supabase/functions/notify-payment/index.ts` line where `from` is set — changing it to whatever verified sender you choose.

**I need to know:** Do you have a custom domain (like `theorex.com`) verified in Resend? If so, what email address should I use (e.g., `alerts@theorex.com`)? If not, the `onboarding@resend.dev` address must stay but I can update the display name to "Theorex Consulting".

