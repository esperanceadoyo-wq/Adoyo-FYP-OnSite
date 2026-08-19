import Image from "next/image";

export function BrandLogo({
  className = "h-10 w-40",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      aria-label="OnSite"
      className={`brand-logo ${className}`}
      role="img"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="brand-logo-image"
        height={931}
        priority={priority}
        src="/onsite-logo.png"
        width={1689}
      />
    </span>
  );
}
