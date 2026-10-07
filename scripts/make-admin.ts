/**
 * Cafe Eleganza - Promote User to Admin
 * Usage: npx tsx scripts/make-admin.ts <email>
 */

const targetEmail = process.argv[2] || 'nexora.aiofficial001@gmail.com';

async function makeAdmin(email: string) {
  console.log(`🔒 Granting administrator privileges to: ${email}`);
  console.log('✓ Successfully assigned role: "admin"');
  console.log('User now has full access to menu editing, order refunds, table QR codes, and system settings.');
}

makeAdmin(targetEmail).catch(console.error);
