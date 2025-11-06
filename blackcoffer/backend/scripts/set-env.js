const fs = require('fs');
const path = require('path');

const env = process.argv[2] || 'development';
const validEnvs = ['development', 'production'];

if (!validEnvs.includes(env)) {
  console.error('Please specify a valid environment: development or production');
  process.exit(1);
}

const envFile = `.env.${env}`;
const envPath = path.join(__dirname, envFile);

if (!fs.existsSync(envPath)) {
  console.error(`Environment file ${envFile} not found`);
  process.exit(1);
}

// Copy the environment file to .env
fs.copyFileSync(envPath, path.join(__dirname, '.env'));
console.log(`✅ Successfully set environment to ${env}`);