import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        html_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code TEXT NOT NULL,
        placement VARCHAR(50) DEFAULT 'body_end',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS page_ads (
        page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
        ad_id INTEGER REFERENCES ads(id) ON DELETE CASCADE,
        PRIMARY KEY (page_id, ad_id)
      )
    `;

    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('DB init error:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}
