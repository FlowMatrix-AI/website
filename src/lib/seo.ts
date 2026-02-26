import { allowIndexing, defaultOgImage, siteName, toAbsoluteUrl } from '../config/site'

type SeoInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
}

export function createSeoHead({
  title,
  description,
  path,
  image = defaultOgImage,
  type = 'website',
}: SeoInput) {
  const canonicalUrl = toAbsoluteUrl(path)
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  return {
    title: fullTitle,
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'robots',
        content: allowIndexing ? 'index,follow' : 'noindex,nofollow',
      },
      {
        property: 'og:title',
        content: fullTitle,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:url',
        content: canonicalUrl,
      },
      {
        property: 'og:type',
        content: type,
      },
      {
        property: 'og:site_name',
        content: siteName,
      },
      {
        property: 'og:image',
        content: toAbsoluteUrl(image),
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: fullTitle,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: toAbsoluteUrl(image),
      },
    ],
  }
}
