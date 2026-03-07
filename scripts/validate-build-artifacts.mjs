import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const distDir = path.resolve(repoRoot, 'dist');

async function fileExistsAndNonEmpty(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile() && stats.size > 0;
  } catch {
    return false;
  }
}

async function main() {
  try {
    await fs.access(distDir);
  } catch {
    throw new Error(`dist directory not found at ${distDir}. Run the build first.`);
  }

  const requiredFiles = ['index.html', 'terms.html', 'privacy.html', 'sitemap.xml', 'robots.txt'];
  const errors = [];

  for (const file of requiredFiles) {
    const fullPath = path.join(distDir, file);
    const ok = await fileExistsAndNonEmpty(fullPath);
    if (!ok) {
      errors.push(`[build-artifacts] missing or empty required file: ${fullPath}`);
    }
  }

  if (errors.length > 0) {
    console.error('\n[build-artifacts] Failed with the following issues:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('[build-artifacts] OK (required dist artifacts verified)');
}

main().catch((error) => {
  console.error(`[build-artifacts] ${error.message}`);
  process.exit(1);
});
