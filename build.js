import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting TypeScript build...');

try {
  // Create dist directory if it doesn't exist
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }

  // Compile TypeScript
  console.log('📝 Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Copy static assets
  console.log('📁 Copying static assets...');
  
  // Copy public folder
  if (existsSync('public')) {
    execSync('xcopy public dist\\public /E /I /Y', { stdio: 'inherit' });
  }

  // Copy views folder
  if (existsSync('views')) {
    execSync('xcopy views dist\\views /E /I /Y', { stdio: 'inherit' });
  }

  // Copy server.js
  if (existsSync('server.js')) {
    copyFileSync('server.js', 'dist/server.js');
  }

  // Copy package.json
  if (existsSync('package.json')) {
    copyFileSync('package.json', 'dist/package.json');
  }

  console.log('✅ Build completed successfully!');
  console.log('📦 Output directory: dist/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

