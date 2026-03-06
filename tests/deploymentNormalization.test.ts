import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SITE_URL,
  normalizeSiteUrl,
  normalizeAllowIndexing,
  normalizeMeasurementId,
} from '../src/config/deploymentNormalization.mjs';

describe('DEFAULT_SITE_URL', () => {
  it('is a valid https URL', () => {
    expect(DEFAULT_SITE_URL).toMatch(/^https:\/\//);
  });
});

describe('normalizeSiteUrl', () => {
  it('returns a well-formed URL unchanged', () => {
    expect(normalizeSiteUrl('https://example.com')).toBe('https://example.com');
  });

  it('strips a trailing slash', () => {
    expect(normalizeSiteUrl('https://example.com/')).toBe('https://example.com');
  });

  it('strips multiple trailing slashes', () => {
    expect(normalizeSiteUrl('https://example.com///')).toBe('https://example.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeSiteUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('returns DEFAULT_SITE_URL for a non-string value', () => {
    expect(normalizeSiteUrl(null)).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl(undefined)).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl(42)).toBe(DEFAULT_SITE_URL);
  });

  it('returns DEFAULT_SITE_URL for an empty string', () => {
    expect(normalizeSiteUrl('')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('   ')).toBe(DEFAULT_SITE_URL);
  });
});

describe('normalizeAllowIndexing', () => {
  it('returns true as-is', () => {
    expect(normalizeAllowIndexing(true, 'https://example.com')).toBe(true);
  });

  it('returns false as-is', () => {
    expect(normalizeAllowIndexing(false, 'https://example.com')).toBe(false);
  });

  it('infers false for a github.io domain when value is not boolean', () => {
    expect(normalizeAllowIndexing(null, 'https://some-user.github.io')).toBe(false);
    expect(normalizeAllowIndexing(undefined, 'https://org-name.github.io')).toBe(false);
  });

  it('infers true for a non-github.io domain when value is not boolean', () => {
    expect(normalizeAllowIndexing(null, 'https://flowmatrixai.com')).toBe(true);
    expect(normalizeAllowIndexing('yes', 'https://example.com')).toBe(true);
  });

  it('infers true when siteUrl is unparseable and value is not boolean', () => {
    expect(normalizeAllowIndexing(null, 'not-a-url')).toBe(true);
  });
});

describe('normalizeMeasurementId', () => {
  it('returns the value trimmed', () => {
    expect(normalizeMeasurementId('G-ABC123')).toBe('G-ABC123');
    expect(normalizeMeasurementId('  G-XYZ  ')).toBe('G-XYZ');
  });

  it('returns an empty string for a non-string value', () => {
    expect(normalizeMeasurementId(null)).toBe('');
    expect(normalizeMeasurementId(undefined)).toBe('');
    expect(normalizeMeasurementId(123)).toBe('');
  });

  it('returns an empty string for an empty string input', () => {
    expect(normalizeMeasurementId('')).toBe('');
    expect(normalizeMeasurementId('   ')).toBe('');
  });
});
