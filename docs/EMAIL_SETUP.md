# Cafe Eleganza - Email, SMS & WhatsApp Delivery Configuration

## 1. Domain Verification (SPF, DKIM, DMARC)
For emails originating from `orders@cafeeleganza.pk`:

1. **SPF (TXT Record):**
   - Host: `@`
   - Value: `v=spf1 include:resend.com ~all`

2. **DKIM (TXT / CNAME Record):**
   - Provided by Resend / SendGrid dashboard (e.g. `resend._domainkey.cafeeleganza.pk`).

3. **DMARC (TXT Record):**
   - Host: `_dmarc`
   - Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@cafeeleganza.pk`

## 2. Pakistani SMS Gateways
The backend features an SMS provider interface supporting:
- **Twilio** (Global)
- **Veevo Tech** (Local Pakistani Corporate SMS)
- **Eocean / Jazz Corporate Gateway**

Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` in `.env`.

## 3. WhatsApp Direct Dispatch
When an order is submitted, the admin tablet can instantly trigger formatted WhatsApp messages directly via `wa.me` links prefilled with customer items and address.
