import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pages = await sql`SELECT * FROM pages WHERE id = ${id}`;
    if (pages.length === 0) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const ads = await sql`
      SELECT a.* FROM ads a
      INNER JOIN page_ads pa ON pa.ad_id = a.id
      WHERE pa.page_id = ${id}
    `;

    return NextResponse.json({ ...pages[0], ads });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, slug, html_content, ad_ids } = await request.json();

    if (!title || !slug || !html_content) {
      return NextResponse.json({ error: 'title, slug and html_content are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const result = await sql`
      UPDATE pages SET title = ${title}, slug = ${cleanSlug}, html_content = ${html_content}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (result.length === 0) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    if (Array.isArray(ad_ids)) {
      await sql`DELETE FROM page_ads WHERE page_id = ${id}`;
      for (const adId of ad_ids) {
        await sql`INSERT INTO page_ads (page_id, ad_id) VALUES (${id}, ${adId}) ON CONFLICT DO NOTHING`;
      }
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error(error);
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await sql`DELETE FROM pages WHERE id = ${id} RETURNING id`;
    if (result.length === 0) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json({ message: 'Page deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
