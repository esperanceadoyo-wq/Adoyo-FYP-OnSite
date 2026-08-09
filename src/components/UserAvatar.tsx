"use client";

import Image from "next/image";
import { useState } from "react";
import { getInitials } from "@/lib/auth";

export function UserAvatar({
  className,
  name,
  sizes,
  src = "/api/profile/avatar",
}: {
  className: string;
  name: string;
  sizes: string;
  src?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-surface-variant text-on-surface-variant ${className}`}
    >
      <span className="font-extrabold">{getInitials(name)}</span>
      {!imageFailed ? (
        <Image
          alt={`${name}'s profile picture`}
          className="object-cover"
          fill
          onError={() => setImageFailed(true)}
          sizes={sizes}
          src={src}
          unoptimized
        />
      ) : null}
    </span>
  );
}
