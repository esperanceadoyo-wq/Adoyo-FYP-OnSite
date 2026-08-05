import { notFound } from "next/navigation";
import { getSpaceDetails, type Space } from "@/lib/spaces";

export async function requireSpace(identifier: string): Promise<Space> {
  const result = await getSpaceDetails(identifier);

  if (result.status === "not-found") notFound();
  if (result.status === "error") {
    throw new Error("The space service is temporarily unavailable.");
  }

  return result.space;
}
