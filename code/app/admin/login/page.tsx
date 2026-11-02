import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/adminAuth";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <LoginForm />
    </main>
  );
}
