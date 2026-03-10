import EditPageForm from './EditPageForm';

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>Edit Page</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Update your page content and assigned ads.</p>
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <EditPageForm pageId={id} />
      </div>
    </div>
  );
}
