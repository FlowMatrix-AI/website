import { describe, it, expect } from 'vitest';
import { readTemplateStatus, isPublishedTemplateStatus } from '../src/data/templateStatus.mjs';

describe('readTemplateStatus', () => {
  it('returns "published" for the string "published"', () => {
    expect(readTemplateStatus('published')).toBe('published');
  });

  it('returns "draft" for the string "draft"', () => {
    expect(readTemplateStatus('draft')).toBe('draft');
  });

  it('returns "archived" for the string "archived"', () => {
    expect(readTemplateStatus('archived')).toBe('archived');
  });

  it('is case-insensitive', () => {
    expect(readTemplateStatus('Published')).toBe('published');
    expect(readTemplateStatus('DRAFT')).toBe('draft');
    expect(readTemplateStatus('Archived')).toBe('archived');
  });

  it('trims surrounding whitespace', () => {
    expect(readTemplateStatus('  published  ')).toBe('published');
  });

  it('returns null for an unknown status string', () => {
    expect(readTemplateStatus('active')).toBeNull();
    expect(readTemplateStatus('live')).toBeNull();
    expect(readTemplateStatus('pending')).toBeNull();
  });

  it('returns null for null', () => {
    expect(readTemplateStatus(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(readTemplateStatus(undefined)).toBeNull();
  });

  it('returns null for a non-string, non-null value', () => {
    expect(readTemplateStatus(1)).toBeNull();
    expect(readTemplateStatus(true)).toBeNull();
    expect(readTemplateStatus({})).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(readTemplateStatus('')).toBeNull();
    expect(readTemplateStatus('   ')).toBeNull();
  });
});

describe('isPublishedTemplateStatus', () => {
  it('returns true for "published"', () => {
    expect(isPublishedTemplateStatus('published')).toBe(true);
  });

  it('returns true for case variants of "published"', () => {
    expect(isPublishedTemplateStatus('Published')).toBe(true);
    expect(isPublishedTemplateStatus('PUBLISHED')).toBe(true);
  });

  it('returns false for "draft"', () => {
    expect(isPublishedTemplateStatus('draft')).toBe(false);
  });

  it('returns false for "archived"', () => {
    expect(isPublishedTemplateStatus('archived')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isPublishedTemplateStatus(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isPublishedTemplateStatus(undefined)).toBe(false);
  });

  it('returns false for an unknown status string', () => {
    expect(isPublishedTemplateStatus('active')).toBe(false);
    expect(isPublishedTemplateStatus('')).toBe(false);
  });
});
