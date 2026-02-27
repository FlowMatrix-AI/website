import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  normalizeAllowIndexing,
  normalizeMeasurementId,
  normalizeSiteUrl,
} from '../src/config/deploymentNormalization.mjs';

const deploymentConfigPath = path.resolve(process.cwd(), 'src', 'config', 'deployment.json');

export async function readDeploymentConfig() {
  const raw = await readFile(deploymentConfigPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('src/config/deployment.json must be an object');
  }

  const siteUrl = normalizeSiteUrl(parsed.siteUrl);

  return {
    siteUrl,
    allowIndexing: normalizeAllowIndexing(parsed.allowIndexing, siteUrl),
    gaMeasurementId: normalizeMeasurementId(parsed.gaMeasurementId),
  };
}

export { deploymentConfigPath };
