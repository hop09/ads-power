import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const pages = await sql`SELECT id, title, slug, created_at, updated_at FROM pages ORDER BY created_at DESC`;
    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, html_content, ad_ids } = await request.json();

    if (!title || !slug || !html_content) {
      return NextResponse.json({ error: 'title, slug and html_content are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const result = await sql`
      INSERT INTO pages (title, slug, html_content)
      VALUES (${title}, ${cleanSlug}, ${html_content})
      RETURNING *
    `;

    const newPage = result[0];

    if (Array.isArray(ad_ids) && ad_ids.length > 0) {
      for (const adId of ad_ids) {
        await sql`INSERT INTO page_ads (page_id, ad_id) VALUES (${newPage.id}, ${adId}) ON CONFLICT DO NOTHING`;
      }
    }

    return NextResponse.json(newPage, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
