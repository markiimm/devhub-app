import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("name, handle").eq("id", user.id).single();

  return (
    <div className="flex min-h-screen">
      <Sidebar name={profile?.name ?? "Você"} handle={profile?.handle ?? "dev"} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
