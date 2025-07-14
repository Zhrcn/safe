import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const arPath = path.join(__dirname, 'public/locales/ar/common.json');
const enPath = path.join(__dirname, 'public/locales/en/common.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
if (!enData.doctor) enData.doctor = {};
if (!enData.doctor.dashboard) enData.doctor.dashboard = {};
if (!('followUp' in enData.doctor.dashboard)) {
  enData.doctor.dashboard.followUp = arData.doctor?.dashboard?.followUp || 'Follow-up';
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
  console.log('Added missing key: doctor.dashboard.followUp');
} else {
  console.log('Key already exists: doctor.dashboard.followUp');
} 