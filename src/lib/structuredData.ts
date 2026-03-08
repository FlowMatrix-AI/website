import { siteName, siteUrl, toAbsoluteUrl } from '../config/site';

type JsonLdSchema = Record<string, unknown>;

type WebPageSchemaInput = {
  name: string;
  description: string;
  path: string;
};

type FaqEntry = {
  question: string;
  answer: string;
};

type FaqPageSchemaInput = {
  path: string;
  entries: FaqEntry[];
};

export function createJsonLdHead(schemas: JsonLdSchema[]) {
  return {
    script: schemas.map((schema, index) => {
      const schemaType = typeof schema['@type'] === 'string' ? schema['@type'] : 'schema';

      return {
        key: `ld-${schemaType}-${index}`,
        type: 'application/ld+json',
        children: JSON.stringify(schema),
      };
    }),
  };
}

export function createOrganizationSchema(): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: toAbsoluteUrl('/flowmatrix-logo.webp'),
  };
}

export function createWebPageSchema({ name, description, path }: WebPageSchemaInput): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: toAbsoluteUrl(path),
  };
}

export function createFaqPageSchema({ path, entries }: FaqPageSchemaInput): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: toAbsoluteUrl(path),
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };
}
