import { AdminNotice, AdminShell } from "@/components/admin/AdminShell";
import { dashboardCounts } from "@/services/cms";

export default async function DashboardPage() {
  const counts = await dashboardCounts();
  return (
    <AdminShell title="Dashboard" subtitle="Tổng quan nội dung, SEO và media của Panharmon.">
      <AdminNotice configured={counts.configured} />
      <div className="admin-cards">
        {[
          ["Posts", counts.posts],
          ["Categories", counts.categories],
          ["Tags", counts.tags],
          ["Media", counts.media]
        ].map(([label, value]) => (
          <article key={label} className="admin-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
