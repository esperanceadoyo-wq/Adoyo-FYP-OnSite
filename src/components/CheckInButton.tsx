"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { catalogSpacePath } from "@/lib/space-flow";
import type { Visit } from "@/lib/visits";

const MAX_VISIT_ACCURACY_METERS = 250;

type CheckInStatus =
  | "idle"
  | "requesting"
  | "denied"
  | "unavailable"
  | "timeout"
  | "inaccurate"
  | "out-of-range"
  | "error";

type VisitResponse = {
  error?: string;
  maximum_accuracy_meters?: number;
  verification?: {
    accuracy_meters: number;
    allowed_distance_meters: number;
    distance_meters: number;
  };
  visit?: Visit;
};

export function CheckInButton({
  spaceId,
  spaceSlug,
}: {
  spaceId: number;
  spaceSlug: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<CheckInStatus>("idle");
  const [message, setMessage] = useState("");

  function checkIn() {
    setMessage("");

    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (position.coords.accuracy > MAX_VISIT_ACCURACY_METERS) {
          setStatus("inaccurate");
          return;
        }

        try {
          const response = await fetch("/api/visits", {
            body: JSON.stringify({
              accuracy_meters: position.coords.accuracy,
              latitude: position.coords.latitude,
              location_consent: true,
              longitude: position.coords.longitude,
              space_id: spaceId,
            }),
            headers: { "content-type": "application/json" },
            method: "POST",
          });
          const data = (await response.json()) as VisitResponse;

          if (!response.ok || !data.visit || !data.verification) {
            setMessage(data.error || "Your visit could not be verified.");
            setStatus(response.status === 422 ? "out-of-range" : "error");
            return;
          }

          const query = new URLSearchParams({
            accuracy: String(data.verification.accuracy_meters),
            allowed: String(data.verification.allowed_distance_meters),
            distance: String(data.verification.distance_meters),
            visitId: String(data.visit.id),
          });
          router.push(
            `${catalogSpacePath(spaceSlug, "/verify")}?${query.toString()}`,
          );
        } catch {
          setStatus("error");
          setMessage("The check-in service is temporarily unavailable.");
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

  const statusMessage = message || checkInStatusMessage(status);

  return (
    <div className="space-y-3">
      <button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary-container shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
        disabled={status === "requesting"}
        onClick={checkIn}
        type="button"
      >
        <span className="material-symbols-outlined text-xl">my_location</span>
        {status === "requesting" ? "Verifying location..." : "Verify and Check In"}
      </button>
      {statusMessage ? (
        <p aria-live="polite" className="text-sm font-medium text-error">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}

function checkInStatusMessage(status: CheckInStatus) {
  const messages: Partial<Record<CheckInStatus, string>> = {
    denied: "Location permission was denied. Allow it in your browser settings to check in.",
    inaccurate: "Your location reading is too approximate to verify this visit. Move to an area with a clearer GPS signal and try again.",
    "out-of-range": "You are not close enough to this space to check in.",
    timeout: "The location request timed out. Check your signal and try again.",
    unavailable: "Your device or browser could not provide a location.",
  };
  return messages[status] ?? "";
}
