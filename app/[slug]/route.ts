import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface Ad {
  id: number;
  code: string;
  placement: string;
  is_active: boolean;
}

interface Page {
  id: number;
  html_content: string;
}

function injectAds(html: string, ads: Ad[]): string {
  const activeAds = ads.filter((a) => a.is_active);

  const headAds = activeAds.filter((a) => a.placement === 'head').map((a) => a.code).join('\n');
  const bodyStartAds = activeAds.filter((a) => a.placement === 'body_start').map((a) => a.code).join('\n');
  const bodyEndAds = activeAds.filter((a) => a.placement === 'body_end').map((a) => a.code).join('\n');

  let result = html;

  if (headAds) {
    if (result.includes('</head>')) {
      result = result.replace('</head>', `${headAds}\n</head>`);
    } else {
      result = headAds + '\n' + result;
    }
  }

  if (bodyStartAds) {
    if (/<body([^>]*)>/i.test(result)) {
      result = result.replace(/<body([^>]*)>/i, (match) => `${match}\n${bodyStartAds}`);
    } else {
      result = bodyStartAds + '\n' + result;
    }
  }

  if (bodyEndAds) {
    if (result.includes('</body>')) {
      result = result.replace('</body>', `${bodyEndAds}\n</body>`);
    } else {
      result = result + '\n' + bodyEndAds;
    }
  }

  return result;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const pages = await sql`SELECT * FROM pages WHERE slug = ${slug}`;

    if (pages.length === 0) {
      return new NextResponse('<h1>404 - Page not found</h1>', {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const page = pages[0] as Page;

    const ads = (await sql`
      SELECT a.id, a.code, a.placement, a.is_active
      FROM ads a
      INNER JOIN page_ads pa ON pa.ad_id = a.id
      WHERE pa.page_id = ${page.id}
    `) as Ad[];

    const finalHtml = injectAds(page.html_content, ads);

    return new NextResponse(finalHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error serving page:', error);
    return new NextResponse('<h1>500 - Server Error</h1>', {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
