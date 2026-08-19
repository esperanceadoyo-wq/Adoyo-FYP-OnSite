import { getBackendUrl } from "@/shared/lib/backend";

export type Space = {
  accessibility_features: string[];
  address: string;
  amenities: string[];
  atmosphere_tags: string[];
  category: string;
  cost_level: number;
  cultural_notes: string | null;
  description: string;
  id: number;
  image_alt: string | null;
  image_url: string | null;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  name: string;
  noise_level: string;
  opening_hours: Record<string, string>;
  rating: number | null;
  safety_notes: string | null;
  slug: string;
  social_intensity: number;
};

export type SpaceCatalogResult = {
  error: string | null;
  spaces: Space[];
};

export type SpaceDetailsResult =
  | { status: "ok"; space: Space }
  | { status: "not-found" }
  | { status: "error" };

export async function getSpaceCatalog(): Promise<SpaceCatalogResult> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/spaces`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { error: "The space catalog is temporarily unavailable.", spaces: [] };
    }

    const data = (await response.json()) as { spaces?: Space[] };
    return { error: null, spaces: data.spaces ?? [] };
  } catch {
    return { error: "The space catalog is temporarily unavailable.", spaces: [] };
  }
}

export async function getSpaceDetails(
  identifier: string,
): Promise<SpaceDetailsResult> {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/spaces/${encodeURIComponent(identifier)}`,
      { cache: "no-store" },
    );

    if (response.status === 404) return { status: "not-found" };
    if (!response.ok) return { status: "error" };

    const data = (await response.json()) as { space?: Space };
    return data.space
      ? { space: data.space, status: "ok" }
      : { status: "error" };
  } catch {
    return { status: "error" };
  }
}
