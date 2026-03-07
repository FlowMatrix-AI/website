import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const distDir = path.resolve(repoRoot, 'dist');

async function readFileOrNull(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

function buildChecks({ requireJsonLd }) {
  const checks = [
    { name: '<title>', pattern: /<title>[\s\S]*?<\/title>/i },
    { name: 'canonical link', pattern: /<link[^>]+rel=["']canonical["'][^>]*>/i },
    {
      name: 'meta description',
      pattern: /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i,
    },
    { name: 'meta robots', pattern: /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']+/i },
    { name: 'og:title', pattern: /<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+/i },
    {
      name: 'og:description',
      pattern: /<meta[^>]+property=["']og:description["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'og:url',
      pattern: /<meta[^>]+property=["']og:url["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'og:image',
      pattern: /<meta[^>]+property=["']og:image["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'og:type',
      pattern: /<meta[^>]+property=["']og:type["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'og:site_name',
      pattern: /<meta[^>]+property=["']og:site_name["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'twitter:card',
      pattern: /<meta[^>]+name=["']twitter:card["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'twitter:title',
      pattern: /<meta[^>]+name=["']twitter:title["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'twitter:description',
      pattern: /<meta[^>]+name=["']twitter:description["'][^>]+content=["'][^"']+/i,
    },
    {
      name: 'twitter:image',
      pattern: /<meta[^>]+name=["']twitter:image["'][^>]+content=["'][^"']+/i,
    },
  ];

  if (requireJsonLd) {
    checks.push({
      name: 'JSON-LD script',
      pattern: /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i,
    });
  }

  return checks;
}

async function main() {
  try {
    await fs.access(distDir);
  } catch {
    throw new Error(`dist directory not found at ${distDir}. Run the build first.`);
  }

  const pages = [
    { label: 'home', file: 'index.html', requireJsonLd: true },
    { label: 'terms', file: 'terms.html', requireJsonLd: true },
  ];

  const errors = [];

  for (const page of pages) {
    if (!page.file) {
      errors.push(
        `[head-validate] missing sample file for ${page.label} (expected at least one dist/free/*.html)`
      );
      continue;
    }

    const fullPath = path.join(distDir, page.file);
    const html = await readFileOrNull(fullPath);
    if (!html) {
      errors.push(`[head-validate] missing file for ${page.label}: ${fullPath}`);
      continue;
    }

    const checks = buildChecks({ requireJsonLd: page.requireJsonLd });
    for (const check of checks) {
      if (!check.pattern.test(html)) {
        errors.push(`[head-validate] ${page.label} missing ${check.name} (${fullPath})`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n[head-validate] Failed with the following issues:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('[head-validate] OK (required head metadata found in sampled dist pages)');
}

main().catch((error) => {
  console.error(`[head-validate] ${error.message}`);
  process.exit(1);
});
