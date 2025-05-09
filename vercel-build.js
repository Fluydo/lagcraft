// This file is used by Vercel to build the project

// The build script is defined in package.json as:
// "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"

// This file ensures that the correct command is executed during Vercel deployment
console.log('Starting build process for Vercel deployment...');
console.log('Building client and server...');

// The build process will use the scripts defined in package.json