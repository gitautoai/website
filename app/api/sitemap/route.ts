import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { NextApiRequest, NextApiResponse } from 'next';

let sitemap: string | null = null;
let lastGenerated = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (sitemap && Date.now() - lastGenerated < CACHE_DURATION) {
    res.setHeader('Content-Type', 'application/xml');
    return res.send(sitemap);
  }

  const links = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/privacy-policy', changefreq: 'monthly', priority: 0.8 },
    { url: '/terms-of-service', changefreq: 'monthly', priority: 0.8 },
    // Add more pages here
  ];

  sitemap = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  );
  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });
  lastGenerated = Date.now();


  res.writeHead(200, {
    'Content-Type': 'application/xml',
  });

  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  );

  res.end(xmlString);
}
