'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/pages', label: 'Pages' },
    { href: '/dashboard/ads', label: 'Ads' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
      <header style={{ backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>
            📊 Ads Dashboard
          </span>
          <nav style={{ display: 'flex', gap: 8 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  backgroundColor: pathname === link.href ? '#3b82f6' : 'transparent',
                  color: pathname === link.href ? '#fff' : '#94a3b8',
                  border: pathname === link.href ? 'none' : '1px solid transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  );
}
