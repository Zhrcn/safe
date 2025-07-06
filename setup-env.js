import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables for frontend
const envContent = `# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
NEXT_PUBLIC_TOKEN_NAME=safe_auth_token

# Development settings
NODE_ENV=development
`;

// Write to .env.local
const envPath = path.join(__dirname, '.env.local');
fs.writeFileSync(envPath, envContent);

console.log('✅ Environment file created: .env.local');
console.log('📝 Please restart your development server for changes to take effect.');
console.log('');
console.log('🔧 To start the development servers:');
console.log('   npm run dev');
console.log('');
console.log('🌐 Frontend will be available at: http://localhost:3000');
console.log('🔌 Backend API will be available at: http://localhost:5001'); 