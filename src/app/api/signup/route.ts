import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = String(formData.get("full_name") || "User");

  redirect(`/onboarding?name=${encodeURIComponent(name)}`);
}
