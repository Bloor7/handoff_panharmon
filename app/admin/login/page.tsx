import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="page-shell">
      <div className="page-head">
        <div className="eyebrow"><span className="dot"></span>CMS</div>
        <h1 className="page-title">Đăng nhập <em>quản trị</em></h1>
        <p className="page-sub">Chỉ email và mật khẩu admin trong .env mới vào được khu vực /admin.</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
