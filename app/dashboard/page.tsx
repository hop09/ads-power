import Link from 'next/link';
import { sql } from '@/lib/db';

export default async function DashboardPage() {
  let pageCount = 0;
  let adCount = 0;
  let activeAdCount = 0;

  try {
    const pagesResult = await sql`SELECT COUNT(*) as count FROM pages`;
    const adsResult = await sql`SELECT COUNT(*) as count FROM ads`;
    const activeAdsResult = await sql`SELECT COUNT(*) as count FROM ads WHERE is_active = TRUE`;
    pageCount = Number(pagesResult[0]?.count ?? 0);
    adCount = Number(adsResult[0]?.count ?? 0);
    activeAdCount = Number(activeAdsResult[0]?.count ?? 0);
  } catch {
    // Tables may not exist yet
  }

  const card: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '24px 28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>Overview</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 15 }}>
          Manage your ad pages and ad codes from here.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <div style={card}>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pages</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: '#1e293b', margin: '8px 0 0' }}>{pageCount}</p>
        </div>
        <div style={card}>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Ads</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: '#1e293b', margin: '8px 0 0' }}>{adCount}</p>
        </div>
        <div style={card}>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Ads</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: '#16a34a', margin: '8px 0 0' }}>{activeAdCount}</p>
        </div>
      </div>

      {/* Setup notice */}
      <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde047', borderRadius: 10, padding: '14px 20px', marginBottom: 32 }}>
        <p style={{ fontWeight: 700, color: '#854d0e', margin: 0, fontSize: 14 }}>First time setup?</p>
        <p style={{ color: '#92400e', fontSize: 14, margin: '4px 0 0' }}>
          Initialize the database tables by visiting{' '}
          <a href="/api/setup" style={{ color: '#b45309', fontWeight: 600 }} target="_blank">
            /api/setup
          </a>{' '}
          once before using the dashboard.
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Link href="/dashboard/pages/new" style={{
          backgroundColor: '#2563eb',
          borderRadius: 12,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>+ Create New Page</span>
          <span style={{ fontSize: 14, color: '#bfdbfe' }}>Paste HTML and publish a new page instantly.</span>
        </Link>
        <Link href="/dashboard/ads" style={{
          backgroundColor: '#1e293b',
          borderRadius: 12,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Manage Ads</span>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>Add, edit, toggle ad codes on/off.</span>
        </Link>
      </div>
    </div>
  );
}
