import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const arPath = path.join(__dirname, 'public/locales/ar/common.json');
const enPath = path.join(__dirname, 'public/locales/en/common.json');

const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function findDuplicates(obj, prefix = '') {
  const duplicates = [];
  const seen = new Set();
  
  function traverse(obj, currentPrefix = '') {
    for (const key in obj) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      
      if (seen.has(fullKey)) {
        duplicates.push(fullKey);
      } else {
        seen.add(fullKey);
      }
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        traverse(obj[key], fullKey);
      }
    }
  }
  
  traverse(obj);
  return duplicates;
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  function traverse(obj, currentPrefix = '') {
    for (const key in obj) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      keys.push(fullKey);
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        traverse(obj[key], fullKey);
      }
    }
  }
  
  traverse(obj);
  return keys;
}

const arDuplicates = findDuplicates(arData);
const enDuplicates = findDuplicates(enData);

const arKeys = getAllKeys(arData);
const enKeys = getAllKeys(enData);

const arKeysSet = new Set(arKeys);
const enKeysSet = new Set(enKeys);

const missingInAr = enKeys.filter(key => !arKeysSet.has(key));
const missingInEn = arKeys.filter(key => !enKeysSet.has(key));

console.log('=== ANALYSIS RESULTS ===\n');

console.log('DUPLICATES IN ARABIC FILE:');
if (arDuplicates.length === 0) {
  console.log('No duplicates found');
} else {
  arDuplicates.forEach(dup => console.log(`- ${dup}`));
}

console.log('\nDUPLICATES IN ENGLISH FILE:');
if (enDuplicates.length === 0) {
  console.log('No duplicates found');
} else {
  enDuplicates.forEach(dup => console.log(`- ${dup}`));
}

console.log('\nMISSING IN ARABIC FILE:');
if (missingInAr.length === 0) {
  console.log('No missing keys');
} else {
  missingInAr.forEach(key => console.log(`- ${key}`));
}

console.log('\nMISSING IN ENGLISH FILE:');
if (missingInEn.length === 0) {
  console.log('No missing keys');
} else {
  missingInEn.forEach(key => console.log(`- ${key}`));
}

console.log('\n=== SUMMARY ===');
console.log(`Arabic file has ${arDuplicates.length} duplicate keys`);
console.log(`English file has ${enDuplicates.length} duplicate keys`);
console.log(`Arabic file is missing ${missingInAr.length} keys`);
console.log(`English file is missing ${missingInEn.length} keys`); 