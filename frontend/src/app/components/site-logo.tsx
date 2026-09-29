import Image from "next/image";
import Link from "next/link";

interface SiteLogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    iconClassName?: string;
    animate?: boolean;
    asLink?: boolean;
}

export function SiteLogo({
    size = "md",
    className = "",
    iconClassName = "",
    animate = false,
    asLink = false,
}: SiteLogoProps) {
    const sizeClasses = {
        sm: "w-36 h-7",
        md: "w-40 h-8",
        lg: "w-[180px] h-8",
        xl: "w-[270px] h-12",
    };

    // Match the portal's viewport crop without changing the original asset.
    const logo = (
        <span
            className={`relative inline-block shrink-0 overflow-hidden align-middle ${sizeClasses[size]} ${
                animate ? "sidebar-fade-in" : ""
            } ${className} ${iconClassName}`}
        >
            <Image
                src="/growthcast-wordmark.png"
                alt="GrowthCast"
                width={5906}
                height={2363}
                sizes={size === "xl" ? "338px" : "225px"}
                className="absolute left-1/2 top-1/2 h-auto w-[125%] max-w-none -translate-x-1/2 -translate-y-1/2 dark:invert"
                priority
            />
        </span>
    );

    if (asLink) {
        return (
            <Link
                href="https://growthcast.app"
                className="inline-flex cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
                {logo}
            </Link>
        );
    }

    return logo;
}
