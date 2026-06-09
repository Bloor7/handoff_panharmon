import { AdminNotice, AdminSearch, AdminShell, DeleteButton } from "@/components/admin/AdminShell";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { listCategories } from "@/services/cms";

type Props = { searchParams: Promise<{ q?: string; edit?: string; status?: string; notice?: string }> };

export default async function CategoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const list = await listCategories(params.q || "");
  const editing = list.rows.find((row) => row.id === params.edit);
  return (
    <AdminShell title="Categories" subtitle="CRUD category cho blog và thư viện nội dung.">
      <AdminNotice configured={list.configured} error={list.error} status={params.notice || params.status} />
      <div className="admin-grid">
        <section className="admin-panel">
          <h2>{editing ? "Sửa category" : "Tạo category"}</h2>
          <form action={saveCategory} className="admin-form">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <label>Tên<input name="name" defaultValue={editing?.name} required /></label>
            <label>Slug<input name="slug" defaultValue={editing?.slug} placeholder="auto nếu để trống" /></label>
            <label>Mô tả<textarea name="description" defaultValue={editing?.description || ""} /></label>
            <button className="btn btn-primary" type="submit">{editing ? "Lưu thay đổi" : "Tạo category"}</button>
          </form>
        </section>
        <section className="admin-panel">
          <AdminSearch placeholder="Tìm category..." />
          <table className="admin-table">
            <thead><tr><th>Tên</th><th>Slug</th><th></th></tr></thead>
            <tbody>{list.rows.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.slug}</td><td className="admin-actions"><a href={`/admin/categories?edit=${row.id}`}>Sửa</a><DeleteButton action={deleteCategory} id={row.id} /></td></tr>)}</tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
