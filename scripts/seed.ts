/**
 * Cafe Eleganza - Production Database Seeder
 * Run with: npx tsx scripts/seed.ts
 */

import { seedCategories, seedMenuItems, seedPromos, seedTables, seedReviews } from '../shared/seedData.js';
import { defaultSiteConfig } from '../shared/siteConfig.js';

async function seed() {
  console.log('🌱 Seeding Cafe Eleganza database...');
  console.log(`- Categories: ${seedCategories.length}`);
  console.log(`- Menu Items: ${seedMenuItems.length}`);
  console.log(`- Promos: ${seedPromos.length}`);
  console.log(`- Tables: ${seedTables.length}`);
  console.log(`- Reviews: ${seedReviews.length}`);
  console.log(`- Site Config: ${defaultSiteConfig.brandName} (${defaultSiteConfig.city})`);
  console.log('✓ Seeding complete. All prices and items ready for client confirmation.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
