# Cafe Eleganza - Troubleshooting & Maintenance

## Common Operational Issues

### 1. New Orders Not Showing Audio Chime
- **Cause:** Web browser autoplay policy requires user interaction before playing audio.
- **Fix:** Click anywhere on the staff tablet screen once when beginning a shift, or click "Acknowledge Alerts" in the top bar.

### 2. Table QR Code Scans Open Wrong Table
- **Cause:** Table number in URL was mismatched during QR generation.
- **Fix:** In the Admin Panel -> **QR Tables**, verify the table number matches the physical acrylic stand and regenerate the sheet.

### 3. Customer Cannot Place Delivery Order (Out of Zone)
- **Cause:** Customer dropped pin outside predefined delivery zones.
- **Fix:** The customer can choose Takeaway Pickup instead, or the manager can extend delivery polygons in `deliveryZones` inside Admin Settings.

### 4. Thermal Printer Not Auto-Cutting Paper
- **Cause:** ESC/POS cut sequence not received or paper roll jammed.
- **Fix:** Ensure printer paper roll is loaded thermal side down and run `npm run print:test`.
