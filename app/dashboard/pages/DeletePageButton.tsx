'use client';
import { useRouter } from 'next/navigation';

export default function DeletePageButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this page?')) return;

    const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Failed to delete page.');
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        backgroundColor: '#fef2f2', color: '#dc2626', padding: '6px 14px',
        borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer',
        border: '1px solid #fecaca',
      }}
    >
      Delete
    </button>
  );
}
