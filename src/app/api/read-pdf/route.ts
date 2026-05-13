import PDFDocument from 'pdfkit';
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReaderArticle = {
  title: string;
  byline?: string | null;
  content: string;
  siteName?: string | null;
  excerpt?: string | null;
};

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function extractMeta(doc: Document, names: string[]) {
  for (const name of names) {
    const meta = doc.querySelector(`meta[property="${name}"]`) || doc.querySelector(`meta[name="${name}"]`);
    const value = meta?.getAttribute('content')?.trim();
    if (value) return decodeEntities(value);
  }
  return '';
}

function normalizeText(text: string) {
  return decodeEntities(text)
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractReadableText(doc: Document) {
  const root = doc.querySelector('article, main') || doc.body;
  const clone = root.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('script, style, iframe, object, embed, nav, footer, aside, form, noscript').forEach((node) => {
    node.remove();
  });

  const blocks = Array.from(clone.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, pre'));

  if (blocks.length > 0) {
    return blocks
      .map((block) => normalizeText(block.textContent || ''))
      .filter(Boolean)
      .join('\n\n');
  }

  return normalizeText(clone.textContent || '');
}

async function fetchArticle(url: string): Promise<ReaderArticle | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const doc = new JSDOM(html, { url }).window.document;

    return {
      title: extractMeta(doc, ['og:title', 'twitter:title']) || doc.title || 'Reader View',
      byline: extractMeta(doc, ['author', 'article:author']) || null,
      siteName: extractMeta(doc, ['og:site_name']) || new URL(url).hostname.replace(/^www\./, ''),
      excerpt: extractMeta(doc, ['description', 'og:description']) || null,
      content: extractReadableText(doc),
    };
  } catch (error) {
    console.error('Error creating PDF reader:', error);
    return null;
  }
}

function buildPdf(article: ReaderArticle) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margin: 54,
      info: {
        Title: article.title,
        Author: article.byline || article.siteName || 'Trans Tracker 101',
      },
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).fillColor('#0f172a').text(article.title, { lineGap: 4 });

    const metadata: string[] = [];
    if (article.siteName) metadata.push(article.siteName);
    if (article.byline) metadata.push(`By ${article.byline}`);
    if (article.excerpt) metadata.push(article.excerpt);

    if (metadata.length) {
      doc.moveDown(0.75);
      doc.fontSize(10).fillColor('#475569').text(metadata.join('   •   '), {
        lineGap: 2,
      });
    }

    doc.moveDown(1);
    doc.fontSize(12).fillColor('#111827');

    const paragraphs = article.content
      .split(/\n\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (!paragraphs.length) {
      doc.text('No readable text found in this article.');
    } else {
      paragraphs.forEach((paragraph) => {
        doc.text(paragraph, {
          lineGap: 3,
          paragraphGap: 8,
        });
      });
    }

    doc.end();
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const article = await fetchArticle(url);

  if (!article) {
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }

  const pdf = await buildPdf(article);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="clean-read.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}
