'use client';
import { useState, useEffect, useCallback } from 'react';

interface Ad {
  id: number;
  name: string;
  code: string;
  placement: string;
  is_active: boolean;
  created_at: string;
}

const PLACEMENTS = [
  { value: 'head', label: 'Head (before </head>)' },
  { value: 'body_start', label: 'Body Start (after <body>)' },
  { value: 'body_end', label: 'Body End (before </body>)' },
];

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

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [placement, setPlacement] = useState('body_end');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/ads');
    const data = await res.json();
    if (Array.isArray(data)) setAds(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  function openNewForm() {
    setEditingAd(null);
    setName(''); setCode(''); setPlacement('body_end'); setFormError('');
    setShowForm(true);
  }

  function openEditForm(ad: Ad) {
    setEditingAd(ad);
    setName(ad.name); setCode(ad.code); setPlacement(ad.placement); setFormError('');
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!name.trim() || !code.trim()) { setFormError('Name and ad code are required.'); return; }
    setSaving(true);
    try {
      const url = editingAd ? `/api/ads/${editingAd.id}` : '/api/ads';
      const method = editingAd ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, placement, is_active: editingAd?.is_active ?? true }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error ?? 'Failed to save ad.');
        setSaving(false); return;
      }
      setShowForm(false);
      fetchAds();
    } catch { setFormError('Something went wrong.'); }
    setSaving(false);
  }

  async function toggleAd(ad: Ad) {
    await fetch(`/api/ads/${ad.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !ad.is_active }),
    });
    fetchAds();
  }

  async function deleteAd(id: number) {
    if (!confirm('Delete this ad?')) return;
    await fetch(`/api/ads/${id}`, { method: 'DELETE' });
    fetchAds();
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>Ads</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Manage your ad codes</p>
        </div>
        <button onClick={openNewForm} style={{
          backgroundColor: '#2563eb', color: '#fff', padding: '10px 20px',
          borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
        }}>
          + New Ad
        </button>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: '#fff', borderRadius: 12, border: '1px solid #bfdbfe',
          padding: 28, marginBottom: 28, boxShadow: '0 4px 20px rgba(37,99,235,0.08)',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>
            {editingAd ? 'Edit Ad' : 'New Ad'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 14 }}>
                {formError}
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Ad Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Google AdSense - Banner" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Placement</label>
              <select value={placement} onChange={(e) => setPlacement(e.target.value)} style={inputStyle}>
                {PLACEMENTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Ad Code</label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your ad script or HTML code here..."
                rows={8} style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" disabled={saving} style={{
                backgroundColor: saving ? '#93c5fd' : '#2563eb', color: '#fff',
                padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              }}>
                {saving ? 'Saving...' : editingAd ? 'Update Ad' : 'Create Ad'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '64px 0' }}>Loading ads...</div>
      ) : ads.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>No ads yet.</p>
          <button onClick={openNewForm} style={{ color: '#2563eb', background: 'none', border: 'none', fontSize: 14, marginTop: 12, cursor: 'pointer' }}>
            Create your first ad →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ads.map((ad) => (
            <div key={ad.id} style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              borderLeft: `4px solid ${ad.is_active ? '#22c55e' : '#cbd5e1'}`,
              padding: '18px 20px',
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{ad.name}</span>
                  <span style={{ fontSize: 12, backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 10px', borderRadius: 20, fontFamily: 'monospace' }}>
                    {PLACEMENTS.find((p) => p.value === ad.placement)?.label ?? ad.placement}
                  </span>
                  <span style={{
                    fontSize: 12, padding: '2px 10px', borderRadius: 20, fontWeight: 600,
                    backgroundColor: ad.is_active ? '#dcfce7' : '#f1f5f9',
                    color: ad.is_active ? '#16a34a' : '#94a3b8',
                  }}>
                    {ad.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
                <pre style={{
                  marginTop: 12, backgroundColor: '#f8fafc', borderRadius: 8, padding: '10px 14px',
                  fontSize: 12, color: '#475569', overflowX: 'auto', whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace', maxHeight: 120, overflowY: 'auto',
                  border: '1px solid #e2e8f0', lineHeight: 1.6,
                }}>
                  {ad.code}
                </pre>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggleAd(ad)} style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: 'none',
                  backgroundColor: ad.is_active ? '#fef9c3' : '#dcfce7',
                  color: ad.is_active ? '#a16207' : '#15803d',
                }}>
                  {ad.is_active ? 'Turn Off' : 'Turn On'}
                </button>
                <button onClick={() => openEditForm(ad)} style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
                }}>
                  Edit
                </button>
                <button onClick={() => deleteAd(ad.id)} style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

