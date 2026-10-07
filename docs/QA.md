# Cafe Eleganza - Manual QA & Test Suite Script

## 1. Automated Unit & Logic Checks
- Price math & GST calculation (16%).
- Free delivery threshold calculation (Orders >= Rs 3,000 get Rs 0 delivery fee).
- Point-in-polygon verification for Raza Town & Green Avenue delivery zones.
- Language toggle flips text direction (`dir="rtl"`) and swaps font to Noto Nastaliq Urdu.

## 2. Manual User Journey Verification Script
1. **Dine-In Table Order Flow:**
   - Navigate to `/t/4`.
   - Verify table banner displays "Welcome to Table 4".
   - Tap "Call Waiter" -> Verify chime sounds and notification appears in Admin Portal.
   - Add "Ube Latte" and "Signature Pepperoni Pizza" to cart.
   - Open Cart -> Verify Table Number is preset to Table 4.
   - Click "Confirm & Place Order" -> Verify confetti explodes and Order Number is generated (ELG-YYMMDD-XXXX).

2. **Delivery Order Flow:**
   - Add items totaling under Rs 3,000 -> Verify Rs 250 delivery fee is applied.
   - Add items over Rs 3,000 -> Verify "FREE DELIVERY UNLOCKED!" banner displays and fee drops to 0.
   - Select Delivery -> Verify Pakistani phone validation enforces 03XX-XXXXXXX format.
   - Verify OTP flow prompts with code 1234.

3. **Admin Order Management Flow:**
   - Go to `/admin` -> **Orders** tab.
   - Find placed order -> Click **Print Ticket** -> Verify 80mm format displays with items and totals.
   - Assign Rider Kashif -> Verify status advances to "Ready".
   - Go to `/rider` -> Verify order appears with customer phone, address pin, and COD amount.

4. **Table Reservations Flow:**
   - Go to **Reservations** -> Pick date, 19:00, 4 guests -> Submit -> Verify confirmation code and click ".ics" download.
