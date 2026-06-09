import { AdminNotice, AdminSearch, AdminShell, DeleteButton } from "@/components/admin/AdminShell";
import { deleteSetting, saveSetting } from "@/app/admin/actions";
import { listSettings } from "@/services/cms";

type Props = { searchParams: Promise<{ q?: string; edit?: string; status?: string; notice?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const list = await listSettings(params.q || "");
  const editing = list.rows.find((row) => row.key === params.edit);
  return (
    <AdminShell title="Settings" subtitle="Key/value JSON cho site config, CTA, social links và feature flags.">
      <AdminNotice configured={list.configured} error={list.error} status={params.notice || params.status} />
      <div className="admin-grid">
        <section className="admin-panel">
          <h2>{editing ? "Sửa setting" : "Tạo setting"}</h2>
          <form action={saveSetting} className="admin-form">
            <label>Key<input name="key" defaultValue={editing?.key} required readOnly={Boolean(editing)} /></label>
            <label>Value JSON<textarea name="value" defaultValue={editing ? JSON.stringify(editing.value, null, 2) : "{\n  \n}"} rows={10} /></label>
            <button className="btn btn-primary" type="submit">Lưu setting</button>
          </form>
        </section>
        <section className="admin-panel">
          <AdminSearch placeholder="Tìm setting..." />
          <table className="admin-table">
            <thead><tr><th>Key</th><th>Value</th><th></th></tr></thead>
            <tbody>{list.rows.map((row) => <tr key={row.key}><td>{row.key}</td><td><code>{JSON.stringify(row.value).slice(0, 80)}</code></td><td className="admin-actions"><a href={`/admin/settings?edit=${row.key}`}>Sửa</a><DeleteButton action={deleteSetting} id="" extra={{ key: row.key }} /></td></tr>)}</tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
