import { readFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const formsPath = path.resolve(repoRoot, 'src', 'data', 'forms.json');

const requiredForms = ['mainGetInTouch', 'freeGetAccessNow'];
const placeholderPrefixes = ['REPLACE_', 'TODO_', 'CHANGE_ME'];
const formIdPattern = /^[A-Za-z0-9]+$/;

function isPlaceholder(value) {
  return placeholderPrefixes.some((prefix) => value.startsWith(prefix));
}

function readString(record, key) {
  const value = record?.[key];
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseShareUrl(value) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') {
      return null;
    }

    if (parsed.hostname !== 'tally.so') {
      return null;
    }

    const [segment, id] = parsed.pathname.split('/').filter(Boolean);
    if (!segment || !id) {
      return null;
    }

    if (segment !== 'r' && segment !== 'embed') {
      return null;
    }

    return { formId: id };
  } catch {
    return null;
  }
}

function validateEmbedMinHeight(value) {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return 'embedMinHeight must be an integer when provided';
  }

  if (value < 120 || value > 2000) {
    return 'embedMinHeight must be between 120 and 2000';
  }

  return null;
}

async function main() {
  const raw = await readFile(formsPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('src/data/forms.json must be an object');
  }

  const errors = [];

  requiredForms.forEach((formKey) => {
    const config = parsed[formKey];

    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      errors.push(`[${formKey}] missing form config object`);
      return;
    }

    const formId = readString(config, 'formId');
    const shareUrl = readString(config, 'shareUrl');

    if (!formId) {
      errors.push(`[${formKey}] missing formId`);
    } else {
      if (!formIdPattern.test(formId)) {
        errors.push(`[${formKey}] formId must be alphanumeric`);
      }

      if (isPlaceholder(formId)) {
        errors.push(`[${formKey}] formId is placeholder value`);
      }
    }

    if (!shareUrl) {
      errors.push(`[${formKey}] missing shareUrl`);
      return;
    }

    if (isPlaceholder(shareUrl)) {
      errors.push(`[${formKey}] shareUrl is placeholder value`);
      return;
    }

    const parsedUrl = parseShareUrl(shareUrl);
    if (!parsedUrl) {
      errors.push(
        `[${formKey}] shareUrl must be a valid https://tally.so/r/<id> or /embed/<id> URL`
      );
      return;
    }

    if (formId && parsedUrl.formId !== formId) {
      errors.push(
        `[${formKey}] shareUrl form id (${parsedUrl.formId}) does not match formId (${formId})`
      );
    }

    const minHeightIssue = validateEmbedMinHeight(config.embedMinHeight);
    if (minHeightIssue) {
      errors.push(`[${formKey}] ${minHeightIssue}`);
    }
  });

  if (errors.length > 0) {
    console.error('\n[forms-validate] Failed with the following issues:');
    errors.forEach((error) => {
      console.error(`- ${error}`);
    });
    process.exit(1);
  }

  console.log(`[forms-validate] OK (${requiredForms.length} forms validated)`);
}

main().catch((error) => {
  console.error(`[forms-validate] ${error.message}`);
  process.exit(1);
});
