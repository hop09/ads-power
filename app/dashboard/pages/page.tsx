import Link from 'next/link';
import { sql } from '@/lib/db';
import DeletePageButton from './DeletePageButton';

interface Page {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export default async function PagesListPage() {
  let pages: Page[] = [];

  try {
    pages = (await sql`SELECT id, title, slug, created_at FROM pages ORDER BY created_at DESC`) as Page[];
  } catch {
    // Tables may not be initialized
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pages</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>All published pages</p>
        </div>
        <Link href="/dashboard/pages/new" style={{
          backgroundColor: '#2563eb',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          + New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>No pages yet.</p>
          <Link href="/dashboard/pages/new" style={{ color: '#2563eb', fontSize: 14, marginTop: 12, display: 'inline-block', textDecoration: 'none' }}>
            Create your first page →
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#475569' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#475569' }}>Slug / URL</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#475569' }}>Created</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#475569' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr key={page.id} style={{ borderBottom: i < pages.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{page.title}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: 13, textDecoration: 'none' }}>
                      /{page.slug}
                    </a>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: 13 }}>
                    {new Date(page.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Link href={`/dashboard/pages/${page.id}/edit`} style={{
                      backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 14px',
                      borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: 'none',
                      border: '1px solid #e2e8f0',
                    }}>
                      Edit
                    </Link>
                    <DeletePageButton id={page.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
