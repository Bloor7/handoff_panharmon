import { AdminNotice, AdminSearch, AdminShell, DeleteButton } from "@/components/admin/AdminShell";
import { deleteTag, saveTag } from "@/app/admin/actions";
import { listTags } from "@/services/cms";

type Props = { searchParams: Promise<{ q?: string; edit?: string; status?: string; notice?: string }> };

export default async function TagsPage({ searchParams }: Props) {
  const params = await searchParams;
  const list = await listTags(params.q || "");
  const editing = list.rows.find((row) => row.id === params.edit);
  return (
    <AdminShell title="Tags" subtitle="CRUD tag dùng cho taxonomy, internal link và filter CMS.">
      <AdminNotice configured={list.configured} error={list.error} status={params.notice || params.status} />
      <div className="admin-grid">
        <section className="admin-panel">
          <h2>{editing ? "Sửa tag" : "Tạo tag"}</h2>
          <form action={saveTag} className="admin-form">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <label>Tên<input name="name" defaultValue={editing?.name} required /></label>
            <label>Slug<input name="slug" defaultValue={editing?.slug} placeholder="auto nếu để trống" /></label>
            <button className="btn btn-primary" type="submit">{editing ? "Lưu thay đổi" : "Tạo tag"}</button>
          </form>
        </section>
        <section className="admin-panel">
          <AdminSearch placeholder="Tìm tag..." />
          <table className="admin-table">
            <thead><tr><th>Tên</th><th>Slug</th><th></th></tr></thead>
            <tbody>{list.rows.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.slug}</td><td className="admin-actions"><a href={`/admin/tags?edit=${row.id}`}>Sửa</a><DeleteButton action={deleteTag} id={row.id} /></td></tr>)}</tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
