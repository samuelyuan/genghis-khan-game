import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';

const isWindows = platform() === 'win32';

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
  
  // Copy public folder (cross-platform)
  if (existsSync('public')) {
    if (isWindows) {
      execSync('xcopy public dist\\public /E /I /Y', { stdio: 'inherit' });
    } else {
      execSync('cp -r public dist/', { stdio: 'inherit' });
    }
  }

  // Copy views folder (cross-platform)
  if (existsSync('views')) {
    if (isWindows) {
      execSync('xcopy views dist\\views /E /I /Y', { stdio: 'inherit' });
    } else {
      execSync('cp -r views dist/', { stdio: 'inherit' });
    }
  }

  // Copy server files
  ['package.json'].forEach(file => {
    if (existsSync(file)) {
      copyFileSync(file, `dist/${file}`);
    }
  });

  console.log('✅ Build completed successfully!');
  console.log('📦 Output directory: dist/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

