import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/privacy-policy', changefreq: 'monthly', priority: 0.8 },
    { url: '/terms-of-service', changefreq: 'monthly', priority: 0.8 },
    // Add more pages here
  ];

  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });

  res.writeHead(200, {
    'Content-Type': 'application/xml',
  });

  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  );

  res.end(xmlString);
}
