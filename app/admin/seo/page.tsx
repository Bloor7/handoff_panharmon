import { AdminNotice, AdminSearch, AdminShell, DeleteButton } from "@/components/admin/AdminShell";
import { deleteSeo, saveSeo } from "@/app/admin/actions";
import { listSeo } from "@/services/cms";

type Props = { searchParams: Promise<{ q?: string; edit?: string; status?: string; notice?: string }> };

export default async function SeoPage({ searchParams }: Props) {
  const params = await searchParams;
  const list = await listSeo(params.q || "");
  const editing = list.rows.find((row) => row.id === params.edit);
  return (
    <AdminShell title="SEO" subtitle="Editor metadata: title, description, canonical, noindex.">
      <AdminNotice configured={list.configured} error={list.error} status={params.notice || params.status} />
      <div className="admin-grid">
        <section className="admin-panel">
          <h2>{editing ? "Sửa metadata" : "Tạo metadata"}</h2>
          <form action={saveSeo} className="admin-form">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <label>Entity type<input name="entity_type" defaultValue={editing?.entity_type || "page"} required /></label>
            <label>Path<input name="path" defaultValue={editing?.path || ""} placeholder="/giai-ma/nuoc" /></label>
            <label>Title<input name="title" defaultValue={editing?.title || ""} /></label>
            <label>Description<textarea name="description" defaultValue={editing?.description || ""} /></label>
            <label>Canonical URL<input name="canonical_url" defaultValue={editing?.canonical_url || ""} /></label>
            <label className="admin-check"><input name="noindex" type="checkbox" defaultChecked={editing?.noindex} /> Noindex</label>
            <button className="btn btn-primary" type="submit">Lưu SEO</button>
          </form>
        </section>
        <section className="admin-panel">
          <AdminSearch placeholder="Tìm metadata..." />
          <table className="admin-table">
            <thead><tr><th>Path</th><th>Title</th><th>Noindex</th><th></th></tr></thead>
            <tbody>{list.rows.map((row) => <tr key={row.id}><td>{row.path || row.entity_type}</td><td>{row.title || "-"}</td><td>{row.noindex ? "Yes" : "No"}</td><td className="admin-actions"><a href={`/admin/seo?edit=${row.id}`}>Sửa</a><DeleteButton action={deleteSeo} id={row.id} /></td></tr>)}</tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
