import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ads = await sql`SELECT * FROM ads WHERE id = ${id}`;
    if (ads.length === 0) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    return NextResponse.json(ads[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, code, placement, is_active } = await request.json();

    if (!name || !code) {
      return NextResponse.json({ error: 'name and code are required' }, { status: 400 });
    }

    const validPlacements = ['head', 'body_start', 'body_end'];
    const adPlacement = validPlacements.includes(placement) ? placement : 'body_end';

    const result = await sql`
      UPDATE ads SET name = ${name}, code = ${code}, placement = ${adPlacement}, is_active = ${is_active ?? true}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (result.length === 0) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { is_active } = await request.json();

    const result = await sql`
      UPDATE ads SET is_active = ${is_active}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (result.length === 0) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to toggle ad' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await sql`DELETE FROM ads WHERE id = ${id} RETURNING id`;
    if (result.length === 0) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    return NextResponse.json({ message: 'Ad deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
  }
}
