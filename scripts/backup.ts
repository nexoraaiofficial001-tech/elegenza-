/**
 * Cafe Eleganza - JSON Collection Backup Tool
 * Usage: npx tsx scripts/backup.ts
 */

import fs from 'fs';
import path from 'path';
import { seedMenuItems, seedCategories, seedPromos, seedTables, seedReviews } from '../shared/seedData.js';
import { defaultSiteConfig } from '../shared/siteConfig.js';

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `eleganza-backup-${timestamp}.json`;
  const backupData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    config: defaultSiteConfig,
    menu: seedMenuItems,
    categories: seedCategories,
    promos: seedPromos,
    tables: seedTables,
    reviews: seedReviews,
  };

  const outPath = path.resolve(process.cwd(), filename);
  fs.writeFileSync(outPath, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`✓ Backup successfully written to ${outPath}`);
}

runBackup().catch(console.error);
