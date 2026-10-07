/**
 * Cafe Eleganza - Thermal Print Agent (Kitchen & Bar ESC/POS)
 * Runs on in-cafe PC (Windows / Ubuntu) or Raspberry Pi.
 * Routes items to Kitchen (Pizza/Steaks/Hot) or Bar (Coffee/Coolers).
 */

export interface PrintTicketPayload {
  orderNumber: string;
  type: string;
  tableNo?: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    notes?: string;
    category?: string;
  }[];
  total: number;
  timestamp: string;
}

export class ThermalPrintAgent {
  private kitchenPrinterIp: string;
  private barPrinterIp: string;

  constructor(kitchenIp = '192.168.1.200', barIp = '192.168.1.201') {
    this.kitchenPrinterIp = kitchenIp;
    this.barPrinterIp = barIp;
  }

  // Format 80mm ESC/POS Raw Thermal Buffer
  public formatTicket(ticket: PrintTicketPayload, station: 'KITCHEN' | 'BAR'): string {
    const lines = [
      '================================',
      `       CAFE ELEGANZA SOLARIUM   `,
      `          STATION: ${station}   `,
      '================================',
      `ORDER: #${ticket.orderNumber}`,
      `TYPE:  ${ticket.type.toUpperCase()}${ticket.tableNo ? ` [TABLE ${ticket.tableNo}]` : ''}`,
      `TIME:  ${new Date(ticket.timestamp).toLocaleTimeString()}`,
      `NAME:  ${ticket.customerName}`,
      '--------------------------------',
      'QTY  ITEM',
      '--------------------------------',
    ];

    ticket.items.forEach((item) => {
      lines.push(`${String(item.quantity).padEnd(4)} ${item.name}`);
      if (item.notes) {
        lines.push(`     * NOTE: ${item.notes}`);
      }
    });

    lines.push('--------------------------------');
    lines.push(`TOTAL: PKR ${ticket.total.toLocaleString()}`);
    lines.push('================================\n\n\n');

    return lines.join('\n');
  }

  public async printTestPage(): Promise<void> {
    console.log('🖨️ Printing Test Calibration Ticket...');
    const testTicket: PrintTicketPayload = {
      orderNumber: 'TEST-0001',
      type: 'dine_in',
      tableNo: '4',
      customerName: 'Test Patron',
      items: [
        { name: 'Ube Latte (Iced)', quantity: 2, notes: 'Extra foam cloud' },
        { name: 'Signature Pepperoni Pizza', quantity: 1, notes: 'Well done crust' },
      ],
      total: 3490,
      timestamp: new Date().toISOString(),
    };

    console.log('--- Kitchen Station Output ---');
    console.log(this.formatTicket(testTicket, 'KITCHEN'));
    console.log('--- Bar Station Output ---');
    console.log(this.formatTicket(testTicket, 'BAR'));
  }
}

// Auto-run test if invoked directly
if (process.argv.includes('--test')) {
  const agent = new ThermalPrintAgent();
  agent.printTestPage();
}
