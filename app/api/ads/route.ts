import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const ads = await sql`SELECT * FROM ads ORDER BY created_at DESC`;
    return NextResponse.json(ads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, code, placement } = await request.json();

    if (!name || !code) {
      return NextResponse.json({ error: 'name and code are required' }, { status: 400 });
    }

    const validPlacements = ['head', 'body_start', 'body_end'];
    const adPlacement = validPlacements.includes(placement) ? placement : 'body_end';

    const result = await sql`
      INSERT INTO ads (name, code, placement)
      VALUES (${name}, ${code}, ${adPlacement})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}
