import { AdminNotice, AdminSearch, AdminShell, DeleteButton } from "@/components/admin/AdminShell";
import { deleteMedia, uploadMedia } from "@/app/admin/actions";
import { listMedia } from "@/services/cms";

type Props = { searchParams: Promise<{ q?: string; status?: string; notice?: string }> };

export default async function MediaPage({ searchParams }: Props) {
  const params = await searchParams;
  const list = await listMedia(params.q || "");
  return (
    <AdminShell title="Media" subtitle="Upload media vào Supabase Storage bucket `media` và lưu metadata.">
      <AdminNotice configured={list.configured} error={list.error} status={params.notice || params.status} />
      <div className="admin-grid">
        <section className="admin-panel">
          <h2>Upload media</h2>
          <form action={uploadMedia} className="admin-form">
            <label>File<input name="file" type="file" required /></label>
            <label>Alt text<input name="alt" /></label>
            <button className="btn btn-primary" type="submit">Upload</button>
          </form>
        </section>
        <section className="admin-panel">
          <AdminSearch placeholder="Tìm media..." />
          <table className="admin-table">
            <thead><tr><th>Path</th><th>Alt</th><th>Size</th><th></th></tr></thead>
            <tbody>{list.rows.map((row) => <tr key={row.id}><td>{row.path}</td><td>{row.alt || "-"}</td><td>{row.size_bytes || 0}</td><td><DeleteButton action={deleteMedia} id={row.id} extra={{ path: row.path }} /></td></tr>)}</tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
