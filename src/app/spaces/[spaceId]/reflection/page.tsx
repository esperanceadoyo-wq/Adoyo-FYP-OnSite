import type { Metadata } from "next";
import { ReflectionForm } from "@/components/ReflectionForm";
import { featuredSpace, spacePath } from "@/lib/space-flow";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: `Post-Visit Reflection | ${featuredSpace.name}`,
};

export default async function PostVisitReflectionPage() {
  await requireAuth(spacePath("/reflection"));

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1120] p-4 text-white">
      <div className="relative flex h-auto w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0B1120] p-10 shadow-2xl lg:max-w-4xl">
        <ReflectionForm />
      </div>
    </main>
  );
}
