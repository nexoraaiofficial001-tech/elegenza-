# Cafe Eleganza - Online Payment Gateway Integration Guide

## 1. Supported Active Methods
- **Cash on Delivery (COD):** Active and operational for all express delivery orders.
- **Pay at Counter:** Active for Dine-in (QR table orders) and Takeaway pickups.

## 2. Integrating Pakistani Digital Wallets (JazzCash & Easypaisa)

### JazzCash Merchant API:
1. Register a Corporate Merchant Account at [sandbox.jazzcash.com.pk](https://sandbox.jazzcash.com.pk).
2. Obtain Merchant ID, Password, and Hash Key.
3. Configure in `.env`:
   ```bash
   JAZZ_CASH_MERCHANT_ID="MC12345"
   JAZZ_CASH_PASSWORD="password123"
   JAZZ_CASH_INTEGRITY_SALT="salt_abc123"
   ```
4. The client checkout interface already includes pre-styled disabled hooks that activate as soon as keys are entered.

### Easypaisa Direct API:
1. Register with Telenor / Easypaisa Corporate Merchant team.
2. Obtain Store ID and Hash Secret.
3. Hook into `/api/v1/payments/easypaisa` webhook handler.

### Credit/Debit Cards:
Use **PayMob Pakistan** or **Safepay** for Visa/Mastercard processing with 3D Secure OTP verification.
