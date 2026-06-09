import Link from "next/link";
import { AdminNotice, AdminShell, DeleteButton } from "@/components/admin/AdminShell";
import { RichEditor } from "@/components/admin/RichEditor";
import { deletePost, savePost } from "@/app/admin/actions";
import { getPost, listCategories, listPosts } from "@/services/cms";

type Props = { searchParams: Promise<{ q?: string; post_status?: string; status?: string; edit?: string; notice?: string }> };

const postStatuses = ["draft", "published", "scheduled"] as const;

function validPostStatus(value?: string) {
  return postStatuses.includes(value as (typeof postStatuses)[number]) ? value : "";
}

function noticeFromParams(params: Awaited<Props["searchParams"]>) {
  return params.notice || (validPostStatus(params.status) ? undefined : params.status);
}

function datetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function statusLabel(status: string) {
  if (status === "published") return "Published";
  if (status === "scheduled") return "Scheduled";
  return "Draft";
}

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = validPostStatus(params.post_status || params.status);
  const [posts, categories, editing] = await Promise.all([
    listPosts(params.q || "", statusFilter),
    listCategories(),
    getPost(params.edit)
  ]);
  const counts = postStatuses.reduce<Record<string, number>>((acc, status) => {
    acc[status] = posts.rows.filter((post) => post.status === status).length;
    return acc;
  }, {});
  return (
    <AdminShell title="Posts" subtitle="Quản lý bài viết: tạo, sửa, lên lịch, xuất bản và xóa nội dung hiển thị trên website.">
      <AdminNotice configured={posts.configured} error={posts.error || categories.error} status={noticeFromParams(params)} />
      <div className="admin-posts-stack">
        <section className="admin-panel">
          <h2>{editing ? "Sửa bài viết" : "Tạo bài viết"}</h2>
          <form action={savePost} className="admin-form">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <label>Tiêu đề<input name="title" defaultValue={editing?.title} required /></label>
            <label>Slug<input name="slug" defaultValue={editing?.slug} placeholder="auto nếu để trống" /></label>
            <label>Excerpt<textarea name="excerpt" defaultValue={editing?.excerpt || ""} /></label>
            <div className="admin-row">
              <label>Status<select name="status" defaultValue={editing?.status || "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select></label>
              <label>Category<select name="category_id" defaultValue={editing?.category_id || ""}><option value="">Không chọn</option>{categories.rows.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            </div>
            <div className="admin-row">
              <label>Published at<input name="published_at" type="datetime-local" defaultValue={datetimeLocal(editing?.published_at)} /></label>
              <label>Scheduled at<input name="scheduled_at" type="datetime-local" defaultValue={datetimeLocal(editing?.scheduled_at)} /></label>
            </div>
            <label>Nội dung</label>
            <RichEditor initialValue={editing?.content} />
            <div className="admin-form-actions">
              <button className="btn btn-primary" type="submit">{editing ? "Lưu bài viết" : "Tạo bài viết"}</button>
              {editing && <Link className="btn btn-ghost" href="/admin/posts">Hủy sửa</Link>}
            </div>
          </form>
        </section>
        <section className="admin-panel admin-posts-panel">
          <div className="admin-list-head">
            <div>
              <h2>Danh sách bài viết</h2>
              <p>{posts.rows.length} bài đang hiển thị · Draft {counts.draft || 0} · Published {counts.published || 0} · Scheduled {counts.scheduled || 0}</p>
            </div>
            <Link className="btn btn-ghost" href="/admin/posts">Reset</Link>
          </div>
          <form className="admin-search">
            <input name="q" placeholder="Tìm bài viết..." defaultValue={params.q || ""} />
            <select name="post_status" defaultValue={statusFilter}><option value="">Tất cả trạng thái</option><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select>
            <button className="btn btn-ghost" type="submit">Lọc</button>
          </form>
          <div className="admin-table-wrap">
            <table className="admin-table admin-posts-table">
              <thead><tr><th>Bài viết</th><th>Trạng thái</th><th>Category</th><th>Thời gian</th><th>Thao tác</th></tr></thead>
              <tbody>
                {posts.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.title}</strong>
                      <small>/{row.slug}</small>
                      {row.excerpt && <p>{row.excerpt}</p>}
                    </td>
                    <td><span className={`admin-status admin-status-${row.status}`}>{statusLabel(row.status)}</span></td>
                    <td>{row.categories?.name || "-"}</td>
                    <td>
                      <small>Cập nhật: {formatDate(row.updated_at)}</small>
                      <small>Xuất bản: {formatDate(row.published_at)}</small>
                      <small>Lên lịch: {formatDate(row.scheduled_at)}</small>
                    </td>
                    <td className="admin-actions">
                      <Link href={`/admin/posts?edit=${row.id}`}>Sửa</Link>
                      <Link href={`/giai-ma/${row.slug}`} target="_blank">Xem</Link>
                      <DeleteButton action={deletePost} id={row.id} />
                    </td>
                  </tr>
                ))}
                {posts.rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">Không có bài viết nào khớp bộ lọc.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
