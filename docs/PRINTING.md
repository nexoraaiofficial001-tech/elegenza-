# Cafe Eleganza - Kitchen & Bar Thermal Printer Setup

## 1. Architecture
- **In-Browser Printing:** Instant printing via system dialog to any receipt printer (e.g. Epson TM-T20, Xprinter XP-N160II, Rongta RP80).
- **Automated Background Print Agent:** Located in `/print-agent/index.ts`. Runs as a lightweight Node service on the restaurant's reception PC or a Raspberry Pi connected to local USB / LAN thermal printers.

## 2. Printer Stations & Category Routing
1. **Kitchen Printer (Station 1):**
   - East Corner (Thai Wok dishes)
   - Wood-Fired Pizza
   - Steaks, sandwiches, burgers, pasta, mozzarella sticks
2. **Bar & Barista Printer (Station 2):**
   - Artisan coffees, lattes, cappuccinos, espressos, affogatos
   - Handcrafted Limka coolers
   - Virgin mocktails, Frappuccinos, and Kashmiri Chai

## 3. Running the Print Agent
1. Open terminal on the PC connected to the printers:
```bash
npm run print:test
```
2. Verify test calibration ticket feeds and cuts cleanly.
3. Configure printer LAN IPs in `print-agent/index.ts`:
   - Kitchen: `192.168.1.200`
   - Bar: `192.168.1.201`
4. Register as Windows Service using NSSM:
```cmd
nssm install EleganzaPrintAgent "npx" "tsx print-agent/index.ts"
nssm start EleganzaPrintAgent
```
