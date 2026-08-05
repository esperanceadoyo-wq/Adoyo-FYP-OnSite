"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SpaceRecommendation } from "@/lib/recommendations";
import { catalogSpacePath } from "@/lib/space-flow";

const MAX_USEFUL_ACCURACY_METERS = 1000;

type LocationStatus =
  | "idle"
  | "requesting"
  | "success"
  | "denied"
  | "unavailable"
  | "timeout"
  | "inaccurate"
  | "error";

export function NearbyRecommendations({ mood }: { mood: string | null }) {
  const [recommendations, setRecommendations] = useState<SpaceRecommendation[]>([]);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState("");

  async function requestNearbyRecommendations() {
    setError("");
    setRecommendations([]);

    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (position.coords.accuracy > MAX_USEFUL_ACCURACY_METERS) {
          setStatus("inaccurate");
          return;
        }

        try {
          const response = await fetch("/api/recommendations", {
            body: JSON.stringify({
              latitude: position.coords.latitude,
              limit: 3,
              location_consent: true,
              longitude: position.coords.longitude,
              ...(mood ? { mood } : {}),
            }),
            headers: { "content-type": "application/json" },
            method: "POST",
          });
          const data = (await response.json()) as {
            error?: string;
            recommendations?: SpaceRecommendation[];
          };

          if (!response.ok) {
            setError(data.error || "Nearby recommendations are unavailable.");
            setStatus("error");
            return;
          }

          setRecommendations(data.recommendations ?? []);
          setStatus("success");
        } catch {
          setError("Nearby recommendations are unavailable.");
          setStatus("error");
        }
      },
      (geolocationError) => {
        if (geolocationError.code === geolocationError.PERMISSION_DENIED) {
          setStatus("denied");
        } else if (geolocationError.code === geolocationError.TIMEOUT) {
          setStatus("timeout");
        } else {
          setStatus("unavailable");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );
  }

  return (
    <section aria-labelledby="nearby-spaces-title" className="space-y-4">
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-outline-variant bg-surface-container-low p-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-primary">
            <LocationIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-on-surface" id="nearby-spaces-title">
              Find spaces near you
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              Your location is used once for this search. Precise coordinates are
              not saved to your profile or recommendation history.
            </p>
            <LocationMessage error={error} status={status} />
          </div>
        </div>
        <button
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          disabled={status === "requesting"}
          onClick={requestNearbyRecommendations}
          type="button"
        >
          <LocationIcon className="h-4 w-4" />
          {status === "requesting"
            ? "Checking location..."
            : status === "success"
              ? "Update nearby spaces"
              : "Use my location"}
        </button>
      </div>

      {status === "success" ? (
        recommendations.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recommendations.map((recommendation) => (
              <NearbyCard
                key={recommendation.space.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">
            No active spaces are available nearby right now.
          </p>
        )
      ) : null}
    </section>
  );
}

function NearbyCard({
  recommendation,
}: {
  recommendation: SpaceRecommendation;
}) {
  const { distance_km: distanceKm, reason, score, space } = recommendation;

  return (
    <article className="flex min-h-36 overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-sm">
      <div className="relative w-28 shrink-0 bg-surface-container-highest">
        {space.image_url ? (
          <Image
            alt={space.image_alt || space.name}
            className="object-cover"
            fill
            sizes="112px"
            src={space.image_url}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary">
            <LocationIcon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-extrabold text-on-surface">
            {space.name}
          </h4>
          <span className="shrink-0 text-[10px] font-bold text-primary">
            {Math.round(score)}%
          </span>
        </div>
        <p className="mt-1 text-xs font-bold text-on-surface-variant">
          {distanceKm === null ? "Distance unavailable" : formatDistance(distanceKm)}
        </p>
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-on-surface-variant">
          {reason}
        </p>
        <Link
          className="mt-auto pt-2 text-xs font-extrabold text-primary"
          href={catalogSpacePath(space.slug)}
        >
          View Space
        </Link>
      </div>
    </article>
  );
}

function LocationMessage({
  error,
  status,
}: {
  error: string;
  status: LocationStatus;
}) {
  const messages: Partial<Record<LocationStatus, string>> = {
    denied: "Location permission was denied. Allow it in your browser settings to try again.",
    error,
    inaccurate: "Your current location is too approximate for nearby results. Move to an area with a clearer GPS signal and try again.",
    requesting: "Requesting a one-time location reading...",
    success: "Nearby recommendations updated. Your coordinates were not saved.",
    timeout: "The location request timed out. Check your signal and try again.",
    unavailable: "Your current device or browser could not provide a location.",
  };
  const message = messages[status];

  return message ? (
    <p
      aria-live="polite"
      className={`mt-2 text-xs font-semibold ${
        status === "success" || status === "requesting"
          ? "text-primary"
          : "text-error"
      }`}
    >
      {message}
    </p>
  ) : null;
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) return `${Math.max(10, Math.round(distanceKm * 1000))} m away`;
  return `${distanceKm.toFixed(1)} km away`;
}

function LocationIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
