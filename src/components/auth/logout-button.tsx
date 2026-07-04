"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      className="whitespace-nowrap rounded-xl text-sm font-semibold lg:w-full lg:justify-start"
      disabled={isLoading}
      onClick={handleLogout}
      type="button"
      variant="ghost"
    >
      <LogOut className="size-4" />
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  );
}
