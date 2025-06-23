import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const processFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) return;

    if (filePath.includes('node_modules') || 
        filePath.includes('.git') || 
        filePath.includes('package-lock.json')) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const withoutComments = content
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') 
      .replace(/^\s*[\r\n]/gm, '');
    fs.writeFileSync(filePath, withoutComments);
    console.log(`Processed ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
};

const files = await glob('**/*.{js,jsx,ts,tsx}', { 
  ignore: [
    'node_modules/**',
    'remove-comments.js',
    '**/node_modules/**',
    '**/.git/**',
    '**/package-lock.json'
  ],
  nodir: true
});

files.forEach(file => {
  processFile(file);
});

console.log('Done!'); 