import { NextResponse, type NextRequest } from "next/server";

import { getDashboardPathForAccountType } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return NextResponse.redirect(
      new URL(
        next || getDashboardPathForAccountType(user?.user_metadata.account_type),
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
