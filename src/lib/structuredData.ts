import { siteName, siteUrl, toAbsoluteUrl } from '../config/site';

type JsonLdSchema = Record<string, unknown>;

type WebPageSchemaInput = {
  name: string;
  description: string;
  path: string;
};

type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
};

type CollectionPageSchemaInput = {
  name: string;
  description: string;
  path: string;
};

type CreativeWorkSchemaInput = {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  creators?: string[];
  datePublished?: string | null;
  dateModified?: string | null;
};

type FaqEntry = {
  question: string;
  answer: string;
};

type FaqPageSchemaInput = {
  path: string;
  entries: FaqEntry[];
};

function compactObject<T extends JsonLdSchema>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return true;
    })
  ) as T;
}

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

export function createServiceSchema({ name, description, path }: ServiceSchemaInput): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: toAbsoluteUrl(path),
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

export function createCollectionPageSchema({
  name,
  description,
  path,
}: CollectionPageSchemaInput): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: toAbsoluteUrl(path),
  };
}

export function createCreativeWorkSchema({
  name,
  description,
  path,
  image,
  keywords,
  creators,
  datePublished,
  dateModified,
}: CreativeWorkSchemaInput): JsonLdSchema {
  const creatorList = creators?.map((creatorName) => ({
    '@type': 'Person',
    name: creatorName,
  }));

  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: toAbsoluteUrl(path),
    image: image ? toAbsoluteUrl(image) : undefined,
    keywords,
    creator: creatorList,
    datePublished,
    dateModified,
  });
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
