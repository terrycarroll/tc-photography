export default function sitemap() {
  const baseUrl = 'https://terrycarrollphoto.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];
}
