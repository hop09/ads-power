'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Ad {
  id: number;
  name: string;
  placement: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#1e293b',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
};

export default function NewPageForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedAds, setSelectedAds] = useState<number[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/ads').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setAds(data);
    });
  }, []);

  useEffect(() => {
    if (title && !slug) {
      setSlug(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [title, slug]);

  function toggleAd(id: number) {
    setSelectedAds((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !slug.trim() || !htmlContent.trim()) {
      setError('All fields are required.'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, html_content: htmlContent, ad_ids: selectedAds }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create page.'); setLoading(false); return; }

      router.push('/dashboard/pages');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Page Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Landing Page - Offer 1" style={inputStyle} required />
      </div>

      <div>
        <label style={labelStyle}>Slug (URL path)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>/</span>
          <input type="text" value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            placeholder="landing-page-offer-1"
            style={{ ...inputStyle, fontFamily: 'monospace' }} required />
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
          Page will be at: <span style={{ fontFamily: 'monospace', color: '#64748b' }}>yourdomain.com/{slug}</span>
        </p>
      </div>

      <div>
        <label style={labelStyle}>HTML Content</label>
        <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="Paste your full HTML code here..."
          rows={16} style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical', lineHeight: 1.6 }} required />
      </div>

      {ads.length > 0 && (
        <div>
          <label style={labelStyle}>Assign Ads to this Page</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ads.map((ad) => (
              <label key={ad.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                border: `1px solid ${selectedAds.includes(ad.id) ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
                backgroundColor: selectedAds.includes(ad.id) ? '#eff6ff' : '#fff',
              }}>
                <input type="checkbox" checked={selectedAds.includes(ad.id)} onChange={() => toggleAd(ad.id)}
                  style={{ accentColor: '#2563eb' }} />
                <span style={{ fontSize: 14, color: '#374151' }}>{ad.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{ad.placement}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', paddingTop: 4 }}>
        <button type="submit" disabled={loading} style={{
          backgroundColor: loading ? '#93c5fd' : '#2563eb', color: '#fff',
          padding: '10px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Creating...' : 'Create Page'}
        </button>
        <button type="button" onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
